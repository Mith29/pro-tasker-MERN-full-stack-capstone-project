import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import Logo from "../assets/protasker-logo3.png";

function Navbar() {
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
<div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="ProTasker Logo" className="h-50 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          {user?.firstName && (
            <span className="text-purple-600 font-medium text-xl">
              Welcome {user.firstName}!
            </span>
          )}

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 font-medium text-xl"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4 bg-white">

          {user?.firstName && (
            <span className="text-gray-600 font-medium">
              Welcome {user.firstName}
            </span>
          )}

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;