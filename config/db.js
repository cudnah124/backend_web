const mysql = require('mysql2/promise');

let db;  // Khai báo biến db toàn cục

// Hàm tạo và trả về pool kết nối
async function createDBPool() {
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
      connectTimeout: 100000,
      acquireTimeout: 100000
    });
    console.log('✅ Kết nối pool DB thành công!');
  } catch (err) {
    console.error("❌ Không thể kết nối tới database:", err);
    process.exit(1);  // Dừng server nếu không thể kết nối DB
  }
}

// Hàm để lấy đối tượng db đã khởi tạo
function getDB() {
  if (!db) {
    throw new Error('DB chưa được khởi tạo!');
  }
  return db;
}

module.exports = { createDBPool, getDB };
