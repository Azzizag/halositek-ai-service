import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Check, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';
import { getProductById, products } from '../data/products';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Product Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
            The product you're looking for doesn't exist.
          </p>
          <Link to="/products" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wishlisted = isInWishlist(product.id);
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail page">
      <div className="container">
        <Link to="/products" className="btn btn-secondary btn-sm" style={{ marginBottom: 'var(--space-xl)' }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div className="product-detail-grid">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="gallery-main">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="gallery-thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`gallery-thumb ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <span className="category-label">{product.category}</span>
            <h1>{product.name}</h1>

            <div className="rating-row">
              <Rating value={product.rating} size={16} />
              <span>{product.reviews.toLocaleString()} reviews</span>
              {product.inStock && (
                <span style={{ color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={14} /> In Stock
                </span>
              )}
            </div>

            <div className="price-row">
              <span className="current">${product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="original">${product.originalPrice}</span>
                  <span className="discount-badge">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="description">{product.description}</p>

            <div className="product-options">
              {product.sizes && (
                <div className="option-group">
                  <label>Size</label>
                  <div className="option-chips">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        className={`option-chip ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && (
                <div className="option-group">
                  <label>Color</label>
                  <div className="option-chips">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        className={`option-chip ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="option-group">
                <label>Quantity</label>
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus size={16} />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                {added ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
              </button>
              <button
                className={`btn ${wishlisted ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                onClick={() => toggleWishlist(product)}
                style={{ flex: '0 0 auto' }}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {product.features && (
              <div className="product-features">
                {product.features.map((feat, i) => (
                  <div key={i} className="feature-item">
                    <Check size={16} />
                    {feat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-section">
            <h2>You May Also Like</h2>
            <div className="related-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
