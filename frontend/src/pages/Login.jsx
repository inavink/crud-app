import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";

export default function Login({ onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await loginUser({ username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userRole", data.role);
      onAuth();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        New user? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
