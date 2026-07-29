import { useState } from 'react';
import { api } from '../api/client';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('submitting');
    try {
      await api.post('/contact', form);
      setStatus('done');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    <div className="container section contact-page">
      <div className="contact-grid">
        <div>
          <span className="eyebrow">Get in touch</span>
          <h1>Questions, wholesale, or a formula that didn't agree with you.</h1>
          <p>We read every message ourselves. Expect a reply within a couple of working days.</p>
          <div className="contact-details">
            <p><strong>Studio</strong><br />Block 7, Clifton, Karachi, Pakistan</p>
            <p><strong>Email</strong><br />hello@bloomora.pk</p>
            <p><strong>Phone</strong><br />021-3555-0192</p>
          </div>
        </div>

        <form className="card contact-form" onSubmit={handleSubmit}>
          {status === 'done' ? (
            <div className="alert alert-success">Thanks — your message has been sent.</div>
          ) : (
            <>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={status === 'submitting'} style={{ width: '100%' }}>
                {status === 'submitting' ? 'Sending…' : 'Send message'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
