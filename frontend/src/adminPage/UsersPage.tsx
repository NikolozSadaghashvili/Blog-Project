import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/users.css";

type User = {
  _id: string;
  name: string;
  email: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useUser();
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://blog-project-2nvf.onrender.com/api/auth",
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        },
      );
      if (response.data.success) {
        setIsLoading(false);
        setUsers(response.data.data);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return <h1>Loading....</h1>;
  }
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `https://blog-project-2nvf.onrender.com/api/auth/${id}`,
        { headers: { Authorization: `Bearer ${user?.token}` } },
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="usersContainer">
      <h2>Users List</h2>

      <div className="usersTable">
        <div className="tableHeader">
          <span>Name</span>
          <span>Email</span>
          <span>Action</span>
        </div>

        {users.map((u) => (
          <div key={u._id} className="tableRow">
            <span>{u.name}</span>
            <span>{u.email}</span>
            <button onClick={() => handleDelete(u._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
