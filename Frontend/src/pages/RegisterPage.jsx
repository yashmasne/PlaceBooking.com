import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function registerUser(ev) {
    ev.preventDefault();
    setError("");

    if (name.trim().length < 2 || !email.trim() || password.length < 6) {
      setError("Enter a name, valid email, and password of at least 6 characters.");
      return;
    }

    try {
      await axios.post("/register", { name: name.trim(), email: email.trim(), password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 w-full max-w-md">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="mx-auto" onSubmit={registerUser}>
          <input type="text" placeholder="John Doe" value={name}
            onChange={(ev) => setName(ev.target.value)} autoComplete="name" />
          <input type="email" placeholder="your@email.com" value={email}
            onChange={(ev) => setEmail(ev.target.value)} autoComplete="email" />
          <input type="password" placeholder="Minimum 6 characters" value={password}
            onChange={(ev) => setPassword(ev.target.value)} autoComplete="new-password" />
          <button className="primary" type="submit">Register</button>
          {error && <div className="text-red-500 mt-3 text-center">{error}</div>}
          <div className="text-center py-2 text-gray-500">
            Already a member?{" "}
            <Link className="underline text-black" to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
