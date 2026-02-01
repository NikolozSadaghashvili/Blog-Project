import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/addPost.css";
import axios from "axios";
import toast from "react-hot-toast";

const CreatePost = () => {
  const location = useLocation();

  const editingPost = location.state?.post;
  const { user } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>(editingPost?.title || "");
  const [description, setDescription] = useState<string>(
    editingPost?.description || ""
  );
  const [image, setImage] = useState<string>(editingPost?.image || "");

  const [isError, setIsError] = useState<string>("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingPost) {
        const response = await axios.put(
          `http://localhost:5000/api/post/${editingPost._id}`,
          { title, description, image },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        if (response.data.success) {
          setImage("");
          setTitle("");
          setDescription("");
          toast.success(response.data.message);
          navigate("/post/my");
        }
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/post",
          {
            title,
            description,
            image,
          },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );
        if (response.data.success) {
          setImage("");
          setTitle("");
          setDescription("");
          toast.success(response.data.message);
          navigate("/post/my");
        }
      }
    } catch (error: any) {
      setIsError(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="add-post">
      <h2 className="add-title">{editingPost ? "Edit Post" : "Create Post"}</h2>
      {isError && <span style={{ color: "red" }}>{isError}</span>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="enter image url..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button type="submit">{editingPost ? "Edit Post" : "Add Post"}</button>
      </form>
    </div>
  );
};

export default CreatePost;
