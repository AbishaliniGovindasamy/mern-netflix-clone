import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, LogOut, Menu } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useContentStore } from "../store/content";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { setContentType } = useContentStore();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="max-w-6xl mx-auto flex items-center justify-between p-4 h-20 relative z-50">
      {/* Left side: Logo & Nav Links */}
      <div className="flex items-center gap-10">
        <Link to="/">
          <img src="/netflix-logo.png" alt="logo" className="w-32 sm:w-40" />
        </Link>

        {/* Laptop Navbar Items */}
        <div className="hidden sm:flex gap-4 items-center">
          <Link to="/" className="hover:underline" onClick={() => setContentType("movie")}>
            Movies
          </Link>
          <Link to="/" className="hover:underline" onClick={() => setContentType("tv")}>
            Tv Shows
          </Link>
          <Link to="/history" className="hover:underline">
            Search History
          </Link>
        </div>
      </div>

      {/* Right side: Icons */}
      <div className="flex gap-4 items-center ml-auto">
        <Link to="/search">
          <Search className="size-6 cursor-pointer" />
        </Link>
        <img src={user.image} alt="Avatar" className="h-8 rounded cursor-pointer" />
        <LogOut className="size-6 cursor-pointer" onClick={logout} />
        <div className="sm:hidden">
          <Menu className="size-6 cursor-pointer" onClick={toggleMobileMenu} />
        </div>
      </div>

      {/* Mobile Navbar Items */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 right-0 w-full sm:hidden mt-4 bg-black border rounded border-gray-800 z-50">
          <Link to="/" className="block hover:underline p-2" onClick={toggleMobileMenu}>
            Movies
          </Link>
          <Link to="/" className="block hover:underline p-2" onClick={toggleMobileMenu}>
            Tv Shows
          </Link>
          <Link to="/history" className="block hover:underline p-2" onClick={toggleMobileMenu}>
            Search History
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
