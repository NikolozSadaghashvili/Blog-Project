import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const { setUser, user } = useUser();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "https://blog-project-2nvf.onrender.com/api/auth/register",
        { name: name.trim(), email: email.trim(), password: password.trim() },
      );
      console.log(response);
      if (response.data.success) {
        const { name, email, token, id } = response.data.data;
        console.log(response.data);
        setUser({ id, name, email, token });
        navigate("/");
        return;
      }
      setError("Unexpected server response");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        {error && <span className="error">{error}</span>}

        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
