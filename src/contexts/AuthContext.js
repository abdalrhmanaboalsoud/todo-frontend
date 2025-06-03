import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
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
  const toastShownRef = useRef(false);

  // Verify token and get user data on initial load
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Set the token in axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // Verify token and get user data
        const response = await axios.get('https://todo-server-9nwr.onrender.com/auth/me');
        setUser(response.data);
        setToken(storedToken);
      } catch (error) {
        // If token is invalid, clear everything
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Update axios headers when token changes
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('https://todo-server-9nwr.onrender.com/register', userData);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post('https://todo-server-9nwr.onrender.com/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      setLoading(false);
      toastShownRef.current = false;
      toast.success('Logged out successfully');
    }
  };

  const googleLogin = () => {
    window.location.href = 'https://todo-server-9nwr.onrender.com/auth/google';
  };

  const handleGoogleCallback = useCallback(async (token) => {
    try {
      setLoading(true);
      // Set the token first
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data using the token
      const response = await axios.get('https://todo-server-9nwr.onrender.com/auth/me');
      if (!response.data) {
        throw new Error('No user data received');
      }
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Google callback error:', error);
      // Clear everything on error
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      toast.error('Google login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    googleLogin,
    handleGoogleCallback,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 