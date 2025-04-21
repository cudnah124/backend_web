// routes/auth.js
const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/login', (req, res, next) => {
    try {
      res.json({ message: "Hello from auth route!" });
    } catch (err) {
      next(err);  // Gọi next để chuyển sang middleware xử lý lỗi (nếu có)
    }
  });

  router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    const table = role === 'Manager' ? 'UserAccount' : 'UserAccount';

    try {
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
      res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: err.message });
    }
  });

  return router;
};
