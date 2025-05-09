// routes/orderTables.js
const express = require('express');
const Order = require('../models/order');

const router = express.Router();

// Buyurtma yuborish yoki mavjudiga qo‘shish
router.post('/orders', async (req, res) => {
  const { tableNumber, items } = req.body;

  if (!tableNumber || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Stol raqami va mahsulotlar kerak' });
  }

  try {
    const existingOrder = await Order.findOne({ tableNumber, isActive: true });

    if (existingOrder) {
      // 🔄 Mahsulotlar qo‘shish rejimi
      for (let newItem of items) {
        const index = existingOrder.items.findIndex(item => item.id === newItem.id);
        if (index !== -1) {
          existingOrder.items[index].quantity += newItem.quantity;
        } else {
          existingOrder.items.push(newItem);
        }
      }

      // Total qayta hisoblash
      existingOrder.total = existingOrder.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      await existingOrder.save();

      return res.status(200).json({
        message: `Stol ${tableNumber} uchun mahsulotlar yangilandi`,
        order: existingOrder
      });
    }

    // 🆕 Yangi buyurtma yaratish
    const newOrder = new Order({ tableNumber, items });
    await newOrder.save();

    res.status(201).json({
      message: 'Yangi buyurtma yaratildi',
      order: newOrder
    });

  } catch (err) {
    console.error('Buyurtma saqlashda xatolik:', err);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
});

// Barcha buyurtmalarni olish
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Buyurtmalarni olishda xatolik:', err);
    res.status(500).json({ error: 'Server xatoligi' });
  }
});

// Buyurtmani yakunlash
// PATCH /api/orders/:id/complete
router.patch('/orders/:id/complete', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Buyurtma topilmadi" });

    res.json({ message: "Buyurtma yakunlandi", order: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server xatoligi" });
  }
});


// Buyurtmani o'chirish (ixtiyoriy)
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Buyurtma topilmadi' });
    }
    res.status(200).json({ message: 'Buyurtma o‘chirildi' });
  } catch (err) {
    res.status(500).json({ error: 'Buyurtmani o‘chirishda xatolik' });
  }
});

module.exports = router;