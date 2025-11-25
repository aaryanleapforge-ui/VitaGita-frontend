/**
 * Authentication Context
 * 
 * Manages admin authentication state globally
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      // Set default axios header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token
      api.get('/auth/me')
        .then(response => {
          if (response.data.success) {
            setAdmin(response.data.data);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { admin, token } = response.data.data;
        
        // Store token
        localStorage.setItem('adminToken', token);
        
        // Set axios default header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setAdmin(admin);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete api.defaults.headers.common['Authorization'];
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
