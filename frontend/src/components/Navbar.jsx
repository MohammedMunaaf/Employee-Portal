import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('portal_token');
      localStorage.removeItem('portal_user');
      setUser(null);
      navigate('/login');
    }
  };

  if (!user) return null;

  const isAdmin = user.roles && user.roles.includes('Admin');
  const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'Employee';
  const roleClass = `badge badge-${primaryRole.toLowerCase()}`;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span>⚡ Custom Employee Portal</span>
      </div>

      <div className="nav-links">
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        
        {isAdmin && (
          <Link 
            to="/admin" 
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            Admin Panel
          </Link>
        )}
      </div>

      <div className="nav-user">
        <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{user.name}</span>
        <span className={roleClass}>{primaryRole}</span>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
