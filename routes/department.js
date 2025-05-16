// routes/employees.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

router.post('/', (req, res) => {
  const { name, status } = req.body;

  if (!name || !status) {
    return res.status(400).json({ error: 'Name and Status are required' });
  }

  const query = 'INSERT INTO employees (name, status) VALUES (?, ?)';
  db.query(query, [name, status], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Employee added successfully' });
  });
});


module.exports = router;
