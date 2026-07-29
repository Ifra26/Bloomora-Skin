const express = require('express');
const { randomUUID: uuid } = require('crypto');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// Place an order from the current cart contents sent by the client.
router.post(
  '/',
  requireAuth,
  [
    body('items').isArray({ min: 1 }).withMessage('Your cart is empty.'),
    body('shippingAddress').notEmpty().withMessage('A shipping address is required.'),
    body('phone').notEmpty().withMessage('A contact number is required.'),
    body('paymentMethod').isIn(['cod', 'bank_transfer']).withMessage('Choose a valid payment method.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { items, shippingAddress, phone, paymentMethod, notes = '' } = req.body;
    const resolvedItems = [];
    let subtotal = 0;
    const orderId = uuid();

    await db.firestore.runTransaction(async (transaction) => {
      // Firestore requires all reads in a transaction to happen before any writes,
      // so first read every product, then do the writes in a second pass.
      const productRefs = items.map((item) => db.docRef('products', item.productId));
      const productSnaps = await Promise.all(productRefs.map((ref) => transaction.get(ref)));

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const productSnap = productSnaps[i];
        if (!productSnap.exists) {
          throw new Error('A product in your cart is no longer available.');
        }

        const product = { id: productSnap.id, ...productSnap.data() };
        const qty = Number(item.qty) || 0;
        if (qty < 1) {
          throw new Error(`Invalid quantity for ${product.name}.`);
        }
        if (product.stock < qty) {
          throw new Error(`Only ${product.stock} left in stock for "${product.name}".`);
        }

        resolvedItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          qty,
          image: product.images && product.images[0]
        });
        subtotal += product.price * qty;
      }

      for (let i = 0; i < items.length; i++) {
        transaction.update(productRefs[i], { stock: productSnaps[i].data().stock - (Number(items[i].qty) || 0) });
      }

      const shippingFee = subtotal >= 5000 ? 0 : 200;
      const total = subtotal + shippingFee;
      const order = {
        id: orderId,
        orderNumber: 'AS' + Date.now().toString().slice(-8),
        userId: req.user.id,
        customerName: req.user.name,
        customerEmail: req.user.email,
        items: resolvedItems,
        subtotal,
        shippingFee,
        total,
        shippingAddress,
        phone,
        paymentMethod,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      transaction.set(db.docRef('orders', orderId), order);
    });

    const savedOrder = await db.getDoc('orders', orderId);
    res.status(201).json(savedOrder);
  }
);

// Customer: view their own orders
router.get('/mine', requireAuth, async (req, res) => {
  const orders = (await db.getAll('orders'))
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

router.get('/mine/:id', requireAuth, async (req, res) => {
  const order = await db.getDoc('orders', req.params.id);
  if (!order || order.userId !== req.user.id) return res.status(404).json({ error: 'Order not found.' });
  res.json(order);
});

// Admin: view all orders
router.get('/', requireAdmin, async (req, res) => {
  let orders = await db.getAll('orders');
  if (req.query.status) {
    orders = orders.filter((o) => o.status === req.query.status);
  }
  orders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

router.get('/:id', requireAdmin, async (req, res) => {
  const order = await db.getDoc('orders', req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json(order);
});

router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status.' });
  }
  const order = await db.getDoc('orders', req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  await db.updateDoc('orders', req.params.id, { status });
  res.json(await db.getDoc('orders', req.params.id));
});

module.exports = router;