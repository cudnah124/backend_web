  const mysql = require('mysql2/promise');
  let db;
  async function createDBPool() {
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
    return pool;
  }
  
  module.exports = createDBPool;