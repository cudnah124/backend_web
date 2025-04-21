const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let db;

async function startServer() {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 100000
    });

    console.log('✅ Kết nối pool DB thành công!');

    // ❗ import sau khi db đã sẵn sàng
    const authRoutes = require('./routes/auth')(db);
    const menuRoutes = require('./routes/menu')(db);
    const paymentRoutes = require('./routes/payment')(db);

    app.use('/api/auth', authRoutes);
    app.use('/api/menu', menuRoutes);
    app.use('/api/payment', paymentRoutes);

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
