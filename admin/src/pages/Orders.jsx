import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    api.get(`/orders?${params.toString()}`, token).then(setOrders).finally(() => setLoading(false));
  }, [status, token]);

  return (
    <div>
      <div className="page-toolbar">
        <h1>Orders</h1>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="empty-cell">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="empty-cell">No orders found.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td className="mono">#{o.orderNumber}</td>
                  <td>{o.customerName}<br /><span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{o.customerEmail}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}</td>
                  <td>Rs. {o.total.toLocaleString()}</td>
                  <td><span className={`status-pill status-${o.status}`}>{o.status}</span></td>
                  <td><Link to={`/orders/${o.id}`} className="btn btn-outline btn-sm">View</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
