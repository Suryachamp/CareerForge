import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../features/auth/hooks/use.auth";

const Navbar = () => {
  const { handleLogout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#111827]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-white text-lg tracking-tight z-50">
          <span className="text-rose-500 text-xl">★</span>
          <span>CareerForge</span>
        </Link>

        {/* Navigation Links (Desktop) */}
        {user && (
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
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

        {/* Right Section (Desktop User Actions + Mobile Menu Toggle) */}
        <div className="flex items-center gap-4 z-50">
          {/* User Profile (Desktop only) */}
          {user && (
            <span className="hidden md:inline text-xs text-gray-500 font-medium">
              Logged in as <span className="text-gray-300 font-semibold">{user.username || user.email}</span>
            </span>
          )}

          {/* Action Button (Desktop only) */}
          <div className="hidden md:block">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger Menu Toggle (Mobile only) */}
          {user && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-400 hover:text-white focus:outline-none p-1"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          )}

          {/* Sign In Button (Mobile only when logged out) */}
          {!user && (
            <div className="md:hidden">
              <Link
                to="/login"
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer/Menu (Below Header) */}
      {user && isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-800/60 flex flex-col gap-4">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors duration-200 py-1 ${
                isActive ? "text-rose-500" : "text-gray-400 hover:text-gray-200"
              }`
            }
          >
            New Plan
          </NavLink>
          <NavLink
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors duration-200 py-1 ${
                isActive ? "text-rose-500" : "text-gray-400 hover:text-gray-200"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/history"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors duration-200 py-1 ${
                isActive ? "text-rose-500" : "text-gray-400 hover:text-gray-200"
              }`
            }
          >
            History
          </NavLink>
          
          <div className="pt-2 border-t border-gray-800/40 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Logged in as <span className="text-gray-300">{user.username || user.email}</span>
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
