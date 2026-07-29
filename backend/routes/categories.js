const express = require('express');
const { randomUUID: uuid } = require('crypto');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  res.json(await db.getAll('categories'));
});

router.get('/:id', async (req, res) => {
  const category = await db.getDoc('categories', req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found.' });
  res.json(category);
});

router.post(
  '/',
  requireAdmin,
  [body('name').trim().notEmpty().withMessage('Category name is required.')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { name, description = '' } = req.body;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await db.findOneByField('categories', 'slug', slug);
    if (existing) {
      return res.status(409).json({ error: 'A category with a similar name already exists.' });
    }

    const category = { id: uuid(), name, slug, description };
    await db.createDoc('categories', category.id, category);
    res.status(201).json(category);
  }
);

router.put('/:id', requireAdmin, async (req, res) => {
  const category = await db.getDoc('categories', req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found.' });

  const { name, description } = req.body;
  const updated = {
    name: name ?? category.name,
    description: description ?? category.description
  };

  await db.updateDoc('categories', req.params.id, updated);
  res.json(await db.getDoc('categories', req.params.id));
});

router.delete('/:id', requireAdmin, async (req, res) => {
  const inUse = await db.findOneByField('products', 'category', req.params.id);
  if (inUse) {
    return res.status(400).json({ error: 'This category still has products assigned to it.' });
  }
  await db.deleteDoc('categories', req.params.id);
  res.json({ success: true });
});

module.exports = router;
