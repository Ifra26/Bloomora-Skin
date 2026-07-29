import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';

export default function Products() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 10 });
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    api.get(`/products?${params.toString()}`).then(setItems).finally(() => setLoading(false));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [search, categoryFilter, page]);
  useEffect(() => { api.get('/categories').then(setCategories); }, []);

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || '—';

  const handleSave = async (payload) => {
    setFormError('');
    try {
      if (editing.id) {
        await api.put(`/products/${editing.id}`, payload, token);
      } else {
        await api.post('/products', payload, token);
      }
      setEditing(null);
      load();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    setError('');
    try {
      await api.del(`/products/${id}`, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-toolbar">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ Add product</button>
      </div>

      <div className="page-toolbar">
        <input
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="empty-cell">Loading…</td></tr>
            ) : !items.items || items.items.length === 0 ? (
              <tr><td colSpan={6} className="empty-cell">No products found.</td></tr>
            ) : (
              items.items.map((p) => (
                <tr key={p.id}>
                  <td><img className="thumb" src={p.images?.[0]} alt={p.name} /></td>
                  <td>{p.name}</td>
                  <td>{categoryName(p.category)}</td>
                  <td>Rs. {p.price.toLocaleString()}</td>
                  <td style={{ color: p.stock <= 10 ? 'var(--danger)' : 'inherit' }}>{p.stock}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => setEditing(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {items.totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: items.totalPages }).map((_, i) => (
            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit product' : 'Add product'} onClose={() => setEditing(null)}>
          <ProductForm product={editing} categories={categories} onSubmit={handleSave} error={formError} />
        </Modal>
      )}
    </div>
  );
}
