import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, requiredRole, children }) {
  const token = localStorage.getItem('portal_token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const userRoles = user.roles || [];
    if (!userRoles.includes(requiredRole)) {
      return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2>Access Denied</h2>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
            You do not have administrative privileges to access this page.
          </p>
        </div>
      );
    }
  }

  return children;
}
