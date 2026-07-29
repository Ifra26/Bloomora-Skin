import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const STATUS_LABEL = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/orders/mine/${id}`, token).then(setOrder).catch((err) => setError(err.message));
  }, [id, token]);

  if (error) {
    return (
      <div className="container section empty-state">
        <h3>{error}</h3>
        <Link to="/orders" className="btn btn-outline btn-sm">Back to orders</Link>
      </div>
    );
  }

  if (!order) return <div className="container section"><div className="skeleton" style={{ height: 300 }} /></div>;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container section">
      {location.state?.justPlaced && (
        <div className="alert alert-success">
          Order placed! Your confirmation number is <strong>#{order.orderNumber}</strong>.
        </div>
      )}
      <div className="order-detail-head">
        <div>
          <span className="eyebrow">Order #{order.orderNumber}</span>
          <h1>{new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</h1>
        </div>
        <span className={`status-pill status-${order.status}`}>{STATUS_LABEL[order.status]}</span>
      </div>

      {order.status !== 'cancelled' && (
        <div className="status-tracker">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className={`status-step ${i <= currentStep ? 'done' : ''}`}>
              <span className="status-dot" />
              <span>{STATUS_LABEL[step]}</span>
            </div>
          ))}
        </div>
      )}

      <div className="order-detail-grid">
        <div className="card order-items-card">
          <h3>Items</h3>
          {order.items.map((item) => (
            <div key={item.productId} className="order-line-item">
              <img src={item.image} alt={item.name} />
              <div className="order-line-info">
                <p>{item.name}</p>
                <p className="mono">Qty {item.qty} × Rs. {item.price.toLocaleString()}</p>
              </div>
              <p>Rs. {(item.price * item.qty).toLocaleString()}</p>
            </div>
          ))}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? 'Free' : `Rs. ${order.shippingFee}`}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="card">
          <h3>Delivery details</h3>
          <p>{order.shippingAddress}</p>
          <p>{order.phone}</p>
          <p className="mono">{order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Bank transfer'}</p>
          {order.notes && <p className="order-notes">Note: {order.notes}</p>}
        </div>
      </div>
    </div>
  );
}
