import React, { useState } from 'react';
import API from '../services/api';
import { ExternalLink, Database, AlertCircle } from 'lucide-react';

export default function ZohoCard({ app }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiPath = app.apiEndpoint || app.endpoint || `/api/zoho/${app.key?.split('.')[1] || ''}`;
  const targetUrl = app.launchUrl || app.url || 'https://www.zoho.com';

  const fetchAppData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(apiPath);
      setData(response.data);
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;
      if (status === 401) {
        setError('Session expired or unauthenticated. Please log out and log in again.');
      } else if (serverMessage) {
        setError(serverMessage);
      } else {
        setError(`Error (${status || 'Network'}): Unable to fetch data from backend.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const primaryRole = app.role ? app.role.toLowerCase() : 'employee';

  return (
    <div className="app-card" style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{app.name}</h3>
        <span className={`badge badge-${primaryRole}`}>{app.role}</span>
      </div>

      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{app.description}</p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
        >
          <ExternalLink size={16} style={{ display: 'inline', marginRight: '4px' }} /> Open App
        </a>
        <button onClick={fetchAppData} className="btn btn-outline" disabled={loading}>
          <Database size={16} style={{ display: 'inline', marginRight: '4px' }} /> {loading ? 'Loading...' : 'View Stats'}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: '10px', color: '#dc2626', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {data && (
        <div className="api-result-box" style={{ marginTop: '15px', padding: '12px', background: '#0f172a', color: '#38bdf8', borderRadius: '6px', fontSize: '0.8rem' }}>
          <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '5px' }}>
            Integration Mode: {data.integrationMode || 'ACTIVE'}
          </div>
          {data.tokenPreview && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
              Token Preview: {data.tokenPreview}
            </div>
          )}
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data.details || data.payload?.data || data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}