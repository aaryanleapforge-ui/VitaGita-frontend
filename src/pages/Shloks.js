/**
 * Shloks Page
 * 
 * Manage shloks with CRUD operations
 */

import React, { useState, useEffect } from 'react';
import api from '../api';
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import './Shloks.css';

function Shloks() {
  const [shloks, setShoks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedShlok, setSelectedShlok] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchShloks();
  }, [page, search]);

  const fetchShloks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/shloks', {
        params: { page, limit: 20, search }
      });
      
      if (response.data.success) {
        setShoks(response.data.data.shloks);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError('Failed to fetch shloks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Delete this shlok?')) return;
    
    try {
      const response = await api.delete(`/shloks/${index}`);
      
      if (response.data.success) {
        alert('Shlok deleted successfully');
        fetchShloks();
      }
    } catch (err) {
      alert('Failed to delete shlok');
      console.error(err);
    }
  };

  const handleEdit = (shlok, index) => {
    setSelectedShlok({ ...shlok, index });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      const { index, ...shlokData } = selectedShlok;
      
      const response = await api.put(`/shloks/${index}`, shlokData);
      
      if (response.data.success) {
        alert('Shlok updated successfully');
        setIsEditing(false);
        setSelectedShlok(null);
        fetchShloks();
      }
    } catch (err) {
      alert('Failed to update shlok');
      console.error(err);
    }
  };

  return (
    <div className="shloks-page">
      <div className="page-header">
        <h1 className="page-title">Shloks Management</h1>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search shloks..."
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
                  <th>Chapter</th>
                  <th>Shlok #</th>
                  <th>Speaker</th>
                  <th>Theme</th>
                  <th>Summary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shloks.map((shlok, index) => (
                  <tr key={index}>
                    <td>{shlok.chapterName}</td>
                    <td>{shlok.shlok}</td>
                    <td>{shlok.speaker}</td>
                    <td>{shlok.theme}</td>
                    <td className="summary-cell">{shlok.summary?.substring(0, 100)}...</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(shlok, (page - 1) * 20 + index)}
                          title="Edit shlok"
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => handleDelete((page - 1) * 20 + index)}
                          title="Delete shlok"
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

      {/* Edit Modal */}
      {isEditing && selectedShlok && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Shlok</h2>
              <button
                className="modal-close"
                onClick={() => setIsEditing(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Chapter Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedShlok.chapterName}
                  onChange={(e) => setSelectedShlok({ ...selectedShlok, chapterName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Shlok Number</label>
                <input
                  type="number"
                  className="form-input"
                  value={selectedShlok.shlok}
                  onChange={(e) => setSelectedShlok({ ...selectedShlok, shlok: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Speaker</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedShlok.speaker}
                  onChange={(e) => setSelectedShlok({ ...selectedShlok, speaker: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Theme</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedShlok.theme}
                  onChange={(e) => setSelectedShlok({ ...selectedShlok, theme: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Summary</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  value={selectedShlok.summary}
                  onChange={(e) => setSelectedShlok({ ...selectedShlok, summary: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Video File</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedShlok.videoFile}
                  onChange={(e) => setSelectedShlok({ ...selectedShlok, videoFile: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shloks;
