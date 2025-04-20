const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Test GET route
  router.get('/login', (req, res) => {
    res.json({ message: "Hello from auth route!" });
  });

  // POST /login
  router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    // (Nếu sau này role dùng để chọn bảng khác thì xử lý ở đây)
    const table = 'UserAccount';

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
      res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: err });
    }
  });

  return router;
};
