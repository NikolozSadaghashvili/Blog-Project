import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import type { PostType } from "./Blog";
import axios from "axios";
import "../styles/mypost.css";
import toast from "react-hot-toast";

const MyPost = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostType[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/post/my", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (response.data.success) {
        setPost(response.data.data.reverse());
        setIsLoading(false);
        setError("");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };
  const handleEdit = (post: PostType) => {
    // გადაგზავნე პოსტს AddPost გვერდზე state-ის მეშვეობით
    navigate("/post/add", { state: { post } });
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `http://localhost:5000/api/post/${id}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
      fetchData();
    } catch (error: any) {
      setError(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    fetchData();
  }, [user, navigate]);

  if (error) {
    return <h1>{error}</h1>;
  }
  if (isLoading) {
    return <h1>Loading....</h1>;
  }
  return (
    <div className="blog-container">
      {post.length === 0 && <h1 className="no-posts">You don't have posts</h1>}
      {post.map((post) => {
        const { _id, image, title, description, author, createdAt } = post;
        const createdDate = createdAt.split("T")[0];

        return (
          <div key={_id} className="post-card">
            <img
              src={
                image ||
                "https://static.thenounproject.com/png/default-image-icon-4595376-512.png"
              }
              alt={title}
              className="post-image"
            />
            <div className="post-content">
              <h4 className="post-title">{title}</h4>
              <p className="post-description">{description}</p>
              <div className="post-meta">
                <span className="post-author">Author: {author.email}</span>
                <span className="post-date">Created: {createdDate}</span>
              </div>
            </div>
            <div className="post-actions">
              <button className="edit-btn" onClick={() => handleEdit(post)}>
                Edit
              </button>
              <button className="del-btn" onClick={() => handleDelete(_id)}>
                Delete
              </button>
              <button
                className="more-btn"
                onClick={() => navigate(`/post/${_id}`)}
              >
                More...
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyPost;
