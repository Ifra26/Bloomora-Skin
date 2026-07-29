import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandMark from './BrandMark';

const links = [
  { to: '/', label: 'Dashboard', icon: '◧', end: true },
  { to: '/products', label: 'Products', icon: '◇' },
  { to: '/categories', label: 'Categories', icon: '▤' },
  { to: '/orders', label: 'Orders', icon: '⌘' },
  { to: '/customers', label: 'Customers', icon: '◎' },
  { to: '/messages', label: 'Messages', icon: '✉' }
];

export default function Sidebar({ open, onClose }) {
  const { logout, user } = useAuth();

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-row">
          <BrandMark size={30} />
          <span>Bloomora</span>
        </div>
        <span>ADMIN PANEL</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span aria-hidden="true">{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p style={{ color: 'rgba(241,236,221,0.6)', fontSize: '0.78rem', marginBottom: 10 }}>
          Signed in as {user?.name}
        </p>
        <button onClick={logout}>Sign out</button>
      </div>
    </aside>
  );
}
