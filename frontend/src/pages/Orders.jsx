import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const STATUS_LABEL = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get('/orders/mine', token).then(setOrders);
  }, [token]);

  if (orders === null) {
    return <div className="container section"><div className="skeleton" style={{ height: 200 }} /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container section empty-state">
        <h3>No orders yet.</h3>
        <p>Once you place an order, it'll show up here.</p>
        <Link to="/products" className="btn btn-primary btn-sm">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>My orders</h1>
      <div className="orders-list">
        {orders.map((o) => (
          <Link key={o.id} to={`/orders/${o.id}`} className="order-row card">
            <div>
              <p className="order-number mono">#{o.orderNumber}</p>
              <p className="order-date">{new Date(o.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <p className="order-items-count">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</p>
            <span className={`status-pill status-${o.status}`}>{STATUS_LABEL[o.status]}</span>
            <p className="order-total">Rs. {o.total.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
