const express = require('express');
const { randomUUID: uuid } = require('crypto');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Enter a valid email address.'),
    body('message').trim().isLength({ min: 5 }).withMessage('Message is too short.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const message = {
      id: uuid(),
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      createdAt: new Date().toISOString(),
      read: false
    };
    await db.createDoc('contactMessages', message.id, message);
    res.status(201).json({ success: true });
  }
);

router.get('/', requireAdmin, async (req, res) => {
  const messages = (await db.getAll('contactMessages')).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(messages);
});

module.exports = router;
