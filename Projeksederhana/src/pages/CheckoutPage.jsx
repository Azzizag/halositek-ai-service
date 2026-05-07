import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, CreditCard, Truck, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const steps = [
  { id: 1, label: 'Shipping', icon: <Truck size={14} /> },
  { id: 2, label: 'Payment', icon: <CreditCard size={14} /> },
  { id: 3, label: 'Confirm', icon: <Package size={14} /> },
];

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: '',
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  const shipping = cartTotal > 50 ? 0 : 9.99;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shipping + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setOrderComplete(true);
      clearCart();
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="checkout-page page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>No items to checkout</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>Add some items to your cart first.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="checkout-page page">
        <div className="container">
          <div className="checkout-form">
            <div className="order-complete">
              <div className="check-circle">
                <Check size={40} />
              </div>
              <h2>Order Confirmed! 🎉</h2>
              <p>Thank you for your purchase. Your order has been placed successfully.</p>
              <div className="order-number">
                Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </div>
              <br />
              <Link to="/" className="btn btn-primary btn-lg">
                Continue Shopping <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page page">
      <div className="container">
        <Link to="/cart" className="btn btn-secondary btn-sm" style={{ marginBottom: 'var(--space-xl)' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="page-title">Checkout</h1>

        {/* Steps */}
        <div className="checkout-steps">
          {steps.map((step, i) => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <div className={`checkout-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                <span className="step-number">
                  {currentStep > step.id ? <Check size={14} /> : step.id}
                </span>
                {step.label}
              </div>
              {i < steps.length - 1 && <div className="step-divider" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-form">
            {/* Shipping Step */}
            {currentStep === 1 && (
              <>
                <h2>Shipping Information</h2>
                <div className="form-grid">
                  <div className="input-group">
                    <label>First Name</label>
                    <input className="input-field" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <input className="input-field" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input className="input-field" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                  </div>
                  <div className="input-group">
                    <label>Phone</label>
                    <input className="input-field" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" />
                  </div>
                  <div className="input-group full-width">
                    <label>Address</label>
                    <input className="input-field" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, Apt 4" />
                  </div>
                  <div className="input-group">
                    <label>City</label>
                    <input className="input-field" name="city" value={formData.city} onChange={handleChange} placeholder="New York" />
                  </div>
                  <div className="input-group">
                    <label>State</label>
                    <input className="input-field" name="state" value={formData.state} onChange={handleChange} placeholder="NY" />
                  </div>
                  <div className="input-group">
                    <label>ZIP Code</label>
                    <input className="input-field" name="zip" value={formData.zip} onChange={handleChange} placeholder="10001" />
                  </div>
                  <div className="input-group">
                    <label>Country</label>
                    <input className="input-field" name="country" value={formData.country} onChange={handleChange} placeholder="United States" />
                  </div>
                </div>
              </>
            )}

            {/* Payment Step */}
            {currentStep === 2 && (
              <>
                <h2>Payment Method</h2>
                <div className="form-grid">
                  <div className="input-group full-width">
                    <label>Card Number</label>
                    <input className="input-field" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="input-group full-width">
                    <label>Cardholder Name</label>
                    <input className="input-field" name="cardName" value={formData.cardName} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div className="input-group">
                    <label>Expiry Date</label>
                    <input className="input-field" name="expiry" value={formData.expiry} onChange={handleChange} placeholder="MM/YY" />
                  </div>
                  <div className="input-group">
                    <label>CVV</label>
                    <input className="input-field" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" />
                  </div>
                </div>
              </>
            )}

            {/* Confirm Step */}
            {currentStep === 3 && (
              <>
                <h2>Review Your Order</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {items.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                      padding: 'var(--space-md)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                    }}>
                      <img src={item.image} alt={item.name} style={{
                        width: 60, height: 60, borderRadius: 'var(--radius-sm)', objectFit: 'cover',
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{item.name}</p>
                        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</p>
                      </div>
                      <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="form-actions">
              {currentStep > 1 ? (
                <button className="btn btn-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : <div />}
              <button className="btn btn-primary btn-lg" onClick={handleNext}>
                {currentStep === 3 ? (
                  <>Place Order <Check size={18} /></>
                ) : (
                  <>Continue <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({items.reduce((c, i) => c + i.quantity, 0)} items)</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
