const { logAudit } = require('../services/auditService');

// Check if user has required permission
const requirePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const roles = req.user.roles || [];
    const permissions = req.user.permissions || [];

    const isAdmin = roles.includes('Admin');
    const hasPermission = isAdmin || permissions.includes(permission);

    if (!hasPermission) {
      await logAudit({
        userId: req.user.id,
        action: 'UNAUTHORIZED_ACCESS',
        details: `Access denied for permission: ${permission}`,
        ipAddress: req.ip
      });

      return res.status(403).json({ message: 'Access Denied: Insufficient permissions' });
    }

    next();
  };
};

// Check if user has allowed role
const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const roles = req.user.roles || [];
    const isAllowed = allowedRoles.some(role => roles.includes(role));

    if (!isAllowed) {
      await logAudit({
        userId: req.user.id,
        action: 'UNAUTHORIZED_ROLE_ACCESS',
        details: `Access denied for required roles: ${allowedRoles.join(', ')}`,
        ipAddress: req.ip
      });

      return res.status(403).json({ message: 'Access Denied: Role restricted' });
    }

    next();
  };
};

module.exports = {
  requirePermission,
  requireRole
};
