import React, { useState, useEffect } from "react";
import { Menu, X, LogIn, BookOpen, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "tutor" | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      setUserRole(JSON.parse(user).role);
    }

    // Handle scroll effect
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Determine if we're on the landing page
  const isLandingPage = location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isLandingPage
          ? "bg-white shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          to="/"
          className={`text-2xl font-bold flex items-center ${
            isScrolled || !isLandingPage ? "text-blue-600" : "text-white"
          }`}
        >
          <BookOpen className="mr-2" />
          LearnBeyond
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/courses"
            className={`font-medium transition-colors ${
              isScrolled || !isLandingPage
                ? "text-gray-700 hover:text-blue-600"
                : "text-white hover:text-blue-200"
            }`}
          >
            Courses
          </Link>
          {isLoggedIn && userRole === "tutor" && (
            <Link
              to="/create-course"
              className={`font-medium transition-colors ${
                isScrolled || !isLandingPage
                  ? "text-gray-700 hover:text-blue-600"
                  : "text-white hover:text-blue-200"
              }`}
            >
              Create Course
            </Link>
          )}
          {isLoggedIn ? (
            <ProfileDropdown
              user={JSON.parse(localStorage.getItem("user") || "{}")}
            />
          ) : (
            <>
              <Link
                to="/login"
                className={`font-medium transition-colors ${
                  isScrolled || !isLandingPage
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white hover:text-blue-200"
                }`}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <LogIn className="mr-2" size={18} />
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X
              size={24}
              className={
                isScrolled || !isLandingPage ? "text-gray-700" : "text-white"
              }
            />
          ) : (
            <Menu
              size={24}
              className={
                isScrolled || !isLandingPage ? "text-gray-700" : "text-white"
              }
            />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-6 absolute top-full left-0 right-0">
          <div className="flex flex-col space-y-4">
            <Link
              to="/courses"
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={closeMenu}
            >
              Courses
            </Link>
            {isLoggedIn && userRole === "tutor" && (
              <Link
                to="/create-course"
                className="text-gray-700 hover:text-blue-600 font-medium"
                onClick={closeMenu}
              >
                Create Course
              </Link>
            )}
            {isLoggedIn ? (
              <ProfileDropdown
                user={JSON.parse(localStorage.getItem("user") || "{}")}
              />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                  onClick={closeMenu}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  onClick={closeMenu}
                >
                  <LogIn className="mr-2" size={18} />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
