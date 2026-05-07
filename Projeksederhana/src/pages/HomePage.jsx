import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, Shield, Headphones } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories, getFeaturedProducts } from '../data/products';
import './HomePage.css';

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text animate-fade-in-up">
              <div className="hero-tag">
                <Sparkles size={14} />
                New Collection 2026
              </div>
              <h1 className="hero-title">
                Discover the <br />
                <span className="gradient-text">Future of Shopping</span>
              </h1>
              <p className="hero-description">
                Explore our curated collection of premium products. From cutting-edge
                tech to timeless fashion, find everything you need in one place.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary btn-lg">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link to="/products?category=electronics" className="btn btn-secondary btn-lg">
                  Explore Tech
                </Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <h4>10K+</h4>
                  <p>Products</p>
                </div>
                <div className="hero-stat">
                  <h4>50K+</h4>
                  <p>Customers</p>
                </div>
                <div className="hero-stat">
                  <h4>4.9★</h4>
                  <p>Rating</p>
                </div>
              </div>
            </div>

            <div className="hero-visual animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="hero-image-grid">
                <div className="hero-image-card">
                  <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=350&fit=crop" alt="MacBook" />
                </div>
                <div className="hero-image-card">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=350&fit=crop" alt="Sneakers" />
                </div>
                <div className="hero-image-card">
                  <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=350&fit=crop" alt="Headphones" />
                </div>
                <div className="hero-image-card">
                  <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=350&fit=crop" alt="Skincare" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-categories">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our wide selection of curated categories</p>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat.id}`} key={cat.id} className="category-card">
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="category-card-overlay">
                  <span className="emoji">{cat.icon}</span>
                  <h3>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-products">
        <div className="container">
          <div className="products-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Handpicked items just for you</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="products-grid">
            {featured.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="home-banner">
        <div className="container">
          <div className="banner-card">
            <div className="banner-text">
              <h2>🔥 Flash Sale — Up to 50% Off</h2>
              <p>Limited time offer on electronics, fashion, and more. Don't miss out!</p>
              <Link to="/products" className="btn btn-lg">
                Shop the Sale <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="home-products">
        <div className="container">
          <div className="products-header">
            <div>
              <h2 className="section-title">New Arrivals</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Fresh picks added recently</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="products-grid">
            {products.slice(10, 14).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ padding: 'var(--space-3xl) 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            textAlign: 'center',
          }}>
            {[
              { icon: <Truck size={28} />, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: <Shield size={28} />, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: <Headphones size={28} />, title: '24/7 Support', desc: 'Always here for you' },
              { icon: <Sparkles size={28} />, title: 'Best Quality', desc: 'Premium products only' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: 'var(--space-xl)',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
              }}>
                <div style={{ color: 'var(--accent-primary)', marginBottom: 'var(--space-sm)' }}>{item.icon}</div>
                <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
