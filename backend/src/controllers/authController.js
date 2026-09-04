const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { logAudit } = require('../services/auditService');

async function getUserRolesAndPermissions(userId) {
  const sql = `
    SELECT 
      ur.user_id,
      r.id AS role_id,
      r.name AS role_name,
      p.id AS permission_id,
      p.name AS permission_name
    FROM UserRoles ur
    JOIN Roles r ON ur.role_id = r.id
    LEFT JOIN RolePermissions rp ON r.id = rp.role_id
    LEFT JOIN Permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = ?
  `;
  const [rows] = await db.query(sql, [userId]);

  const roles = [...new Set(rows.map(row => row.role_name))];
  const permissions = [...new Set(rows.map(row => row.permission_name).filter(Boolean))];

  return { roles, permissions };
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (users.length === 0) {
      await logAudit({ action: 'LOGIN_FAILED', details: `Invalid login attempt for email: ${email}`, ipAddress });
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = users[0];
    if (!user.is_active) {
      await logAudit({ userId: user.id, action: 'LOGIN_FAILED', details: 'Inactive account login attempt', ipAddress });
      return res.status(403).json({ message: 'Account is deactivated.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      await logAudit({ userId: user.id, action: 'LOGIN_FAILED', details: 'Incorrect password entered', ipAddress });
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const { roles, permissions } = await getUserRolesAndPermissions(user.id);

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles,
      permissions
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_employee_portal_jwt_key_2026',
      { expiresIn: '8h' }
    );

    await logAudit({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      details: `User logged in successfully with roles: [${roles.join(', ')}]`,
      ipAddress
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
        permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
}

async function getMe(req, res) {
  try {
    const { roles, permissions } = await getUserRolesAndPermissions(req.user.id);
    return res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        roles,
        permissions
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
}

async function logout(req, res) {
  if (req.user) {
    await logAudit({
      userId: req.user.id,
      action: 'LOGOUT',
      details: 'User logged out of the portal',
      ipAddress: req.ip || req.connection.remoteAddress
    });
  }
  return res.status(200).json({ message: 'Logout successful.' });
}

module.exports = {
  login,
  getMe,
  logout
};
