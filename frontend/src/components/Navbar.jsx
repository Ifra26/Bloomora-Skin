import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import BrandMark from './BrandMark';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/products', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <BrandMark size={36} />
          <span className="brand-name">Bloomora</span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="nav-mobile-actions">
            {user ? (
              <>
                <NavLink to="/orders" onClick={() => setOpen(false)}>My Orders</NavLink>
                <button className="btn btn-ghost btn-sm" onClick={() => { logout(); setOpen(false); navigate('/'); }}>
                  Sign out
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={() => setOpen(false)}>Sign in</NavLink>
            )}
          </div>
        </nav>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
              <NavLink to="/orders" className="nav-link">Orders</NavLink>
              <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/'); }}>
                Sign out
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-outline btn-sm">Sign in</NavLink>
          )}
          <Link to="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
            <CartIcon />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="9" cy="21" r="1.2" />
      <circle cx="18" cy="21" r="1.2" />
      <path d="M2.5 3h2l2.2 12.1a2 2 0 0 0 2 1.65h7.86a2 2 0 0 0 1.98-1.72L20 8H6" />
    </svg>
  );
}
