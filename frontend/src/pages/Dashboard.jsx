import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ZohoCard from '../components/ZohoCard';

export default function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await API.get('/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ color: '#64748b' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert-error">{error}</div>
      </div>
    );
  }

  const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'Employee';

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Welcome, {user.name}</h1>
        <p className="page-subtitle">
          Logged in as <strong>{user.email}</strong> | Role:{' '}
          <span className={`badge badge-${primaryRole.toLowerCase()}`}>{primaryRole}</span>
        </p>
      </div>

      <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
        Authorized Zoho Applications
      </h2>

      {dashboardData?.applications?.length === 0 ? (
        <p style={{ color: '#64748b' }}>No applications assigned to your role.</p>
      ) : (
        <div className="app-grid">
          {dashboardData?.applications?.map((app) => (
            <ZohoCard key={app.key} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
