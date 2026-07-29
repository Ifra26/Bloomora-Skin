import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/contact', token).then(setMessages).finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Contact messages</h1>
      {loading ? (
        <p>Loading…</p>
      ) : messages.length === 0 ? (
        <p className="empty-cell">No messages yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((m) => (
            <div key={m.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{m.name}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {new Date(m.createdAt).toLocaleString('en-PK')}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 10 }}>{m.email}</p>
              <p>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
