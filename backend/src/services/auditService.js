const db = require('../config/db');

async function logAudit({ userId = null, action, details = '', ipAddress = '127.0.0.1' }) {
  try {
    const sql = `INSERT INTO AuditLogs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)`;
    await db.query(sql, [userId, action, details, ipAddress]);
  } catch (error) {
    console.error('Failed to insert audit log:', error.message);
  }
}

module.exports = { logAudit };
