import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import FormulationTicket from '../components/FormulationTicket';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    setProduct(null);
    setAdded(false);
    api.get(`/products/${id}`).catch(() => setError('This product could not be found.')).then((data) => {
      if (data) setProduct(data);
    });
  }, [id]);

  if (error) {
    return (
      <div className="container section empty-state">
        <h3>{error}</h3>
        <Link to="/products" className="btn btn-outline btn-sm">Back to shop</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section">
        <div className="skeleton" style={{ height: 420 }} />
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="container section product-detail">
      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={product.images?.[0]} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <span className="eyebrow">{product.volume}</span>
          <h1>{product.name}</h1>
          <p className="product-price-lg">Rs. {product.price.toLocaleString()}</p>
          <p className="product-description">{product.description}</p>

          <div className="stock-line">
            {outOfStock ? (
              <span className="tag tag-out">Sold out</span>
            ) : product.stock <= 10 ? (
              <span className="tag tag-low">Only {product.stock} left in stock</span>
            ) : (
              <span className="tag tag-in">In stock</span>
            )}
          </div>

          {!outOfStock && (
            <div className="qty-add-row">
              <div className="qty-stepper">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity">+</button>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  addItem(product, qty);
                  setAdded(true);
                }}
              >
                Add to cart
              </button>
            </div>
          )}
          {added && <p className="added-confirm">Added to cart. <Link to="/cart">View cart →</Link></p>}

          <FormulationTicket product={product} />
        </div>
      </div>
    </div>
  );
}
