import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Rating from './Rating';
import './ProductCard.css';

const badgeClassMap = {
  'Hot Deal': 'badge-hot',
  'New Arrival': 'badge-new',
  'Best Seller': 'badge-best',
  'Popular': 'badge-popular',
  'Premium': 'badge-premium',
  'Gift Idea': 'badge-gift',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="product-card animate-fade-in-up">
      <div className="product-card-image">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {product.badge && (
          <span className={`product-card-badge ${badgeClassMap[product.badge] || 'badge-new'}`}>
            {product.badge}
          </span>
        )}
        <button
          className={`product-card-wishlist ${wishlisted ? 'active' : ''}`}
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-card-info">
        <span className="product-card-category">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <div className="product-card-rating">
          <Rating value={product.rating} />
          <span>({product.reviews.toLocaleString()})</span>
        </div>
        <div className="product-card-price">
          <span className="price-current">${product.price}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="price-original">${product.originalPrice}</span>
              <span className="price-discount">-{discount}%</span>
            </>
          )}
        </div>
      </div>

      <div className="product-card-actions">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => addToCart(product)}
        >
          <ShoppingCart size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
