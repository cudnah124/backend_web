const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // dùng promise
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

(async () => {
  try {
    // Khởi tạo pool dùng async/await
    db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 1000000,
      acquireTimeout: 1000000
    });

    // Kiểm tra kết nối bằng truy vấn
    const [results] = await db.query('SELECT * FROM NhanVien');
    if (results.length === 0) {
      console.log('Không có dữ liệu trong bảng NhanVien.');
    } else {
      console.log('Dữ liệu NhanVien:', results);
    }

    // Bắt đầu server sau khi kết nối thành công
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (err) {
    console.error('Lỗi khi kết nối database:', err);
  }
})();

// Route lấy danh sách users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM UserAccount');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu', details: err });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: "Hello from backend!" });
});
