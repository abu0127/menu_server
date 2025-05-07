const mongoose = require('mongoose');


const orderItemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderTableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    min: 1
  },
  customerName: {
    type: String,
    default: ''
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'paid'],
    default: 'active'
  }
});

// Avtomatik totalPrice hisoblash
orderTableSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

const OrderTable = mongoose.model('OrderTable', orderTableSchema);

module.exports = OrderTable;