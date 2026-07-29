import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card card">
        <div style={{ marginBottom: 8 }}>
          <BrandMark size={40} />
        </div>
        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--gold-deep)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Admin Panel
        </span>
        <h1>Bloomora</h1>
        <p>Sign in to manage products, orders and customers.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 18 }}>
          Demo: admin@bloomora.pk / Admin@123
        </p>
      </div>
    </div>
  );
}
