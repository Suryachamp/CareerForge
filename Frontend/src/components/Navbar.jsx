import React from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../features/auth/hooks/use.auth";

const Navbar = () => {
  const { handleLogout, user } = useAuth();

  return (
    <nav className="bg-[#111827]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-white text-lg tracking-tight">
          <span className="text-rose-500 text-xl">★</span>
          <span>InterviewAI</span>
        </Link>

        {/* Navigation Links */}
        {user && (
          <div className="flex items-center gap-6 text-sm font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors duration-200 ${
                  isActive ? "text-rose-500" : "text-gray-400 hover:text-gray-200"
                }`
              }
            >
              New Plan
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `transition-colors duration-200 ${
                  isActive ? "text-rose-500" : "text-gray-400 hover:text-gray-200"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `transition-colors duration-200 ${
                  isActive ? "text-rose-500" : "text-gray-400 hover:text-gray-200"
                }`
              }
            >
              History
            </NavLink>
          </div>
        )}

        {/* User Actions */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-gray-500 font-medium">
              Logged in as <span className="text-gray-300 font-semibold">{user.username || user.email}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
