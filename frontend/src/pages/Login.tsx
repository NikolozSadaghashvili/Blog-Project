import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/login.css";

const Login = () => {
  const { setUser, user } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("please fill all input");
      return;
    }

    try {
      const response = await axios.post(
        "https://blog-project-2nvf.onrender.com/api/auth/login",
        { email, password },
      );

      setUser({
        id: response.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        token: response.data.token,
      });
      navigate("/");
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
