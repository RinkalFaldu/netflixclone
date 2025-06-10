import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SearchBar } from '../ui/SearchBar';
import { NotificationBell } from '../notifications/NotificationBell';
import { cn } from '../../utils/cn';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for transparent header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (query: string) => {
    navigate(`/?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 py-3 px-4 md:px-8",
        isScrolled ? "bg-netflix-black shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-netflix-red font-bold text-2xl md:text-3xl">
          NetflixSocial
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-netflix-red transition">Home</Link>
          {user && (
            <>
              <Link to="/watchlist" className="text-white hover:text-netflix-red transition">My List</Link>
              <Link to="/friends" className="text-white hover:text-netflix-red transition">Friends</Link>
              <Link to="/recommendations" className="text-white hover:text-netflix-red transition">Recommendations</Link>
            </>
          )}
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <SearchBar 
                onSearch={handleSearch} 
                onClose={() => setIsSearchOpen(false)} 
              />
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="text-white hover:text-netflix-red transition"
              >
                <Search size={20} />
              </button>
            )}
          </div>
          
          {/* User Actions */}
          {user ? (
            <div className="flex items-center space-x-4">
              <NotificationBell />
              
              <div className="relative group">
                <Link to="/profile" className="text-white hover:text-netflix-red transition">
                  <div className="w-8 h-8 rounded-full bg-netflix-gray flex items-center justify-center">
                    <User size={16} />
                  </div>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-netflix-black border border-netflix-gray rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-netflix-gray/20 transition">Profile</Link>
                  <Link to="/notifications" className="block px-4 py-2 hover:bg-netflix-gray/20 transition">Notifications</Link>
                  <button 
                    onClick={signOut} 
                    className="w-full text-left px-4 py-2 hover:bg-netflix-gray/20 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-netflix-red hover:bg-netflix-red/80 text-white px-4 py-1 rounded transition"
            >
              Sign In
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-netflix-black border-t border-netflix-gray/20 mt-3 py-4 animate-slide-up">
          <nav className="flex flex-col space-y-3 px-2">
            <Link to="/" className="text-white hover:text-netflix-red py-2 transition">Home</Link>
            {user ? (
              <>
                <Link to="/watchlist" className="text-white hover:text-netflix-red py-2 transition">My List</Link>
                <Link to="/friends" className="text-white hover:text-netflix-red py-2 transition">Friends</Link>
                <Link to="/recommendations" className="text-white hover:text-netflix-red py-2 transition">Recommendations</Link>
                <Link to="/profile" className="text-white hover:text-netflix-red py-2 transition">Profile</Link>
                <Link to="/notifications" className="text-white hover:text-netflix-red py-2 transition">Notifications</Link>
                <button 
                  onClick={signOut} 
                  className="text-left text-white hover:text-netflix-red py-2 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="text-white hover:text-netflix-red py-2 transition">Sign In</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}