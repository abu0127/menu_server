const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI );
    console.log('MongoDB ga muvaffaqiyatli ulanildi');
  } catch (err) {
    console.error('MongoDB ulanishda xato:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;