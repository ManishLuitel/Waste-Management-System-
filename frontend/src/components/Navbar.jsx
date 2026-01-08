import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import WasteLogo from "./WasteLogo";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/userlogin");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="group-hover:scale-110 transition-transform duration-200">
              <WasteLogo className="w-12 h-12" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-wide">
                Banepa Waste
              </h1>
              <p className="text-green-100 text-xs -mt-1">Management System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/schedule"
              className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200 font-medium"
            >
              Schedule
            </Link>
            <Link
              to="/our-initiative"
              className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200 font-medium"
            >
              Our Initiative
            </Link>

            {/* Requests Dropdown */}
            {token && (
              <Link
                to="/user-dashboard"
                className="px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200 font-medium"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {!token ? (
              <>
                <Link
                  to="/userlogin"
                  className="bg-white text-green-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-md"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="border-2 border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 shadow-md"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-green-500 bg-green-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md hover:bg-green-600 transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/schedule"
                className="block px-3 py-2 rounded-md hover:bg-green-600 transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Schedule
              </Link>
              <Link
                to="/our-initiative"
                className="block px-3 py-2 rounded-md hover:bg-green-600 transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Our Initiative
              </Link>

              {token && (
                <Link
                  to="/user-dashboard"
                  className="block px-3 py-2 rounded-md hover:bg-green-600 transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <div className="pt-4 border-t border-green-500">
                {!token ? (
                  <div className="space-y-2">
                    <Link
                      to="/userlogin"
                      className="block bg-white text-green-700 px-3 py-2 rounded-md font-semibold hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block border-2 border-white px-3 py-2 rounded-md font-semibold hover:bg-white hover:text-green-700 transition-all duration-200 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full bg-red-500 px-3 py-2 rounded-md font-semibold hover:bg-red-600 transition-all duration-200"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
