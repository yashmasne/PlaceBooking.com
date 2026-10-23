import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "./UserContext.jsx";
import { WishlistContext } from "./WishlistContext.jsx";
import { useToast } from "./ToastContext.jsx";
import { FaHeart, FaUserCircle, FaBars } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import axios from "axios";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const { count: wishlistCount } = useContext(WishlistContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await axios.post("/logout");
      setUser(null);
      setDropdownOpen(false);
      navigate("/");
      toast.info("You've been logged out.");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    }
  }

  function handleSearchClick() {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    const searchInput = document.getElementById("homepage-search-input");
    if (searchInput) searchInput.focus();
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3.5 px-4 sm:px-8 -mx-4 sm:-mx-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-rose-400 flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:inline-block">
            Place<span className="text-primary">Booking</span>
          </span>
        </Link>

        {/* Center Search Pill */}
        <button
          type="button"
          onClick={handleSearchClick}
          className="flex items-center gap-2 sm:gap-3 border border-gray-300/80 hover:border-gray-400 rounded-full py-2 px-3 sm:px-4 shadow-sm hover:shadow transition-all bg-white text-sm"
        >
          <span className="font-semibold text-gray-800 text-xs sm:text-sm pl-1">Anywhere</span>
          <span className="border-r border-gray-200 h-4"></span>
          <span className="font-medium text-gray-600 text-xs sm:text-sm hidden sm:inline">Any week</span>
          <span className="border-r border-gray-200 h-4 hidden sm:inline"></span>
          <span className="text-gray-400 text-xs sm:text-sm hidden md:inline">Add guests</span>
          <div className="bg-primary text-white p-2 rounded-full shadow-sm ml-1">
            <FiSearch className="text-sm" />
          </div>
        </button>

        {/* Right Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Become a Host Link */}
          <Link
            to={user ? "/account/places/new" : "/login"}
            className="hidden md:inline-block text-xs sm:text-sm font-semibold text-gray-700 hover:text-black py-2 px-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Become a Host
          </Link>

          {/* Wishlists Shortcut */}
          <Link
            to={user ? "/account/wishlist" : "/login"}
            className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-700 hover:text-primary transition-colors"
            title="Wishlists"
          >
            <FaHeart className="text-lg" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Profile Menu Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 border border-gray-300 rounded-full py-1.5 pl-3 pr-2 hover:shadow-md transition-shadow cursor-pointer bg-white"
              aria-label="User menu"
            >
              <FaBars className="text-gray-600 text-xs sm:text-sm" />
              <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                {user ? (
                  <span>{user.name?.[0] || "U"}</span>
                ) : (
                  <FaUserCircle className="text-2xl text-gray-400" />
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150">
                {user ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/account/wishlist"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Wishlists ({wishlistCount})
                    </Link>

                    <Link
                      to="/account/bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      My Bookings
                    </Link>

                    <Link
                      to="/account/places"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      My Accommodations
                    </Link>

                    <Link
                      to="/account/places/new"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-primary hover:bg-gray-50 font-semibold"
                    >
                      + Add New Listing
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <Link
                      to="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                    >
                      Account Settings
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 font-medium"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                    >
                      Sign up
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-xs"
                    >
                      Host your home
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
