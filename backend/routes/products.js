const express = require('express');
const { randomUUID: uuid } = require('crypto');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products?search=&category=&minPrice=&maxPrice=&sort=&page=&limit=
router.get('/', async (req, res) => {
  let items = await db.getAll('products');

  const { search, category, minPrice, maxPrice, sort } = req.query;

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (category) {
    items = items.filter((p) => p.category === category);
  }
  if (minPrice) {
    items = items.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    items = items.filter((p) => p.price <= Number(maxPrice));
  }

  switch (sort) {
    case 'price-asc':
      items = [...items].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      items = [...items].sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      items = [...items].sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      items = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    default:
      break;
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(48, Number(req.query.limit) || 12);
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  res.json({
    items: paged,
    total: items.length,
    page,
    totalPages: Math.max(1, Math.ceil(items.length / limit))
  });
});

router.get('/:id', async (req, res) => {
  const product = await db.getDoc('products', req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json(product);
});

router.post(
  '/',
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Product name is required.'),
    body('category').notEmpty().withMessage('Please choose a category.'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number.'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be zero or more.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const categoryExists = await db.getDoc('categories', req.body.category);
    if (!categoryExists) return res.status(400).json({ error: 'That category does not exist.' });

    const product = {
      id: uuid(),
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      batch: req.body.batch || '',
      ph: req.body.ph !== undefined && req.body.ph !== '' ? Number(req.body.ph) : null,
      volume: req.body.volume || '',
      description: req.body.description || '',
      ingredients: Array.isArray(req.body.ingredients) ? req.body.ingredients : [],
      images: Array.isArray(req.body.images) && req.body.images.length
        ? req.body.images
        : ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'],
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString()
    };

    await db.createDoc('products', product.id, product);
    res.status(201).json(product);
  }
);

router.put('/:id', requireAdmin, async (req, res) => {
  const product = await db.getDoc('products', req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  if (req.body.price !== undefined && Number(req.body.price) <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number.' });
  }
  if (req.body.stock !== undefined && Number(req.body.stock) < 0) {
    return res.status(400).json({ error: 'Stock must be zero or more.' });
  }

  const updates = { ...req.body };
  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.stock !== undefined) updates.stock = Number(updates.stock);
  if (updates.ph !== undefined) updates.ph = updates.ph === '' ? null : Number(updates.ph);

  await db.updateDoc('products', req.params.id, updates);
  res.json(await db.getDoc('products', req.params.id));
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const product = await db.getDoc('products', req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  await db.deleteDoc('products', req.params.id);
  res.json({ success: true });
});

module.exports = router;
