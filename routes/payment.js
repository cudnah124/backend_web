const express = require('express');
const router = express.Router();

const mysql = require('mysql');
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


router.use(express.json());

// Hàm dùng chung để lấy tất cả khách hàng
function fetchAllCustomers(callback) {
  const sql = `
    SELECT KH.MaKH, KH.Ho, KH.Ten, KH.DiemTichLuy, KH.LoaiThanhVien, SDT.SDT
    FROM KhachHang KH
    LEFT JOIN SDT_KhachHang SDT ON KH.MaKH = SDT.MaKH
    ORDER BY KH.MaKH DESC
  `;
  db.query(sql, callback);
}

// Route test
router.get('/', (req, res) => {
  res.json({ message: "Hello from customer route!" });
});

// Route GET để lấy toàn bộ khách hàng
router.get('/all', (req, res) => {
  fetchAllCustomers((err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn khách hàng:", err);
      return res.status(500).json({ message: 'Lỗi server khi truy vấn khách hàng.', error: err });
    }
    res.status(200).json({ customers: results });
  });
});

// Route POST để thêm khách hàng mới
router.post('/', async (req, res) => {
  db.getConnection(async (err, connection) => {
    if (err) {
      console.error("Lỗi khi lấy connection từ pool:", err);
      return res.status(500).json({ message: 'Lỗi kết nối database.' });
    }

    const { firstname, lastname, phone } = req.body;
    if (!firstname && !lastname && !phone) {
      connection.release();
      return res.status(400).json({ message: 'Thiếu thông tin khách hàng.' });
    }

    const beginTransaction = () =>
      new Promise((resolve, reject) => {
        connection.beginTransaction(err => {
          if (err) reject(err);
          else resolve();
        });
      });

    const queryAsync = (sql, params) =>
      new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

    const commit = () =>
      new Promise((resolve, reject) => {
        connection.commit(err => {
          if (err) reject(err);
          else resolve();
        });
      });

    const rollback = () =>
      new Promise(resolve => {
        connection.rollback(() => resolve());
      });

    try {
      await beginTransaction();
      console.log("Bắt đầu thêm khách hàng...");

      const result = await queryAsync(
        `INSERT INTO KhachHang (Ho, Ten) VALUES (?, ?)`,
        [firstname, lastname]
      );

      const newMaKH = result.insertId;

      await queryAsync(
        `INSERT INTO SDT_KhachHang (MaKH, SDT) VALUES (?, ?)`,
        [newMaKH, phone]
      );

      await commit();

      const allCustomers = await new Promise((resolve, reject) => {
        fetchAllCustomers((err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      res.status(200).json({
        message: 'Thêm khách hàng thành công.',
        MaKH: newMaKH,
        firstname,
        lastname,
        phone,
        allCustomers
      });
      console.log(res.json()); 
    } catch (err) {
      console.error("Lỗi trong quá trình xử lý:", err);
      await rollback();
      res.status(500).json({ message: 'Lỗi trong quá trình xử lý.', error: err });
    } finally {
      connection.release(); // rất quan trọng khi dùng connection pool
    }
  });
});


module.exports = router;
