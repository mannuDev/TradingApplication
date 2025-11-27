import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI, register as registerAPI } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginAPI({ email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      // Update last login
      if (response.data._id) {
        try {
          await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/update-last-login`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${response.data.token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (err) {
          console.error('Failed to update last login:', err);
        }
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await registerAPI({ name, email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

