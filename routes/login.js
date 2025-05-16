const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const moment = require('moment');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for JWT
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}); 

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login Route
router.post('/', (req, res) => {
  const { email, password, ip, device } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  db.query(
    'SELECT * FROM users1 WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = results[0];
      const loginTime = moment().format('YYYY-MM-DD HH:mm:ss');

 
      db.query(
        'INSERT INTO login_logs (user_id, ip, device, login_time) VALUES (?, ?, ?, ?)',
        [user.id, ip || 'Unknown', device || 'Unknown', loginTime],
        (logErr) => {
          if (logErr) return res.status(500).json({ message: 'Logging failed' });

          // Generate JWT token
          const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1m' }
          );

          return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role
            }
          });
        }
      );
    }
  );
});



// Example protected route
router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
