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

// Get all employees
router.get('/', (req, res) => {
  const query = 'SELECT * FROM employees_data';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Add employee
router.post('/', (req, res) => {
  const emp = req.body;
  const query = `
    INSERT INTO employees_data 
    (firstname, lastname, emailid, phoneno, joiningDate, gender, company, department, destination, status, remarks, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    emp.firstname, emp.lastname, emp.emailid, emp.phoneno, emp.joiningDate,
    emp.gender, emp.company, emp.department, emp.destination, emp.status,
    emp.remarks, emp.password
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ error: 'Failed to add employee' });
    }
    res.status(201).json({ message: 'Employee added successfully' });
  });
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const empid = req.params.id; // Ensure that the employee ID is correctly captured

  console.log(`Updating status for empid: ${empid} to status: ${status}`);

  if (!empid) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  const query = 'UPDATE employees_data SET status = ? WHERE empid = ?';
  db.query(query, [status, empid], (err, result) => {
    if (err) {
      console.error('Status update error:', err);
      return res.status(500).json({ error: 'Failed to update status' });
    }
    res.json({ message: 'Status updated successfully' });
  });
});

// Update status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const query = 'UPDATE employees_data SET status = ? WHERE empid = ?';
  db.query(query, [status, req.params.id], (err, result) => {
    if (err) {
      console.error('Status update error:', err);
      return res.status(500).json({ error: 'Failed to update status' });
    }
    res.json({ message: 'Status updated successfully' });
  });
});

module.exports = router;
