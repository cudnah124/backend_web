const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const menuRoutes = require('./routes/menu');
const paymentRoutes = require('./routes/payment');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let db; // Global pool

async function startServer() {
  try {
    // Tạo connection pool
    db = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Nhanha213#',
      database: process.env.DB_NAME || 'TAKEAWAY_CAFE',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 100000,
    });

    // Route đăng nhập (gộp từ auth.js)
    app.post('/api/auth/login', async (req, res) => {
      const { username, password, role } = req.body;
      const table = role === 'Manager' ? 'UserAccount' : 'UserAccount'; // Có thể mở rộng role sau

      let connection;

      try {
        connection = await db.getConnection();

        const [rows] = await connection.query(
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
      } finally {
        if (connection) connection.release(); // Giải phóng connection
      }
    });

    // Các route còn lại
    app.use('/api/menu', menuRoutes(db));
    app.use('/api/payment', paymentRoutes(db));

    // Test route
    app.get('/users', async (req, res) => {
      try {
        const [rows] = await db.query("SELECT * FROM UserAccount");
        res.json(rows);
      } catch (err) {
        console.error("Lỗi truy vấn:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get('/', (req, res) => {
      res.json({ message: "Hello from backend!" });
    });

    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });

  } catch (err) {
    console.error("❌ Không thể kết nối tới database:", err);
    process.exit(1);
  }
}

startServer();
