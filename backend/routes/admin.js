const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', requireAdmin, async (req, res) => {
  const orders = await db.getAll('orders');
  const products = await db.getAll('products');
  const customers = await db.queryByField('users', 'role', '==', 'customer');

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const lowStock = products.filter((p) => p.stock <= 10).length;

  const salesByProduct = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      salesByProduct[item.name] = (salesByProduct[item.name] || 0) + item.qty;
    });
  });
  const topProducts = Object.entries(salesByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));

  res.json({
    totalRevenue: revenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: customers.length,
    lowStock,
    statusCounts,
    topProducts,
    recentOrders: [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  });
});

router.get('/customers', requireAdmin, async (req, res) => {
  const customers = await db.queryByField('users', 'role', '==', 'customer');
  const orders = await db.getAll('orders');

  const enriched = customers.map(({ password, ...c }) => {
    const customerOrders = orders.filter((o) => o.userId === c.id);
    return {
      ...c,
      orderCount: customerOrders.length,
      totalSpent: customerOrders.reduce((sum, o) => sum + o.total, 0)
    };
  });

  res.json(enriched);
});

module.exports = router;
