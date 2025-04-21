const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');


router.get('/login', (req, res) => {
  res.json({ message: "Hello from auth route!" });
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  // Có thể mở rộng sau nếu mỗi vai trò có bảng khác
  const table = role === 'Manager' ? 'UserAccount' : 'UserAccount';

  try {
    const db = getDB();
    const [rows] = await db.query(
      `SELECT * FROM ${table} WHERE Username = ? AND Password = ?`,
      [username, password]
    );

    if (rows.length > 0) {
      res.json({ success: true, message: 'Đăng nhập thành công!' });
    } else {
      res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu.' });
    }
  } catch (err) {
    console.error("Lỗi DB:", err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: err });
  }
});

module.exports = router;
