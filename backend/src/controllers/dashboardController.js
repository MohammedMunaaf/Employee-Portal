const zohoApps = [
  {
    key: 'zoho.people',
    name: 'Zoho People',
    role: 'HR',
    description: 'Human Resources management, employee directory, and leave tracking.',
    apiEndpoint: '/zoho/people',
    launchUrl: 'https://people.zoho.com'
  },
  {
    key: 'zoho.crm',
    name: 'Zoho CRM',
    role: 'Sales',
    description: 'Customer Relationship Management, deal tracking, and sales leads.',
    apiEndpoint: '/zoho/crm',
    launchUrl: 'https://crm.zoho.com'
  },
  {
    key: 'zoho.desk',
    name: 'Zoho Desk',
    role: 'Support',
    description: 'Customer support ticketing system and SLA tracking.',
    apiEndpoint: '/zoho/desk',
    launchUrl: 'https://desk.zoho.com'
  },
  {
    key: 'zoho.books',
    name: 'Zoho Books',
    role: 'Finance',
    description: 'Financial accounting, invoicing, and expense management.',
    apiEndpoint: '/zoho/books',
    launchUrl: 'https://books.zoho.com'
  }
];

async function getDashboardData(req, res) {
  try {
    const userPermissions = req.user.permissions || [];
    const userRoles = req.user.roles || [];
    const isAdmin = userRoles.includes('Admin');

    const authorizedApps = zohoApps.filter(app => isAdmin || userPermissions.includes(app.key));

    return res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        roles: userRoles
      },
      applications: authorizedApps
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch dashboard data.' });
  }
}

module.exports = {
  getDashboardData
};
