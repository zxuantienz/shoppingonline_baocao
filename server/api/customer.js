const express = require('express');
const router = express.Router();
const JwtUtil = require('../utils/JwtUtil');
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const { Category, Product, Customer, Order } = require('../models/Models');
const mongoose = require('mongoose');

// ==========================================
// 👤 Auth & Profile
// ==========================================
router.post('/signup', async (req, res) => {
  const dbCust = await Customer.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
  if (dbCust) {
    res.json({ success: false, message: 'Exists username or email' });
  } else {
    const token = CryptoUtil.md5(Date.now().toString());
    const newCust = { username: req.body.username, password: req.body.password, name: req.body.name, phone: req.body.phone, email: req.body.email, active: 0, token: token };
    const result = await Customer.create(newCust);
    if (result) {
      await EmailUtil.send(req.body.email, result._id, token);
      res.json({ success: true, message: 'Please check email' });
    } else res.json({ success: false, message: 'Insert failure' });
  }
});

router.post('/active', async (req, res) => {
  const result = await Customer.findOneAndUpdate({ _id: req.body.id, token: req.body.token }, { active: 1 }, { new: true });
  res.json(result);
});

router.post('/login', async (req, res) => {
  const customer = await Customer.findOne({ username: req.body.username, password: req.body.password });
  if (customer) {
    if (customer.active === 1) {
      const token = JwtUtil.genToken(req.body.username, req.body.password);
      res.json({ success: true, message: 'Authentication successful', token: token, customer: customer });
    } else res.json({ success: false, message: 'Account is deactive' });
  } else res.json({ success: false, message: 'Incorrect username or password' });
});

router.put('/customers/:id', JwtUtil.checkToken, async (req, res) => {
  const result = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(result);
});

// ==========================================
// 📦 Categories & Products
// ==========================================
router.get('/categories', async (req, res) => { res.json(await Category.find().exec()); });
router.get('/products/new', async (req, res) => { res.json(await Product.find().sort({ cdate: -1 }).limit(3).exec()); });
router.get('/products/hot', async (req, res) => {
  const items = await Order.aggregate([
    { $match: { status: 'APPROVED' } }, { $unwind: '$items' },
    { $group: { _id: '$items.product._id', sum: { $sum: '$items.quantity' } } },
    { $sort: { sum: -1 } }, { $limit: 3 }
  ]).exec();
  const products = [];
  for (const item of items) { products.push(await Product.findById(item._id)); }
  res.json(products);
});
router.get('/products/category/:cid', async (req, res) => { res.json(await Product.find({ 'category._id': req.params.cid }).exec()); });
router.get('/products/search/:keyword', async (req, res) => { res.json(await Product.find({ name: { $regex: new RegExp(req.params.keyword, "i") } }).exec()); });
router.get('/products/:id', async (req, res) => { res.json(await Product.findById(req.params.id).exec()); });

// ==========================================
// 🛒 Cart & Order
// ==========================================
router.post('/checkout', JwtUtil.checkToken, async (req, res) => {
  const order = { _id: new mongoose.Types.ObjectId(), cdate: Date.now(), total: req.body.total, status: 'PENDING', customer: req.body.customer, items: req.body.items };
  res.json(await Order.create(order));
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async (req, res) => {
  res.json(await Order.find({ 'customer._id': req.params.cid }).exec());
});

module.exports = router;