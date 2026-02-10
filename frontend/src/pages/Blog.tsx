import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/blog.css";
import PostCard, { type PostType } from "../components/PostCard";
import LeftNavbar from "../components/LeftNavbar";

const Blog = () => {
  const [isError, setIsError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostType[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://blog-project-2nvf.onrender.com/api/post",
      );
      if (!response.data.success) {
        setIsError(response.data.message);
        setIsLoading(false);
        return;
      }
      setPosts(response.data.data.reverse());
    } catch (error: any) {
      console.log(error);
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <h1>Loading....</h1>;
  }
  if (isError) {
    return <h1>{isError}</h1>;
  }

  return (
    <div className="blog-container">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Blog;
