import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, User, X } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { useAuthStore } from '../lib/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const { user, logout } = useAuthStore();

  const cartItemsCount = cartItems.length > 0 ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleCatalogClick = (e: React.MouseEvent) => {
    if (location.pathname === '/catalog') {
      e.preventDefault();
      // Remove category from search params and reload the page
      const newUrl = '/catalog';
      navigate(newUrl);
      window.location.reload();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/95 text-white z-50 border-b border-gold/20 gold-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <img src="/lev.png" alt="Lion" className="h-12 w-auto" />
            <Link to="/" className="text-2xl font-bold text-gold hover:text-gold/80 transition-colors">
              DON SIGARON
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gold hover:text-gold/80 transition-all hover:-translate-y-0.5">
              Главная
            </Link>
            <Link 
              to="/catalog" 
              className="text-gold hover:text-gold/80 transition-all hover:-translate-y-0.5"
              onClick={handleCatalogClick}
            >
              Каталог
            </Link>
            <Link to="/about" className="text-gold hover:text-gold/80 transition-all hover:-translate-y-0.5">
              О нас
            </Link>
            <Link to="/contacts" className="text-gold hover:text-gold/80 transition-all hover:-translate-y-0.5">
              Контакты
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" className="text-gold hover:text-gold/80 transition-all hover:-translate-y-0.5">
                Админ
              </Link>
            )}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={handleProfileClick}
              className="text-gold hover:text-gold/80 transition-all hover:-translate-y-0.5"
            >
              <User size={24} />
            </button>
            <Link to="/cart" className="text-gold hover:text-gold/80 transition-all hover:-translate-y-0.5 relative">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center gold-glow">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gold hover:text-gold/80 transition-all"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95 border-t border-gold/20">
            <Link
              to="/"
              className="block px-3 py-2 text-gold hover:text-gold/80 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Главная
            </Link>
            <Link
              to="/catalog"
              className="block px-3 py-2 text-gold hover:text-gold/80 transition-all"
              onClick={(e) => {
                handleCatalogClick(e);
                setIsOpen(false);
              }}
            >
              Каталог
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gold hover:text-gold/80 transition-all"
              onClick={() => setIsOpen(false)}
            >
              О нас
            </Link>
            <Link
              to="/contacts"
              className="block px-3 py-2 text-gold hover:text-gold/80 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Контакты
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="block px-3 py-2 text-gold hover:text-gold/80 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Админ
              </Link>
            )}
            <div className="flex items-center space-x-4 px-3 py-2">
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsOpen(false);
                }}
                className="text-gold hover:text-gold/80 transition-all"
              >
                <User size={24} />
              </button>
              <Link
                to="/cart"
                className="text-gold hover:text-gold/80 transition-all relative"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center gold-glow">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}