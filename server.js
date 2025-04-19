const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const authRoutes = require('./routes/auth');
const app = express();
const menuRoutes = require('./routes/menu');
const paymentRoutes = require('./routes/payment');
const port = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/payment', paymentRoutes);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 50000,
  acquireTimeout: 50000
});

db.query('SELECT * FROM NhanVien', (err, results) => {
  if (err) {
    console.error('Lỗi truy vấn:', err);
  } else {
    if (results.length === 0) {
      console.log('Không có dữ liệu trong bảng menu.');
    } else {
      console.log('Dữ liệu menu:', results);
    }
  }
});

app.get('/users' , (req, res) => {
    const sql = "SELECT * FROM UserAccount"
    db.query(sql, (err, data) =>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/', (req, res) => {
    res.json({ message: "Hello from backend!" });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
