const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import route dưới dạng HÀM (factory nhận `db`)
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const paymentRoutes = require('./routes/payment');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/payment', paymentRoutes);

let db;

async function startServer() {
  try {
    // Tạo pool đồng bộ
    db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 100000,
      acquireTimeout: 100000
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
