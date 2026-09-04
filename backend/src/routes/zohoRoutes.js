const express = require('express');
const router = express.Router();
const zohoController = require('../controllers/zohoController');
const authenticateToken = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');

router.get('/people', authenticateToken, requirePermission('zoho.people'), zohoController.getPeopleData);
router.get('/crm', authenticateToken, requirePermission('zoho.crm'), zohoController.getCrmData);
router.get('/desk', authenticateToken, requirePermission('zoho.desk'), zohoController.getDeskData);
router.get('/books', authenticateToken, requirePermission('zoho.books'), zohoController.getBooksData);

module.exports = router;
