import "../styles/header.css";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        <h2>MINI-BLOG</h2>
      </div>
      <div className="list">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/post">Posts</Link>
          </li>
        </ul>
      </div>
      {user ? (
        <div className="user-actions">
          <ul>
            <li>
              <Link to="/post/add">Create Post</Link>
            </li>
            <li>
              <Link to="/post/my">My Posts</Link>
            </li>
          </ul>

          <div className="user-info">
            <span>Hello, {user.name}</span>
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <ul className="auth-links">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Signup</Link>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;
