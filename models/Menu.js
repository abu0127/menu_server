// models/Menu.js
const mongoose = require('mongoose')


const itemSchema = new mongoose.Schema({
  id: String,
  name: String,
  size: String,
  originalPrice: Number,
  discount: Number,
  image: String,
  isOnSale: Boolean,
});

const categorySchema = new mongoose.Schema({
  category: String,
  image: String,
  items: [itemSchema],
});

module.exports = mongoose.model("Menu", categorySchema);
