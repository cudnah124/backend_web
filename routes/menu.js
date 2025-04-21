const express = require('express');
const router = express.Router();

// Nhận đối tượng db từ server.js
module.exports = (db) => {

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
      res.json(results); // Trả kết quả dưới dạng JSON
    } catch (err) {
      console.error('Lỗi lấy menu:', err);
      res.status(500).json({ error: 'Lỗi server' });
    }
  });

  return router;
};
