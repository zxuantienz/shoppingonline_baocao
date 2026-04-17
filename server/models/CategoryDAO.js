require('../utils/MongooseUtil');
const Models = require('./Models');

const CategoryDAO = {
  async selectAll() {
    return await Models.Category.find({}).exec();
  },
  async insert(category) {
    const mongoose = require('mongoose');
    category._id = new mongoose.Types.ObjectId();
    return await Models.Category.create(category);
  }
  // Thêm update() và delete() theo Lab 03...
};
module.exports = CategoryDAO;

