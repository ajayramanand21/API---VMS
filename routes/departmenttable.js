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

router.get('/', (req, res) => {
    const query = 'SELECT * FROM employees';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Fetch error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  });

  router.put('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const query = 'UPDATE employees SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Status updated' });
    });
  });

  // Edit employee details by ID
  router.put('/:id', (req, res) => {

    const employeeId = req.params.id;
    const { name, status } = req.body;
    if (!name || !status) {
      return res.status(400).json({ message: 'Name and Status are required' });
    }
    const query = 'UPDATE employees SET name = ?, status = ? WHERE id = ?';
    db.query(query, [name, status, employeeId], (err, result) => {
      if (err) {
        console.error('Error updating employee', err);
        return res.status(500).json({ message: 'Error updating employee' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json({ message: 'Employee updated successfully' });
    });
  });

module.exports = router;
  
  