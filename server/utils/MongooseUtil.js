// server/utils/MongooseUtil.js
const dns = require('dns');
// FIX LỖI DNS: Bắt buộc set máy chủ DNS Google hoặc Cloudflare
dns.setServers(['1.1.1.1','1.0.0.1']); 

const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri = 'mongodb+srv://' + MyConstants.DB_USER + ':' + MyConstants.DB_PASS + '@' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE;

mongoose.connect(uri)
  .then(() => { console.log('Connected to ' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE); })
  .catch((err) => { console.error('Lỗi kết nối MongoDB:', err); });
