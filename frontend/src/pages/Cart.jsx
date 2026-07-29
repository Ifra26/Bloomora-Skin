import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const navigate = useNavigate();
  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 200;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="container section empty-state">
        <h3>Your cart is empty.</h3>
        <p>Browse the range and add something to it.</p>
        <Link to="/products" className="btn btn-primary btn-sm">Shop products</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Your cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <Link to={`/products/${item.productId}`}>
                  <h3>{item.name}</h3>
                </Link>
                <p className="mono">Rs. {item.price.toLocaleString()} each</p>
              </div>
              <div className="qty-stepper">
                <button onClick={() => updateQty(item.productId, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease quantity">−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.productId, item.qty + 1)} disabled={item.qty >= (item.stock || 99)} aria-label="Increase quantity">+</button>
              </div>
              <p className="cart-item-total">Rs. {(item.price * item.qty).toLocaleString()}</p>
              <button className="remove-btn" onClick={() => removeItem(item.productId)} aria-label={`Remove ${item.name}`}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary card">
          <h3>Order summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : `Rs. ${shippingFee}`}</span>
          </div>
          {shippingFee > 0 && (
            <p className="summary-note">Free shipping over Rs. 5,000.</p>
          )}
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
