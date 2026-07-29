import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = () => api.get(`/orders/${id}`, token).then(setOrder);
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const handleStatusChange = async (status) => {
    setSaving(true);
    setMessage('');
    try {
      const updated = await api.patch(`/orders/${id}/status`, { status }, token);
      setOrder(updated);
      setMessage('Status updated.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!order) return <p>Loading…</p>;

  return (
    <div>
      <Link to="/orders" className="btn btn-outline btn-sm" style={{ marginBottom: 20 }}>← Back to orders</Link>

      <div className="page-toolbar">
        <div>
          <h1>Order #{order.orderNumber}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
            Placed {new Date(order.createdAt).toLocaleString('en-PK')}
          </p>
        </div>
        <div>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={saving}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="dash-grid">
        <div className="card dash-card">
          <h3>Items</h3>
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>Rs. {item.price.toLocaleString()}</td>
                  <td>Rs. {(item.price * item.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <p>Subtotal: Rs. {order.subtotal.toLocaleString()}</p>
            <p>Shipping: {order.shippingFee === 0 ? 'Free' : `Rs. ${order.shippingFee}`}</p>
            <p style={{ fontWeight: 700 }}>Total: Rs. {order.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="card dash-card">
          <h3>Customer & delivery</h3>
          <p><strong>{order.customerName}</strong></p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{order.customerEmail}</p>
          <p style={{ marginTop: 14 }}>{order.shippingAddress}</p>
          <p>{order.phone}</p>
          <p className="mono" style={{ marginTop: 10 }}>
            {order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Bank transfer'}
          </p>
          {order.notes && <p style={{ marginTop: 10, fontStyle: 'italic' }}>Note: {order.notes}</p>}
        </div>
      </div>
    </div>
  );
}
