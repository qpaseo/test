import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Calculator } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight"
        >
          <Calculator className="h-6 w-6 text-blue-500" />
          <span>EDC</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                to="/"
                className={`transition-colors ${
                  location.pathname === "/"
                    ? "font-medium text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/aws"
                className={`transition-colors ${
                  location.pathname === "/aws"
                    ? "font-medium text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                AWS
              </Link>
            </li>
            <li>
              <Link
                to="/azure"
                className={`transition-colors ${
                  location.pathname === "/azure"
                    ? "font-medium text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Azure
              </Link>
            </li>
            <li>
              <Link
                to="/gcp"
                className={`transition-colors ${
                  location.pathname === "/gcp"
                    ? "font-medium text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Google Cloud
              </Link>
            </li>

            <li>
              <Link
                to="/firebase"
                className={`transition-colors ${
                  location.pathname === "/firebase"
                    ? "font-medium text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Firebase
              </Link>
            </li>

            <li>
              <Link
                to="/supabase"
                className={`transition-colors ${
                  location.pathname === "/supabase"
                    ? "font-medium text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Supabase
              </Link>
            </li>
          </ul>
        </nav>

        <button
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="slide-in animate-in bg-white px-4 py-4 shadow-md md:hidden">
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                to="/"
                className={`block py-2 ${
                  location.pathname === "/"
                    ? "font-medium text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/aws"
                className={`block py-2 ${
                  location.pathname === "/aws"
                    ? "font-medium text-blue-600"
                    : "text-gray-600"
                }`}
              >
                AWS
              </Link>
            </li>
            <li>
              <Link
                to="/azure"
                className={`block py-2 ${
                  location.pathname === "/azure"
                    ? "font-medium text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Azure
              </Link>
            </li>
            <li>
              <Link
                to="/gcp"
                className={`block py-2 ${
                  location.pathname === "/gcp"
                    ? "font-medium text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Google Cloud
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
