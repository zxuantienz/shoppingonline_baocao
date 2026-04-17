require('./utils/MongooseUtil');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // QUAN TRỌNG: Cài đặt npm install cors
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình CORS để React ở cổng bất kỳ có thể gọi API
app.use(cors({ origin: '*', methods: '*' })); 

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// 1. Kết nối Router API
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js')); 

// 🛑 Tường lửa bảo vệ: Trả về JSON lỗi nếu gọi sai API
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Lỗi: API không tồn tại hoặc Server chưa lưu code mới.' });
});

// 2. Deployment phục vụ file tĩnh (Giao diện React)
// Phục vụ trang Admin
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
app.get(/^\/admin/, (req, res) => res.sendFile(path.resolve(__dirname, '../client-admin/build/index.html')));

// Phục vụ trang Khách hàng (Trang chủ)
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client-customer/build/index.html')));

app.listen(PORT, () => {
  console.log(`Server đang chạy tại cổng ${PORT}`);
});