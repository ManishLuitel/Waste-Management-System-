import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/userlogin");
  };

  return (
    <nav className="sticky top-0 z-50 bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* 🌱 Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🌱</span>
          <h1 className="font-bold text-lg md:text-2xl tracking-wide">
            Banepa Waste Management
          </h1>
        </Link>

        {/* 🔗 Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 font-medium">
          <Link
            to="/"
            className="hover:bg-green-600 px-3 py-1 rounded transition"
          >
            Home
          </Link>

          <Link
            to="/schedule"
            className="hover:bg-green-600 px-3 py-1 rounded transition"
          >
            Schedule
          </Link>

          <Link
            to="/special-request"
            className="hover:bg-green-600 px-3 py-1 rounded transition"
          >
            Special Request
          </Link>

          <Link
            to="/compost-request"
            className="hover:bg-green-600 px-3 py-1 rounded transition"
          >
            Compost Request
          </Link>

          {/* 🔐 Auth Buttons */}
          {!token ? (
            <>
              <Link
                to="/userlogin"
                className="bg-white text-green-700 px-4 py-1 rounded-lg hover:bg-gray-100 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="border border-white px-4 py-1 rounded-lg hover:bg-green-600 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* 📱 Mobile Menu Icon (future) */}
        <button className="md:hidden text-2xl">☰</button>
      </div>
    </nav>
  );
}
