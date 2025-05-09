const express = require("express");
const multer = require("multer");
const path= require( "path");
const fs = require( "fs");
const Menu = require("../models/Menu.js");

const router = express.Router();

//// === RASM YUKLASH === ////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) &&
                  allowed.test(file.mimetype);
  isValid ? cb(null, true) : cb(new Error("Faqat rasm fayllari mumkin"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ✅ Rasm yuklash
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Rasm topilmadi" });
    const imagePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ message: "Rasm yuklandi", imagePath });
  } catch (err) {
    res.status(500).json({ error: "Server xatoligi" });
  }
});

//// === MENU MAHSULOTLAR === ////

// ✅ GET – barcha menu’ni olish
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (err) {
    res.status(500).json({ error: "Menu olishda xatolik" });
  }
});

// ✅ POST – yangi menu yaratish
router.post("/", async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    const saved = await newMenu.save();
    res.status(201).json({ message: "Menu saqlandi", data: saved });
  } catch (err) {
    res.status(400).json({ error: "Saqlash xatoligi" });
  }
});

// ✅ PUT – menu yangilash
router.put("/:id", async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ error: "Menu topilmadi" });

    res.status(200).json({ message: "Yangilandi", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Yangilashda xatolik" });
  }
});

// ✅ DELETE – menu o‘chirish
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Menu topilmadi" });

    res.status(200).json({ message: "O‘chirildi" });
  } catch (err) {
    res.status(500).json({ error: "O‘chirishda xatolik" });
  }
});

module.exports = router;
