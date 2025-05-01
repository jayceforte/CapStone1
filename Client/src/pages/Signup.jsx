import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function Signup() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });
      navigate("/"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Create Your Account</button>
      {error && <p style={{ color: "blue" }}>{error}</p>}
    </form>
  );
}