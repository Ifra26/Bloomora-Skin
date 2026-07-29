import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

export default function Categories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/categories').then(setCategories).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    const form = new FormData(e.target);
    const payload = { name: form.get('name'), description: form.get('description') };
    try {
      if (editing.id) {
        await api.put(`/categories/${editing.id}`, payload, token);
      } else {
        await api.post('/categories', payload, token);
      }
      setEditing(null);
      load();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? This only works if no products use it.')) return;
    setError('');
    try {
      await api.del(`/categories/${id}`, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-toolbar">
        <h1>Categories</h1>
        <button className="btn btn-primary" onClick={() => setEditing({})}>+ Add category</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Slug</th><th>Description</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="empty-cell">Loading…</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={4} className="empty-cell">No categories yet.</td></tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="mono">{c.slug}</td>
                  <td>{c.description}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => setEditing(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? 'Edit category' : 'Add category'} onClose={() => setEditing(null)}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <form onSubmit={handleSave}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" required defaultValue={editing.name} />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={3} defaultValue={editing.description} />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Save</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
