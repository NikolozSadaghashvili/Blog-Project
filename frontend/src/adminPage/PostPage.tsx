import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

type Post = {
  _id: string;
  title: string;
  author: { email: string };
};
const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useUser();
  const fetchPost = async () => {
    try {
      const response = await axios.get(
        "https://blog-project-2nvf.onrender.com/api/post/",
      );
      console.log(response);
      if (response.data.success) {
        setPosts(response.data.data);
        setIsLoading(false);
        console.log(posts);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `https://blog-project-2nvf.onrender.com/api/post/${id}`,
        { headers: { Authorization: `Bearer ${user?.token}` } },
      );
      if (response.data.success) {
        fetchPost();
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoading) return <h1>Loading....</h1>;

  return (
    <div className="usersContainer">
      <h2>Users List</h2>

      <div className="usersTable">
        <div className="tableHeader">
          <span>Name</span>
          <span>Email</span>
          <span>Action</span>
        </div>

        {posts.map((p) => (
          <div key={p._id} className="tableRow">
            <span>{p.title}</span>
            <span>{p.author.email}</span>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
