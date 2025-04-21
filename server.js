const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// 🔧 Cấu hình database
const db_config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'example',
  port: process.env.DB_PORT || 3306
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);

  connection.connect(function(err) {
    if (err) {
      console.error('❌ Error when connecting to DB:', err);
      setTimeout(handleDisconnect, 2000); // thử lại sau 2 giây
    } else {
      console.log('✅ Connected to MySQL!');
    }
  });

  connection.on('error', function(err) {
    console.error('🔥 MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('⚠️ Reconnecting to MySQL...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect(); // Bắt đầu kết nối

// 📦 ROUTES
app.get('/', (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// 📡 Route kiểm tra kết nối DB
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM UserAccount', (err, results) => {
    if (err) {
      console.error('Lỗi DB:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// 🚀 Start server
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
