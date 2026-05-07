import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  const savings = items.reduce((s, item) =>
    s + ((item.originalPrice || item.price) - item.price) * item.quantity, 0
  );

  if (items.length === 0) {
    return (
      <div className="cart-page page">
        <div className="container cart-empty">
          <ShoppingBag size={64} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }} />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </p>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <Link to={`/product/${item.id}`} className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <span className="category">{item.category}</span>
                  <h3><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
                  <span className="price">${item.price}</span>
                  <div className="cart-item-actions">
                    <div className="quantity-selector" style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{
                        width: 40, textAlign: 'center', fontWeight: 700, fontSize: 'var(--font-sm)',
                        borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)',
                        padding: '6px 0',
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Est. Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {savings > 0 && (
              <div className="summary-row">
                <span>You Save</span>
                <span className="savings">-${savings.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-lg">
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
            <Link
              to="/products"
              className="btn btn-secondary"
              style={{ marginTop: 'var(--space-sm)' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
