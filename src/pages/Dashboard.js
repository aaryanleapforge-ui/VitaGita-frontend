/**
 * Dashboard Page
 * 
 * Shows overview statistics and charts
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiUsers, FiBook, FiBookmark, FiTrendingUp } from 'react-icons/fi';
import './Dashboard.css';

const COLORS = ['#0D1B3E', '#D4AF37', '#F4E6C3', '#8B7355', '#C4A77D'];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/analytics/stats');
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!stats) return null;

  const { overview, themes, chapters, recentUsers } = stats;

  // Prepare chart data
  const themesData = Object.entries(themes).map(([name, value]) => ({
    name,
    value
  })).slice(0, 10);

  const chaptersData = Object.entries(chapters).map(([name, value]) => ({
    name: name.replace('Chapter', 'Ch'),
    shloks: value
  }));

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e0f2fe' }}>
            <FiUsers size={24} color="#0369a1" />
          </div>
          <div className="stat-content">
            <h3>{overview.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <FiBook size={24} color="#92400e" />
          </div>
          <div className="stat-content">
            <h3>{overview.totalShloks}</h3>
            <p>Total Shloks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ddd6fe' }}>
            <FiBookmark size={24} color="#5b21b6" />
          </div>
          <div className="stat-content">
            <h3>{overview.totalBookmarks}</h3>
            <p>Total Bookmarks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <FiTrendingUp size={24} color="#065f46" />
          </div>
          <div className="stat-content">
            <h3>{overview.totalThemes}</h3>
            <p>Unique Themes</p>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card">
        <h3 className="card-title">Recent Users</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.name || 'N/A'}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
