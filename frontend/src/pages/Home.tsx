import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import type { PostType } from "../components/PostCard";
import { useEffect, useState } from "react";
import axios from "axios";
import LeftNavbar from "../components/LeftNavbar";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPost] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://blog-project-2nvf.onrender.com/api/post",
      );
      setPost(response.data.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (isLoading || posts.length === 0) return <h2>Loading....</h2>;

  const featured = posts[0];
  const others = posts.slice(1, 5);
  return (
    <div className="magazine-root">
      <LeftNavbar />

      <main className="magazine-main">
        <section className="featured">
          <div className="featured-image-wrap">
            <img src={featured.image || ""} alt={featured.title} />
          </div>
          <div className="featured-content">
            <div className="meta">
              By {featured.author.name || ""} •{" "}
              {featured.createdAt.split("T")[0]}
            </div>
            <h1 className="featured-title">{featured.title}</h1>
            <p className="featured-desc">{featured.description}</p>
            <div className="featured-actions">
              <Link to={`/post/${featured._id}`} className="btn primary">
                Read more
              </Link>
              <Link to="/post" className="btn ghost">
                More articles
              </Link>
            </div>
          </div>
        </section>

        <section className="posts-grid">
          {others.map((p) => (
            <article
              key={p._id}
              className="home-post-card"
              onClick={() => navigate(`/post/${p._id}`)}
            >
              <img className="card-img" src={p.image} alt={p.title} />
              <div className="card-body">
                <h4 className="card-title">{p.title.substring(0, 35)}...</h4>
                <p className="card-desc">{p.description.substring(0, 55)}...</p>
                <div className="card-meta">
                  <span>{p.author.name || ""}</span>
                  <span>{p.createdAt.split("T")[0]}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
