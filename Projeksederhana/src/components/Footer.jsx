import { Link } from 'react-router-dom';
import { Store, Github, Twitter, Instagram } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <Store size={24} />
              <span>ShopVerse</span>
            </div>
            <p>
              Your premium destination for curated products. We bring you the best
              in electronics, fashion, home & more with exceptional quality.
            </p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/products?category=electronics">Electronics</Link></li>
              <li><Link to="/products?category=fashion">Fashion</Link></li>
              <li><Link to="/products?category=home">Home & Living</Link></li>
              <li><Link to="/products?category=sports">Sports</Link></li>
              <li><Link to="/products?category=books">Books</Link></li>
              <li><Link to="/products?category=beauty">Beauty</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 ShopVerse. All rights reserved.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="Github"><Github size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
