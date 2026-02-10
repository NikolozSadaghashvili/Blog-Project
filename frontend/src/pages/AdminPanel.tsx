import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../styles/adminPage.css";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const AdminPanel = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://blog-project-2nvf.onrender.com/api/admin/panel",
        { password },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setVerify(true);
        setPassword("");
      } else {
        toast.error("Wrong password");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <div className="adminContainer">
      {!verify ? (
        <form className="adminCard" onSubmit={handleSubmit}>
          <h2>Admin Panel</h2>

          <label>Enter Admin Password</label>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      ) : (
        <div className="adminDashboard">
          <ul>
            <li>
              <Link to="/admin/users">Users</Link>
            </li>
            <li>
              <Link to="/admin/posts">Posts</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
