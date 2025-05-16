const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// DB Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Create Role
router.post('/roles', (req, res) => {
    console.log(req.body);  // Debug log
    const { name } = req.body || {};
  
    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }
  
    db.query('INSERT INTO roles1 (name) VALUES (?)', [name], (err, result) => {
      if (err) {
        console.error('Error creating role:', err);
        return res.status(500).json({ message: 'Error creating role' });
      }
      res.status(201).json({ message: 'Role created', roleId: result.insertId });
    });
  });

// Get All roles1
router.get('/roles', (req, res) => {
  db.query('SELECT * FROM roles1', (err, results) => {
    if (err) {
      console.error('Error fetching roles:', err);
      return res.status(500).json({ message: 'Error fetching roles1' });
    }
    res.status(200).json(results);
  });
});

// Create Module
router.post('/modules', (req, res) => {
  const { name } = req.body || {};

  if (!name) {
    return res.status(400).json({ message: 'Module name is required' });
  }

  db.query('INSERT INTO modules1 (name) VALUES (?)', [name], (err, result) => {
    if (err) {
      console.error('Error creating module:', err);
      return res.status(500).json({ message: 'Error creating module' });
    }
    res.status(201).json({ message: 'Module created', moduleId: result.insertId });
  });
});

// Get All modules1
router.get('/modules', (req, res) => {
  db.query('SELECT * FROM modules1', (err, results) => {
    if (err) {
      console.error('Error fetching modules:', err);
      return res.status(500).json({ message: 'Error fetching modules1' });
    }
    res.status(200).json(results);
  });
});

// Set permissions1 for Role & Module
router.post('/permissions', (req, res) => {
  const { role_id, module_id, can_view, can_edit, can_add } = req.body || {};

  if (!role_id || !module_id) {
    return res.status(400).json({ message: 'role_id and module_id are required' });
  }

  db.query(
    `REPLACE INTO permissions1 (role_id, module_id, can_view, can_edit, can_add)
     VALUES (?, ?, ?, ?, ?)`,
    [role_id, module_id, !!can_view, !!can_edit, !!can_add],
    (err) => {
      if (err) {
        console.error('Error saving permissions1:', err);
        return res.status(500).json({ message: 'Error saving permissions1' });
      }
      res.status(200).json({ message: 'Permissions1 saved successfully' });
    }
  );
});

// Get permissions1 for Role
router.get('/permissions/:roleId', (req, res) => {
  const roleId = req.params.roleId;

  db.query(
    `SELECT m.name AS module, p.can_view, p.can_edit, p.can_add
     FROM permissions1 p
     JOIN modules1 m ON p.module_id = m.id
     WHERE p.role_id = ?`,
    [roleId],
    (err, results) => {
      if (err) {
        console.error('Error fetching permissions:', err);
        return res.status(500).json({ message: 'Error fetching permissions' });
      }
      res.status(200).json(results);
    }
  );
});

module.exports = router;
