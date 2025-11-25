/**
 * Users Page
 * 
 * Manage app users with search and filtering
 */

import React, { useState, useEffect } from 'react';
import api from '../api';
import { FiSearch, FiTrash2, FiEye } from 'react-icons/fi';
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users', {
        params: { page, limit: 20, search }
      });
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    
    try {
      const response = await api.delete(`/api/users/${email}`);
      
      if (response.data.success) {
        alert('User deleted successfully');
        fetchUsers();
      }
    } catch (err) {
      alert('Failed to delete user');
      console.error(err);
    }
  };

  const viewUserDetails = async (email) => {
    try {
      const response = await api.get(`/api/users/${email}`);
      
      if (response.data.success) {
        setSelectedUser(response.data.data);
      }
    } catch (err) {
      alert('Failed to fetch user details');
      console.error(err);
    }
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">Users Management</h1>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Bookmarks</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.bookmarks?.length || 0}</td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => viewUserDetails(user.email)}
                          title="View details"
                        >
                          <FiEye />
                        </button>
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => handleDelete(user.email)}
                          title="Delete user"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {page} of {pagination.pages}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">User Details</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
            <div className="user-details">
              <div className="detail-row">
                <strong>Name:</strong> {selectedUser.name || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div className="detail-row">
                <strong>Phone:</strong> {selectedUser.phone || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Date of Birth:</strong> {selectedUser.dob || 'N/A'}
              </div>
              <div className="detail-row">
                <strong>Bookmarks:</strong> {selectedUser.bookmarks?.length || 0}
              </div>
              <div className="detail-row">
                <strong>Joined:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
