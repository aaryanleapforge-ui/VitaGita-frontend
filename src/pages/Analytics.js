/**
 * Analytics Page
 * 
 * Detailed analytics with charts
 */

import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

function Analytics() {
  const [popularShloks, setPopularShloks] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [bookmarksByTheme, setBookmarksByTheme] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const [popular, growth, themes] = await Promise.all([
        api.get('/api/analytics/popular-shloks'),
        api.get('/api/analytics/user-growth'),
        api.get('/api/analytics/bookmarks-by-theme')
      ]);

      if (popular.data.success) {
        setPopularShloks(popular.data.data);
      }

      if (growth.data.success) {
        setUserGrowth(growth.data.data);
      }

      if (themes.data.success) {
        setBookmarksByTheme(themes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
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

  return (
    <div className="analytics-page">
      <h1 className="page-title">Analytics & Insights</h1>

      {/* User Growth Chart */}
      {userGrowth.length > 0 && (
        <div className="card chart-card mb-20">
          <h3 className="chart-title">User Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalUsers" stroke="#0D1B3E" name="Total Users" />
              <Line type="monotone" dataKey="newUsers" stroke="#D4AF37" name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bookmarks by Theme */}
      {bookmarksByTheme.length > 0 && (
        <div className="card chart-card mb-20">
          <h3 className="chart-title">Bookmarks by Theme</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookmarksByTheme}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="theme" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#D4AF37" name="Bookmarks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Popular Shloks Table */}
      <div className="card">
        <h3 className="card-title">Most Bookmarked Shloks</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Chapter</th>
                <th>Shlok #</th>
                <th>Theme</th>
                <th>Summary</th>
                <th>Bookmarks</th>
              </tr>
            </thead>
            <tbody>
              {popularShloks.map((shlok, index) => (
                <tr key={shlok.key}>
                  <td>{index + 1}</td>
                  <td>{shlok.chapterName}</td>
                  <td>{shlok.shlokNum}</td>
                  <td>{shlok.theme}</td>
                  <td className="summary-cell">{shlok.summary?.substring(0, 80)}...</td>
                  <td>
                    <span className="badge badge-success">
                      {shlok.bookmarkCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
