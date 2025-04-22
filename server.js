const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const paymentRoutes = require('./routes/payment');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());



// Biến toàn cục để lưu pool
let db;

async function startServer() {
  try {
    // Tạo pool đồng bộ
    db = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Nhanha213#',
      database: process.env.DB_NAME || 'TAKEAWAY_CAFE',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 50000
    });

    app.use('/api/auth', authRoutes(db));
    app.use('/api/menu', menuRoutes(db));
    app.use('/api/payment', paymentRoutes(db));

    app.get('/ping-mysql', async (req, res) => {
      try {
        const [rows] = await db.query("SELECT 1 + 1 AS result");
        res.json({ success: true, message: "MySQL connected", result: rows[0].result });
      } catch (error) {
        console.error("Lỗi khi ping MySQL:", error);
        res.status(500).json({ success: false, message: "MySQL not connected", error: error.message });
      }
    });
    // Route test kết nối
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
    process.exit(1); // Dừng chương trình nếu kết nối DB thất bại
  }
}

startServer(); // Khởi động server


