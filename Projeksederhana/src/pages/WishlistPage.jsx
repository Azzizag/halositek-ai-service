import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Rating from '../components/Rating';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Heart size={64} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }} />
          <h2 style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--space-sm)' }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            Start adding items you love!
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">My Wishlist</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          {items.map(item => (
            <div key={item.id} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              transition: 'all 250ms ease',
            }}>
              <Link to={`/product/${item.id}`} style={{ display: 'block', aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={item.image} alt={item.name} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 400ms ease',
                }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                   onMouseOut={e => e.target.style.transform = 'scale(1)'} />
              </Link>
              <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                <span style={{ fontSize: 'var(--font-xs)', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                  {item.category}
                </span>
                <Link to={`/product/${item.id}`}>
                  <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 600 }}>{item.name}</h3>
                </Link>
                <Rating value={item.rating} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                  <span style={{ fontSize: 'var(--font-lg)', fontWeight: 800 }}>${item.price}</span>
                  {item.originalPrice > item.price && (
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ${item.originalPrice}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleMoveToCart(item)}>
                    <ShoppingCart size={14} /> Move to Cart
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => removeFromWishlist(item.id)}
                    style={{ color: 'var(--accent-danger)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
