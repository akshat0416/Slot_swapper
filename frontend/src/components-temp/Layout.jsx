// src/components/Layout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link to="/dashboard" className="nav-brand">
              <div className="logo">
                <i className="fa-solid fa-arrow-right-arrow-left"></i>
              </div>
              <span className="brand-name">SlotSwapper</span>
            </Link>
            <div className="nav-links">
              <span>Welcome, {user?.name}</span>
              <Link to="/dashboard" className="btn btn-outline">My Calendar</Link>
              <Link to="/marketplace" className="btn btn-outline">Marketplace</Link>
              <Link to="/requests" className="btn btn-outline">Swap Requests</Link>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </div>
          </nav>
        </div>
      </header>
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;