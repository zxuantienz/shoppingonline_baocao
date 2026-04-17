const express = require('express');
const router = express.Router();
const JwtUtil = require('../utils/JwtUtil');
const mongoose = require('mongoose');
const { Admin, Category, Product, Order, Customer } = require('../models/Models');

// ==========================================
// 🔑 1. API Auth (Đăng nhập Admin)
// ==========================================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username: username, password: password });
  if (admin) {
    const token = JwtUtil.genToken(username, password);
    res.json({ success: true, message: 'Authentication successful', token: token });
  } else {
    res.json({ success: false, message: 'Incorrect username or password' });
  }
});

router.get('/token', JwtUtil.checkToken, (req, res) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});

// ==========================================
// 📁 2. API Categories (Quản lý Danh mục)
// ==========================================
// API lấy danh sách danh mục (CHÍNH LÀ ĐOẠN API NÀY)
router.get('/categories', JwtUtil.checkToken, async (req, res) => {
  res.json(await Category.find().exec());
});

router.post('/categories', JwtUtil.checkToken, async (req, res) => {
  const category = { _id: new mongoose.Types.ObjectId(), name: req.body.name };
  res.json(await Category.create(category));
});

router.put('/categories/:id', JwtUtil.checkToken, async (req, res) => {
  res.json(await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true }));
});

router.delete('/categories/:id', JwtUtil.checkToken, async (req, res) => {
  res.json(await Category.findByIdAndDelete(req.params.id));
});

// ==========================================
// 📦 3. API Products (Quản lý Sản phẩm)
// ==========================================
router.get('/products', JwtUtil.checkToken, async (req, res) => {
  let products = await Product.find().exec();
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  let curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page);
  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);
  res.json({ products: products, noPages: noPages, curPage: curPage });
});

router.post('/products', JwtUtil.checkToken, async (req, res) => {
  const category = await Category.findById(req.body.category);
  const product = { _id: new mongoose.Types.ObjectId(), name: req.body.name, price: req.body.price, image: req.body.image, cdate: Date.now(), category: category };
  res.json(await Product.create(product));
});

router.put('/products/:id', JwtUtil.checkToken, async (req, res) => {
  const category = await Category.findById(req.body.category);
  const product = { name: req.body.name, price: req.body.price, image: req.body.image, cdate: Date.now(), category: category };
  res.json(await Product.findByIdAndUpdate(req.params.id, product, { new: true }));
});

router.delete('/products/:id', JwtUtil.checkToken, async (req, res) => {
  res.json(await Product.findByIdAndDelete(req.params.id));
});

// ==========================================
// 🛒 4. API Orders (Quản lý Đơn hàng)
// ==========================================
router.get('/orders', JwtUtil.checkToken, async (req, res) => {
  res.json(await Order.find().sort({ cdate: -1 }).exec());
});

router.put('/orders/status/:id', JwtUtil.checkToken, async (req, res) => {
  res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async (req, res) => {
  res.json(await Order.find({ 'customer._id': req.params.cid }).exec());
});

// ==========================================
// 👥 5. API Customers (Quản lý Khách hàng)
// ==========================================
router.get('/customers', JwtUtil.checkToken, async (req, res) => {
  res.json(await Customer.find().exec());
});

router.put('/customers/deactive/:id', JwtUtil.checkToken, async (req, res) => {
  res.json(await Customer.findOneAndUpdate({ _id: req.params.id, token: req.body.token }, { active: 0 }, { new: true }));
});

// Admin gửi mail cho khách
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const id = req.params.id;
  const cust = await Customer.findById(id).exec();
  if (cust) {
    const EmailUtil = require('../utils/EmailUtil');
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

module.exports = router;
