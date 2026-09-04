import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { UserPlus, Shield, Activity, Trash2, RefreshCw } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // New User Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: 'Password123!', role_id: '2' });

  useEffect(() => {
    loadAdminData();
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);

      return () => clearTimeout(timer)
    }
  }, [successMsg]);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [uRes, rRes, pRes, aRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/roles'),
        API.get('/admin/permissions'),
        API.get('/admin/audit-logs')
      ]);
      setUsers(uRes.data);
      setRoles(rRes.data);
      setPermissions(pRes.data);
      setAuditLogs(aRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    try {
      await API.post('/admin/users', newUser);
      setSuccessMsg(`User ${newUser.name} (${newUser.email}) created successfully.`);
      setNewUser({ name: '', email: '', password: 'Password123!', role_id: '2' });
      setShowAddModal(false);
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    }
  };

  const handleDeleteUser = async (userId, userName, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete user ${userName} (${userEmail}) ?`)) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await API.delete(`/admin/users/${userId}`);
      setSuccessMsg(`User ${userName} (${userEmail}) deleted successfully.`);
      loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ color: '#64748b' }}>Loading Admin Console...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Admin Management Panel</h1>
          <p className="page-subtitle">Manage system users, inspect roles & permissions, and monitor security audit logs.</p>
        </div>
        <button onClick={loadAdminData} className="btn btn-outline">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {successMsg && (
        <div style={{ padding: '0.75rem', background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <UserPlus size={16} style={{ display: 'inline', marginRight: '6px' }} /> User Management ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          <Shield size={16} style={{ display: 'inline', marginRight: '6px' }} /> Roles & Permissions ({roles.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <Activity size={16} style={{ display: 'inline', marginRight: '6px' }} /> Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={() => setShowAddModal(!showAddModal)}>
              <UserPlus size={16} /> {showAddModal ? 'Cancel' : 'Create New User'}
            </button>
          </div>

          {showAddModal && (
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Create Portal Employee Account</h3>
              <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Initial Password</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Assign Role</label>
                  <select
                    className="form-input"
                    value={newUser.role_id}
                    onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">Save User</button>
                </div>
              </form>
            </div>
          )}

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge badge-${(u.roles || 'employee').toLowerCase().split(',')[0].trim()}`}>
                        {u.roles}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: u.is_active ? '#059669' : '#dc2626', fontWeight: '600', fontSize: '0.85rem' }}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name, u.email)}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.6rem', color: '#ef4444' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS */}
      {activeTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>System Roles</h3>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Role ID</th>
                    <th>Role Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map(r => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>
                        <span className={`badge badge-${r.name.toLowerCase()}`}>{r.name}</span>
                      </td>
                      <td>{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>System Permissions</h3>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map(p => (
                    <tr key={p.id}>
                      <td><code>{p.name}</code></td>
                      <td>{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Event Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td>#{log.id}</td>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                    <td>{log.user_email ? `${log.user_name} (${log.user_email})` : 'System'}</td>
                    <td>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        color: log.action.includes('FAILED') || log.action.includes('UNAUTHORIZED') ? '#dc2626' : '#2563eb'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td>{log.details}</td>
                    <td><code>{log.ip_address}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
