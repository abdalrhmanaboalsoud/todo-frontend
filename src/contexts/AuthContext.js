import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('https://todo-server-9nwr.onrender.com/login', {
        username,
        password
      });
      
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('https://todo-server-9nwr.onrender.com/register', userData);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('https://todo-server-9nwr.onrender.com/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const googleLogin = () => {
    window.location.href = 'https://todo-server-9nwr.onrender.com/auth/google';
  };

  const handleGoogleCallback = async (token) => {
    try {
      setToken(token);
      // Fetch user data using the token
      const response = await axios.get('https://todo-server-9nwr.onrender.com/auth/me');
      setUser(response.data);
      toast.success('Google login successful!');
      return true;
    } catch (error) {
      toast.error('Google login failed');
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    googleLogin,
    handleGoogleCallback,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 