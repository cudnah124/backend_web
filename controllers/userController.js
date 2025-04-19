const bcrypt = require('bcrypt');
const db = require('../config/db');

// Hàm tạo tài khoản người dùng
async function createUser(username, password, role) {
  try {
    const saltRounds = 10;  // Số lần băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, saltRounds);  // Mã hóa mật khẩu

    // Thêm tài khoản vào cơ sở dữ liệu
    const query = `INSERT INTO UserAccount (Username, Password, Role) VALUES (?, ?, ?)`;
    await db.query(query, [username, hashedPassword, role]);

    return { success: true, message: 'Tạo tài khoản thành công!' };
  } catch (err) {
    return { success: false, message: 'Lỗi tạo tài khoản', error: err };
  }
}

module.exports = { createUser };
