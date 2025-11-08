"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AUTH_API_URL = 'http://localhost:8001/auth';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        } else {
          setToken(storedToken);
          // --- SET THE REAL USER OBJECT (with fullName) ---
          setUser({ email: decoded.email, id: decoded.userId, fullName: decoded.fullName });
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (e) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${AUTH_API_URL}/login`, { email, password });
      const { token } = res.data;
      
      const decoded = jwtDecode(token);
      setToken(token);
      // --- SET THE REAL USER OBJECT (with fullName) ---
      setUser({ email: decoded.email, id: decoded.userId, fullName: decoded.fullName });
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setError(null);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // --- UPDATE register FUNCTION ---
  const register = async (email, password, fullName) => {
    try {
      // Pass fullName in the request body
      await axios.post(`${AUTH_API_URL}/register`, { email, password, fullName });
      setError(null);
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);