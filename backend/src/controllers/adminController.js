const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { logAudit } = require('../services/auditService');

async function getUsers(req, res) {
  try {
    const sql = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.is_active, 
        u.created_at,
        IFNULL(GROUP_CONCAT(r.name SEPARATOR ', '), 'NONE') AS roles
      FROM Users u
      LEFT JOIN UserRoles ur ON u.id = ur.user_id
      LEFT JOIN Roles r ON ur.role_id = r.id
      GROUP BY u.id
      ORDER BY u.id ASC
    `;
    const [rows] = await db.query(sql);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Failed to fetch users list.' });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, role_id } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const [existing] = await db.query('SELECT id FROM Users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO Users (name, email, password_hash, is_active) VALUES (?, ?, ?, 1)',
      [name, email, passwordHash]
    );

    const newUserId = result.insertId || (result[0] && result[0].insertId);

    if (newUserId) {
      await db.query('INSERT INTO UserRoles (user_id, role_id) VALUES (?, ?)', [newUserId, role_id]);
      await logAudit({
        userId: req.user.id,
        action: 'ADMIN_CREATE_USER',
        details: `Created user ${email}`,
        ipAddress
      });
      return res.status(201).json({ message: 'User created successfully' });
    }
    throw new Error('Failed to insert user');
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Failed to create user.' });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, password, role_id } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (password && password.trim().length > 0) {
      const passwordHash = await bcrypt.hash(password, 10);
      await db.query('UPDATE Users SET name = ?, email = ?, password_hash = ? WHERE id = ?', [name, email, passwordHash, userId]);
    } else {
      await db.query('UPDATE Users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
    }

    if (role_id) {
      await db.query('DELETE FROM UserRoles WHERE user_id = ?', [userId]);
      await db.query('INSERT INTO UserRoles (user_id, role_id) VALUES (?, ?)', [userId, role_id]);
    }

    await logAudit({
      userId: req.user.id,
      action: 'ADMIN_UPDATE_USER',
      details: `Updated user ID: ${userId}`,
      ipAddress
    });

    return res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Failed to update user.' });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (Number(userId) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account.' });
    }

    // Order matters for foreign keys
    await db.query('DELETE FROM UserRoles WHERE user_id = ?', [userId]);
    await db.query('UPDATE AuditLogs SET user_id = NULL WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM Users WHERE id = ?', [userId]);

    await logAudit({
      userId: req.user.id,
      action: 'ADMIN_DELETE_USER',
      details: `Deleted user ID: ${userId}`,
      ipAddress
    });

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
}

async function getRoles(req, res) {
  try {
    const [roles] = await db.query('SELECT * FROM Roles ORDER BY id ASC');
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch roles.' });
  }
}

async function getPermissions(req, res) {
  try {
    const [permissions] = await db.query('SELECT * FROM Permissions ORDER BY id ASC');
    return res.status(200).json(permissions);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch permissions.' });
  }
}

async function getAuditLogs(req, res) {
  try {
    const sql = `
      SELECT al.id, u.name AS user_name, u.email AS user_email, al.action, al.details, al.ip_address, al.created_at
      FROM AuditLogs al
      LEFT JOIN Users u ON al.user_id = u.id
      ORDER BY al.id DESC LIMIT 100
    `;
    const [logs] = await db.query(sql);
    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch audit logs.' });
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
  getPermissions,
  getAuditLogs
};