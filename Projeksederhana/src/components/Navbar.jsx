import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Store size={20} color="white" />
          </div>
          <span>ShopVerse</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="navbar-links">
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
            <Store size={18} />
            <span className="link-text">Shop</span>
          </Link>
          <Link to="/wishlist" className={location.pathname === '/wishlist' ? 'active' : ''}>
            <Heart size={18} />
            <span className="link-text">Wishlist</span>
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
            <ShoppingCart size={18} />
            <span className="link-text">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
            <User size={18} />
            <span className="link-text">Account</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
