import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-image">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
        {product.stock > 0 && product.stock <= 10 && (
          <span className="tag tag-low">Only {product.stock} left</span>
        )}
        {outOfStock && <span className="tag tag-out">Sold out</span>}
      </Link>
      <div className="product-card-body">
        <Link to={`/products/${product.id}`}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>
        <p className="product-card-volume mono">{product.volume}</p>
        <div className="product-card-footer">
          <span className="product-card-price">Rs. {product.price.toLocaleString()}</span>
          <button
            className="btn btn-primary btn-sm"
            disabled={outOfStock}
            onClick={() => addItem(product, 1)}
          >
            {outOfStock ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
