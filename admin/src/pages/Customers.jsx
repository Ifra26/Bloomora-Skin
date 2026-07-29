import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Customers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/customers', token).then(setCustomers).finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Customers</h1>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Joined</th><th>Orders</th><th>Total spent</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="empty-cell">Loading…</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} className="empty-cell">No customers yet.</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>{c.orderCount}</td>
                  <td>Rs. {c.totalSpent.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
