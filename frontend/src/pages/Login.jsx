import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('portal_token', token);
      localStorage.setItem('portal_user', JSON.stringify(user));
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Employee Portal</h1>
        <p className="login-subtitle">Zoho One Role-Based Access Control System</p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., hr@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="demo-credentials-box">
          <div className="demo-credentials-title">Quick Demo Login Presets</div>
          <div className="demo-buttons">
            <button type="button" className="btn-demo" onClick={() => fillDemo('admin@example.com')}>
              Admin
            </button>
            <button type="button" className="btn-demo" onClick={() => fillDemo('hr@example.com')}>
              HR
            </button>
            <button type="button" className="btn-demo" onClick={() => fillDemo('sales@example.com')}>
              Sales
            </button>
            <button type="button" className="btn-demo" onClick={() => fillDemo('support@example.com')}>
              Support
            </button>
            <button type="button" className="btn-demo" onClick={() => fillDemo('finance@example.com')}>
              Finance
            </button>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
            Password for all demo accounts: <strong>Password123!</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
