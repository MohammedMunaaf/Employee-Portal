const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

// Restrict all Admin routes to Admin role only
router.use(authenticateToken, requireRole(['Admin']));

router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/roles', adminController.getRoles);
router.get('/permissions', adminController.getPermissions);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
