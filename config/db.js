  const mysql = require('mysql2/promise');

  const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000
  });
(async () => {
    try {
      const conn = await db.getConnection(); // test thử kết nối
      console.log('✅ Kết nối DB thành công!');
      conn.release();
    } catch (err) {
      console.error('❌ Lỗi kết nối DB:', err);
    }
  })();
  
  module.exports = db;