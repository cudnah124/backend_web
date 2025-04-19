const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
// const { createUser } = require('../controllers/userController');  // Import hàm createUser
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Nhanha213#',
  database: 'TAKEAWAY_CAFE',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// Route đăng ký tài khoản mới
// router.post('/register', async (req, res) => {
//   const { username, password, role } = req.body;

//   // Tạo tài khoản
//   const result = await createUser(username, password, role);

//   if (result.success) {
//     res.json(result);
//   } else {
//     res.status(500).json(result);
//   }
// });

router.get('/login', (req, res) => {
    res.json({ message: "Hello from auth route!" });
  });
router.post('/login', async (req, res) => {
  
    const { username, password, role } = req.body;
    let table = role === 'Manager' ? 'UserAccount' : 'UserAccount';
  
    try {
      const [rows] = await db.query(`SELECT * FROM UserAccount WHERE Username = ? AND Password = ?`, [username, password]);
        
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
