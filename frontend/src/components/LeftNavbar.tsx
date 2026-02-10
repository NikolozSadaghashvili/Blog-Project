import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const LeftNavbar = () => {
  const { user } = useUser();
  return (
    <aside className="magazine-sidebar">
      <div className="sidebar-inner">
        <nav className="sidebar-nav">
          <Link to="/">Home</Link>
          <Link to="/post">All Posts</Link>
          <Link to="/about">About</Link>
          {user?.admin && (
            <Link to="/admin" style={{ color: "red" }}>
              Admin Panel
            </Link>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default LeftNavbar;
