/**
 * Videos Page
 * 
 * Manage video links
 */

import React, { useState, useEffect } from 'react';
import api from '../api';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import './Videos.css';

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({ key: '', url: '' });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/videos');
      
      if (response.data.success) {
        setVideos(response.data.data.videos);
      }
    } catch (err) {
      setError('Failed to fetch videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/api/videos', formData);
      
      if (response.data.success) {
        alert('Video link added successfully');
        setIsAdding(false);
        setFormData({ key: '', url: '' });
        fetchVideos();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add video');
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.put(`/api/videos/${editingVideo.key}`, {
        url: formData.url
      });
      
      if (response.data.success) {
        alert('Video link updated successfully');
        setEditingVideo(null);
        setFormData({ key: '', url: '' });
        fetchVideos();
      }
    } catch (err) {
      alert('Failed to update video');
      console.error(err);
    }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Delete video link for ${key}?`)) return;
    
    try {
      const response = await api.delete(`/api/videos/${key}`);
      
      if (response.data.success) {
        alert('Video link deleted successfully');
        fetchVideos();
      }
    } catch (err) {
      alert('Failed to delete video');
      console.error(err);
    }
  };

  const startEdit = (video) => {
    setEditingVideo(video);
    setFormData({ key: video.key, url: video.url });
  };

  return (
    <div className="videos-page">
      <div className="page-header">
        <h1 className="page-title">Video Links Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAdding(true)}
        >
          <FiPlus /> Add Video Link
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Video Key</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.key}>
                  <td>{video.key}</td>
                  <td className="url-cell">{video.url}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => startEdit(video)}
                        title="Edit link"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(video.key)}
                        title="Delete link"
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
      )}

      {/* Add Modal */}
      {isAdding && (
        <div className="modal-overlay" onClick={() => setIsAdding(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Video Link</h2>
              <button
                className="modal-close"
                onClick={() => setIsAdding(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Video Key</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="e.g., Chapter1_1.mp4"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Video URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingVideo && (
        <div className="modal-overlay" onClick={() => setEditingVideo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Video Link</h2>
              <button
                className="modal-close"
                onClick={() => setEditingVideo(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Video Key</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.key}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Video URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingVideo(null)}>
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

export default Videos;
