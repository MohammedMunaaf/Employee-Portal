const zohoService = require('../services/zohoService');
const { logAudit } = require('../services/auditService');

async function getPeopleData(req, res) {
  try {
    const data = await zohoService.fetchZohoAppData('zoho.people');
    await logAudit({
      userId: req.user.id,
      action: 'ZOHO_APP_ACCESS',
      details: 'User accessed Zoho People API data',
      ipAddress: req.ip || req.connection.remoteAddress
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error communicating with Zoho People Service.' });
  }
}

async function getCrmData(req, res) {
  try {
    const data = await zohoService.fetchZohoAppData('zoho.crm');
    await logAudit({
      userId: req.user.id,
      action: 'ZOHO_APP_ACCESS',
      details: 'User accessed Zoho CRM API data',
      ipAddress: req.ip || req.connection.remoteAddress
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error communicating with Zoho CRM Service.' });
  }
}

async function getDeskData(req, res) {
  try {
    const data = await zohoService.fetchZohoAppData('zoho.desk');
    await logAudit({
      userId: req.user.id,
      action: 'ZOHO_APP_ACCESS',
      details: 'User accessed Zoho Desk API data',
      ipAddress: req.ip || req.connection.remoteAddress
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error communicating with Zoho Desk Service.' });
  }
}

async function getBooksData(req, res) {
  try {
    const data = await zohoService.fetchZohoAppData('zoho.books');
    await logAudit({
      userId: req.user.id,
      action: 'ZOHO_APP_ACCESS',
      details: 'User accessed Zoho Books API data',
      ipAddress: req.ip || req.connection.remoteAddress
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error communicating with Zoho Books Service.' });
  }
}

module.exports = {
  getPeopleData,
  getCrmData,
  getDeskData,
  getBooksData
};
