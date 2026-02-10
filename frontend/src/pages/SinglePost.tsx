import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PostType } from "../components/PostCard";
import axios from "axios";
import "../styles/singlepost.css";
import Comments from "../components/Comments";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<PostType | null>(null);
  const [isError, setIsError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `https://blog-project-2nvf.onrender.com/api/post/${id}`,
      );
      if (response.data.success) {
        setPost(response.data.data);
      }
    } catch (error: any) {
      setIsError(
        error.response?.data?.message || error.message || "post fach error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);
  if (isLoading) return <h2>Loading....</h2>;
  if (isError) return <h2 style={{ color: "red" }}>{isError}</h2>;
  if (!post) return <h2>Post Not found</h2>;

  const { title, description, image, createdAt, author } = post;
  const createdDate = createdAt.split("T")[0];

  return (
    <div className="single-container">
      <img
        src={
          image ||
          "https://static.thenounproject.com/png/default-image-icon-4595376-512.png"
        }
        alt={title}
        className="single-image"
      />

      <div className="single-content">
        <h1>{title}</h1>
        <p>{description}</p>

        <div className="single-meta">
          <span>Author: {author?.email}</span>
          <span>Created: {createdDate}</span>
        </div>
      </div>
      <Comments />
    </div>
  );
};

export default SinglePost;
