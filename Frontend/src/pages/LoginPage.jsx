import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const { data } = await axios.post("/login", {
        email: email.trim(),
        password,
      });
      setUser(data);
      setRedirect(true);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    }
  }

  if (redirect) return <Navigate to="/" />;

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 w-full max-w-md">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="mx-auto" onSubmit={handleLoginSubmit}>
          <input type="email" placeholder="your@email.com" value={email}
            onChange={(ev) => setEmail(ev.target.value)} autoComplete="email" />
          <input type="password" placeholder="password" value={password}
            onChange={(ev) => setPassword(ev.target.value)} autoComplete="current-password" />
          <button className="primary" type="submit">Login</button>
          {error && <div className="text-red-500 mt-3 text-center">{error}</div>}
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{" "}
            <Link className="underline text-black" to="/register">Register now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
