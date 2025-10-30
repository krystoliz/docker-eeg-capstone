import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// URL for our Express auth backend
const AUTH_API_URL = 'http://localhost:8001/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // <-- NEW LOADING STATE
  const router = useRouter();

  useEffect(() => {
    // Check local storage for a token on app load
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setUser({ loggedIn: true }); 
    }
    setLoading(false); // <-- SET LOADING TO FALSE (WE ARE DONE CHECKING)
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${AUTH_API_URL}/login`, { email, password });
      const { token } = res.data;

      setToken(token);
      setUser({ loggedIn: true });
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setError(null);
      router.push('/'); // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (email, password) => {
    try {
      await axios.post(`${AUTH_API_URL}/register`, { email, password });
      setError(null);
      router.push('/login'); // Redirect to login page after successful register
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