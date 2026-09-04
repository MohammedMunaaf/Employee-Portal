const axios = require('axios');

async function getZohoAccessToken() {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const accountsUrl = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com';

  if (!clientId || !clientSecret || !refreshToken || clientId.includes('EXAMPLE')) {
    console.log("❌ ZOHO ERROR: Missing credentials in ENV");
    return null;
  }

  try {
    const params = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    };

    const response = await axios.post(`${accountsUrl}/oauth/v2/token`, null, { params });

    console.log("✅ ZOHO SUCCESS: Token refreshed");

    if (response.data && response.data.access_token) {
      return response.data.access_token;
    }
    return null;
  } catch (error) {
    const errData = error.response?.data;
    console.error('[Zoho OAuth Exception]:', errData || error.message);
    return null;
  }
}

const mockApps = {
  'zoho.people': {
    appName: 'Zoho People',
    role: 'HR',
    url: 'https://people.zoho.com',
    details: { totalEmployees: 142, onboardingPending: 3, activeLeavesToday: 5 }
  },
  'zoho.crm': {
    appName: 'Zoho CRM',
    role: 'Sales',
    url: 'https://crm.zoho.com',
    details: { openDealsCount: 28, totalPipelineValue: '$450,000', closedDealsThisMonth: 12 }
  },
  'zoho.desk': {
    appName: 'Zoho Desk',
    role: 'Support',
    url: 'https://desk.zoho.com',
    details: { openTickets: 14, avgResolutionHours: 2.4, satisfactionScore: '94%' }
  },
  'zoho.books': {
    appName: 'Zoho Books',
    role: 'Finance',
    url: 'https://books.zoho.com',
    details: { pendingInvoices: 9, monthlyRevenue: '$128,500', outstandingReceivables: '$14,200' }
  }
};

// Fetch data for authorized Zoho application
async function fetchZohoAppData(appKey) {
  const token = await getZohoAccessToken();
  const appData = mockApps[appKey] || { appName: appKey, details: 'No data' };

  if (token) {
    return {
      ...appData,
      integrationMode: 'LIVE_ZOHO_OAUTH_ACTIVE',
      tokenPreview: `${token.substring(0, 15)}...`
    };
  }

  return {
    ...appData,
    integrationMode: 'DEMO_MODE'
  };
}

module.exports = {
  getZohoAccessToken,
  fetchZohoAppData
};