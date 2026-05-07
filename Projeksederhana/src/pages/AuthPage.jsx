import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Lock, User, ArrowRight } from 'lucide-react';
import './AuthPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login successful! (Demo Mode)');
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up">
        <div className="auth-header">
          <Link to="/" className="logo">
            <Store size={24} />
            <span>ShopVerse</span>
          </Link>
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label><Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg">
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="social-buttons">
          <button className="btn btn-secondary">Google</button>
          <button className="btn btn-secondary">GitHub</button>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Account created successfully! (Demo Mode)');
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up">
        <div className="auth-header">
          <Link to="/" className="logo">
            <Store size={24} />
            <span>ShopVerse</span>
          </Link>
          <h1>Create Account</h1>
          <p>Join ShopVerse and start shopping</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label><User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Full Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label><Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg">
            Create Account <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="social-buttons">
          <button className="btn btn-secondary">Google</button>
          <button className="btn btn-secondary">GitHub</button>
        </div>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
