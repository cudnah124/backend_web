const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
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
  host: 'localhost',
  user: 'root',
  password: 'Nhanha213#',
  database: 'TAKEAWAY_CAFE',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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
