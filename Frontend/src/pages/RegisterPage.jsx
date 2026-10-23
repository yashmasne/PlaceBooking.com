import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "../ToastContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function registerUser(ev) {
    ev.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      toast.success("Account created! Log in to start booking.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-12 flex items-center justify-center min-h-[65vh]">
      <div className="w-full max-w-md bg-white border border-gray-200/80 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-rose-400 flex items-center justify-center text-white shadow-md mx-auto mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-xs text-gray-500 mt-1">Join PlaceBooking to book stays and list homes</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-2xl mb-4 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={registerUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            className="primary py-3 font-semibold text-base shadow-md disabled:opacity-50 mt-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="text-center pt-6 text-xs text-gray-500 border-t border-gray-100 mt-6">
          Already a member?{" "}
          <Link className="font-semibold text-primary underline" to="/login">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
