/**
 * Layout Component
 * 
 * Main layout with sidebar navigation
 */

import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiUsers, 
  FiBook, 
  FiVideo, 
  FiBarChart2, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import './Layout.css';

function Layout() {
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/users', icon: <FiUsers />, label: 'Users' },
    { path: '/videos', icon: <FiVideo />, label: 'Videos' },
    { path: '/analytics', icon: <FiBarChart2 />, label: 'Analytics' }
  ];

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">Gita Admin</h1>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
              end={item.path === '/'}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            {sidebarOpen && (
              <>
                <div className="admin-name">{admin?.name}</div>
                <div className="admin-email">{admin?.email}</div>
              </>
            )}
          </div>
          <button className="logout-btn" onClick={logout}>
            <FiLogOut />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
