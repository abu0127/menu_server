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
  },
  productImage: {
    data: Buffer,
    contentType: String
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
  },
  tableImage: {
    data: Buffer,
    contentType: String
  },
  orderImages: [{
    data: Buffer,
    contentType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Avtomatik totalPrice hisoblash
orderTableSchema.pre('save', function(next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

// RASM HAJMINI TEKSHIRISH MIDDLEWARE
orderTableSchema.pre('save', function(next) {
  // TableImage hajmini tekshirish
  if (this.tableImage && this.tableImage.data.length > 5 * 1024 * 1024) {
    throw new Error('Table image size exceeds 5MB limit');
  }
  
  // Har bir itemdagi rasmlarni tekshirish
  this.items.forEach(item => {
    if (item.productImage && item.productImage.data.length > 2 * 1024 * 1024) {
      throw new Error(`Product image for ${item.productName} exceeds 2MB limit`);
    }
  });
  
  next();
});

const OrderTable = mongoose.model('OrderTable', orderTableSchema);

module.exports = OrderTable;