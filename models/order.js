// models/order.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true },
  items: [itemSchema],
  total: { type: Number },
  isActive: { type: Boolean, default: true }, // yangi maydon
  createdAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function (next) {
  this.total = this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
