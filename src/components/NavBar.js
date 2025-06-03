import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/add-todo", label: "Add Todo" },
  { to: "/todos", label: "All Todos" },
  { to: "/todos/completed", label: "Completed" },
  { to: "/api-todos", label: "API Todos" },
  { to: "/local-todos", label: "Local Todos" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight"
        >
          <span className="inline-block align-middle mr-2">📝</span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            To Do List
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div
            className={`flex-col md:flex md:flex-row md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white/90 dark:bg-gray-900/90 md:bg-transparent transition-all duration-300 ease-in-out ${
              menuOpen ? "flex" : "hidden"
            } shadow md:shadow-none rounded-b-2xl md:rounded-none`}
          >
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-2 font-medium text-gray-700 dark:text-gray-200 relative group hover:text-indigo-600 dark:hover:text-indigo-400 md:p-0 md:bg-transparent transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="inline-block">
                      {link.label}
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                ))}
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
                  >
                    <span className="hidden md:block">{user?.username || user?.email}</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 md:p-0"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md md:ml-4"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="ml-0 md:ml-4 mt-2 md:mt-0 p-2 rounded-full bg-white/60 dark:bg-gray-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 shadow transition-colors focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 6.66l-.71-.71M4.05 4.05l-.71-.71"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
