"use client"

import { useState, useEffect } from "react"

const SimpleNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Handle scroll event to change navbar appearance and track active section
  useEffect(() => {
    const handleScroll = () => {
      // Update navbar style based on scroll position
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Update active section based on scroll position
      const sections = ["home", "features", "stats", "contact"]
      const scrollPosition = window.scrollY + 300

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 shadow-md transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className={`font-bold text-2xl transition-colors duration-300 ${
              isScrolled ? "text-blue-600" : "text-white"
            } group-hover:text-blue-400`}>EdTech</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { id: "home", label: "Home" },
              { id: "features", label: "Features" },
              { id: "stats", label: "Stats" },
              { id: "contact", label: "Contact" }
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`font-medium transition-all duration-300 relative ${
                  activeSection === item.id
                    ? isScrolled ? "text-blue-600" : "text-blue-300"
                    : isScrolled ? "text-gray-800 hover:text-blue-600" : "text-white hover:text-blue-200"
                } after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 ${
                  activeSection === item.id ? "after:w-full" : "after:w-0"
                } hover:after:w-full`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#"
              className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                isScrolled 
                  ? "text-blue-600 hover:bg-blue-50" 
                  : "text-white hover:bg-white/10"
              } hover:scale-105`}
            >
              Log In
            </a>
            <a
              href="#"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Sign Up
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${isScrolled ? "text-blue-600" : "text-white"} transition-colors duration-300`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-md rounded-lg shadow-lg p-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              {[
                { id: "home", label: "Home" },
                { id: "features", label: "Features" },
                { id: "stats", label: "Stats" },
                { id: "contact", label: "Contact" }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`font-medium transition-colors duration-300 ${
                    activeSection === item.id ? "text-blue-600" : "text-gray-800 hover:text-blue-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                <a
                  href="#"
                  className="px-4 py-2 text-center text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </a>
                <a
                  href="#"
                  className="px-4 py-2 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default SimpleNavbar
