import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <BrandMark size={28} />
            <span className="eyebrow">Bloomora</span>
          </div>
          <p>Formulated in small batches. Every jar lists exactly what went in, and how much.</p>
        </div>
        <div className="footer-cols">
          <div>
            <h4 className="footer-heading">Shop</h4>
            <Link to="/products">All products</Link>
            <Link to="/products?category=face">Face</Link>
            <Link to="/products?category=body">Body</Link>
          </div>
          <div>
            <h4 className="footer-heading">Company</h4>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4 className="footer-heading">Account</h4>
            <Link to="/orders">My orders</Link>
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Bloomora, Karachi.</span>
      </div>
    </footer>
  );
}
