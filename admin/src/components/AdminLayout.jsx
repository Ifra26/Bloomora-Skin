import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="admin-main">
        <div className="mobile-topbar">
          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">☰</button>
          <span>Bloomora Admin</span>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
