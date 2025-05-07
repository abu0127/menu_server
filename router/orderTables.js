const express = require('express');
const router = express.Router();
const OrderTable = require('../models/tableModel');

// Yangi table yaratish
router.post('/', async (req, res) => {
  try {
    const orderTable = new OrderTable(req.body);
    await orderTable.save();
    res.status(201).send(orderTable);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Barcha tablarni olish
router.get('/', async (req, res) => {
  try {
    const orderTables = await OrderTable.find();
    res.send(orderTables);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ID bo'yicha table olish
router.get('/:id', async (req, res) => {
  try {
    const orderTable = await OrderTable.findById(req.params.id);
    if (!orderTable) {
      return res.status(404).send();
    }
    res.send(orderTable);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Table yangilash
router.patch('/:id', async (req, res) => {
  try {
    const orderTable = await OrderTable.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!orderTable) {
      return res.status(404).send();
    }
    res.send(orderTable);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Table o'chirish
router.delete('/:id', async (req, res) => {
  try {
    const orderTable = await OrderTable.findByIdAndDelete(req.params.id);
    if (!orderTable) {
      return res.status(404).send();
    }
    res.send(orderTable);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Tablega yangi mahsulot qo'shish
router.post('/:id/items', async (req, res) => {
  try {
    const orderTable = await OrderTable.findById(req.params.id);
    if (!orderTable) {
      return res.status(404).send();
    }
    
    orderTable.items.push(req.body);
    await orderTable.save();
    res.send(orderTable);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;