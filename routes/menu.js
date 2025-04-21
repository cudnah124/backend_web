const express = require('express');
const router = express.Router();
const db = require('../config/db'); // sử dụng pool từ file db.js

// Lấy danh sách menu
router.get('/', async (req, res) => {
  const sql = `
    SELECT 
      m.MaMon,
      m.TenMon,
      'NuocUong' AS Loai,
      k.KichThuoc,
      k.Gia
    FROM Menu m
    JOIN NuocUong n ON m.MaMon = n.MaMon
    JOIN KichThuocDoUong k ON n.MaMon = k.MaMon

    UNION

    SELECT 
      m.MaMon,
      m.TenMon,
      'Topping' AS Loai,
      NULL AS KichThuoc,
      t.Gia
    FROM Menu m
    JOIN Topping t ON m.MaMon = t.MaMon
  `;

  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Lỗi lấy menu:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;
