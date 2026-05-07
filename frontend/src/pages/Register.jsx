import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await registerUser({ username, password });
      setMessage("Registration successful. You can now log in.");
      setUsername("");
      setPassword("");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p>
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
