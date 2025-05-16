const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// DB connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Vega',
  database: 'roll_access'
});

// GET all login logs (you can make this protected if needed)
router.get('/', (req, res) => {
  const query = `
  SELECT l.id, l.user_id, u.full_name AS username, l.ip, l.device, l.login_time
  FROM login_logs l
  JOIN users1 u ON l.user_id = u.id
  ORDER BY l.login_time DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching logs:', err);
      return res.status(500).json({ message: 'Error fetching logs' });
    }

    res.json(results);
  });
});

module.exports = router;
