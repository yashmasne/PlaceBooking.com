import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import AccountNav from "../AccountNav";
import { FaUserCircle, FaSuitcase, FaHeart, FaHome, FaPlus } from "react-icons/fa";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) {
    return <div className="text-center py-16 text-gray-400">Loading profile...</div>;
  }

  if (ready && !user && !redirect) {
    return <Navigate to="/login" />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <AccountNav />

      {/* User Info Card */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-8 shadow-sm mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-rose-400 text-white font-bold text-3xl flex items-center justify-center shadow-lg shrink-0 uppercase">
          {user.name?.[0] || "U"}
        </div>
        <div className="grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span className="self-center sm:self-start bg-rose-50 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-rose-200">
              Verified Member
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start">
            <button
              onClick={logout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold py-2.5 px-6 rounded-full transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link
          to="/account/bookings"
          className="p-6 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 rounded-3xl transition-all group flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary text-xl mb-4 group-hover:scale-110 transition-transform">
            <FaSuitcase />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">My Bookings</h3>
            <p className="text-gray-500 text-xs">Review your reserved stays and payment receipts</p>
          </div>
        </Link>

        <Link
          to="/account/wishlist"
          className="p-6 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 rounded-3xl transition-all group flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary text-xl mb-4 group-hover:scale-110 transition-transform">
            <FaHeart />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Saved Wishlists</h3>
            <p className="text-gray-500 text-xs">Browse properties you have bookmarked for future trips</p>
          </div>
        </Link>

        <Link
          to="/account/places"
          className="p-6 bg-gray-50 hover:bg-gray-100/80 border border-gray-200/80 rounded-3xl transition-all group flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary text-xl mb-4 group-hover:scale-110 transition-transform">
            <FaHome />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">My Accommodations</h3>
            <p className="text-gray-500 text-xs">Manage properties you host, edit details and pricing</p>
          </div>
        </Link>
      </div>
    </div>
  );
}