import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/comments.css";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";

interface CommentType {
  _id: string;
  content: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const Comments = () => {
  const { user } = useUser();
  const { id } = useParams();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isError, setIsError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");

  const fetchComment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comment/${id}`
      );
      if (response.data.success) {
        setComments(response.data.comments.reverse());
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsError(
        error.response?.data?.message || error.message || "unknow error"
      );
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/comment",
        {
          postId: id,
          content: content,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (response.data.success) {
        setContent("");
        setIsLoading(false);
        toast.success(response.data.message);
        fetchComment();
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(
        error.response?.data?.message || error.message || "unknow error"
      );
      setIsError(
        error.response?.data?.message || error.message || "unknow error"
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchComment();
  }, [id]);

  if (isLoading) return <h2>Loading....</h2>;

  const deleteComment = async (commentId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Delete success");
        fetchComment();
      }
    } catch (error: any) {
      setIsError(
        error.response?.data?.message || error.message || "unknow error"
      );
    }
  };

  return (
    <div className="comments-wrapper">
      <h2 className="comments-title">Comments</h2>

      {/* COMMENT ADD FORM */}
      <span style={{ color: "red" }}>{isError}</span>
      {user && (
        <form onSubmit={handleSubmit}>
          <div className="add-comment-box">
            <textarea
              className="comment-input"
              placeholder="Write a comment..."
              value={content}
              rows={3}
              onChange={(e) => setContent(e.target.value)}
              // შენ დაამატებ value + onChange
            ></textarea>

            <button className="add-comment-btn" type="submit">
              Add Comment
            </button>
          </div>
        </form>
      )}
      {/* COMMENT LIST */}
      <div className="comments-list">
        {comments.map((e) => (
          <div key={e._id} className="comment-card">
            <div className="comment-header">
              <span className="comment-author">{e.user?.email}</span>

              <span className="comment-date">{e.createdAt.split("T")[0]}</span>
            </div>

            <p className="comment-content">{e.content}</p>
            {user?.email === e.user?.email && (
              <button onClick={() => deleteComment(e._id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
