import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'cod',
    notes: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const shippingFee = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <h3>Your cart is empty.</h3>
        <Link to="/products" className="btn btn-primary btn-sm">Shop products</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container section empty-state">
        <h3>Sign in to check out.</h3>
        <p>We keep your order history tied to your account.</p>
        <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="btn btn-primary btn-sm">
          Sign in
        </Link>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.address.trim() || !form.city.trim() || !form.phone.trim()) {
      setError('Please fill in your address, city and phone number.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await api.post(
        '/orders',
        {
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          shippingAddress: `${form.address}, ${form.city}`,
          phone: form.phone,
          paymentMethod: form.paymentMethod,
          notes: form.notes
        },
        token
      );
      clearCart();
      navigate(`/orders/${order.id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container section">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form card" onSubmit={handleSubmit}>
          <h3>Shipping details</h3>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="field">
            <label htmlFor="address">Street address</label>
            <input id="address" name="address" value={form.address} onChange={handleChange} placeholder="House 12, Street 4, DHA Phase 6" />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Karachi" />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone number</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="03xx-xxxxxxx" />
            </div>
          </div>

          <div className="field">
            <label>Payment method</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                Cash on delivery
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={form.paymentMethod === 'bank_transfer'}
                  onChange={handleChange}
                />
                Bank transfer
              </label>
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">Delivery notes (optional)</label>
            <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder="Gate code, landmark, preferred time…" />
          </div>

          <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Placing order…' : `Place order — Rs. ${total.toLocaleString()}`}
          </button>
        </form>

        <aside className="cart-summary card">
          <h3>Order summary</h3>
          {items.map((i) => (
            <div key={i.productId} className="summary-row">
              <span>{i.name} × {i.qty}</span>
              <span>Rs. {(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : `Rs. ${shippingFee}`}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
