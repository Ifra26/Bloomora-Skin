require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');

const app = express();

// Allowed frontend/admin origins (add your custom domain here too if you have one)
const allowedOrigins = [
  'https://bloomora-skin-ux73.vercel.app',   // admin panel (old)
  'https://bloomora-skin-a6zn.vercel.app',   // frontend (old)
  'https://bloomora-skin-2w8b.vercel.app',   // admin panel (current)
  'https://bloomora-skin-a6zn.vercel.app',   // frontend (current)
  'http://localhost:3000',                   // local dev (optional, remove in strict prod)
  'http://localhost:5173'                    // local dev vite (optional)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    // allow any Vercel preview/deploy subdomain so PR previews and deployments can call the API
    try {
      if (origin.endsWith('.vercel.app')) return callback(null, true);
    } catch (e) { /* ignore malformed origin */ }
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy: This origin is not allowed - ' + origin), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', name: 'Bloomora API' }));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'That endpoint does not exist.' });
});

// Central error handler — catches anything thrown/passed to next()
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong on our end.' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Bloomora API running on http://localhost:${PORT}`);
  });
}

module.exports = app;

