import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set the base URL for API
  axios.defaults.baseURL = 'https://minisocial-nycd.onrender.com/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get('/auth/user');
      setUser(res.data);
    } catch (err) {
      console.error(err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    const res = await axios.post('/auth/register', { username, email, password });
    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);
    setUser(res.data.user);
  };

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);
    setUser(res.data.user);
  };



  // Inside your component...
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token'); // Clears the saved session
    setAuthToken(null);               // Clears the header state
    setUser(null);                    // Clears user data

    // Add this line to fix the 404/Redirect issue:
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
