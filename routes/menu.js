const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


router.get('/', (req, res) => {
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

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi lấy menu:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json(results);
  });
});

module.exports = router;
