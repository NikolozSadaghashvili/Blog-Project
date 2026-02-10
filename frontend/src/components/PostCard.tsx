import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";

export interface PostType {
  _id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  author: {
    id: string;
    email: string;
    name: string;
  };
  likes: string[];
}

interface PostCardProps {
  post: PostType;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { image, title, description, author, _id, createdAt, likes } = post;

  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id;
  const likeIncludes = userId ? likes.includes(userId) : false;
  console.log(likeIncludes);

  const [isLike, setIsLike] = useState<boolean>(likeIncludes);

  useEffect(() => {
    if (!user?.id) return;
    setIsLike(likes.includes(user.id));
  }, [likes, user]);

  const likePost = async (postId: string) => {
    try {
      const response = await axios.put(
        `https://blog-project-2nvf.onrender.com/api/post/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setIsLike(!isLike);
        return;
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message || "Unknown error",
      );
    }
  };

  return (
    <div className="post-card">
      {/* მარცხნივ სურათი */}
      <img
        src={
          image ||
          "https://static.thenounproject.com/png/default-image-icon-4595376-512.png"
        }
        alt={title}
        className="post-image"
      />

      {/* შუაში ინფორმაცია */}
      <div className="post-content">
        <h4 className="post-title">{title}</h4>
        <p className="post-description">{description.substring(0, 300)}</p>
        <div className="post-meta">
          <span className="post-author">Author: {author.email}</span>
          <span className="post-date">Created: {createdAt.split("T")[0]}</span>
          <span className="post-date">Like: {likes.length}</span>
        </div>
      </div>

      {/* მარჯვნივ ღილაკები */}
      <div className="post-actions">
        <button className="more-btn" onClick={() => navigate(`/post/${_id}`)}>
          More...
        </button>
        {user && (
          <button onClick={() => likePost(_id)}>
            {isLike ? "Unlike" : "Like"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
