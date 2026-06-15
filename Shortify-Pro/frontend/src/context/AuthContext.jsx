import { createContext, useContext, useEffect, useState } from 'react';
import api, { TOKEN_KEY } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  const saveAuth = (payload) => {
    if (!payload.token || !payload.user) {
      console.error('[AUTH] Invalid auth payload received:', payload);
      return;
    }
    localStorage.setItem(TOKEN_KEY, payload.token);
    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    disconnectSocket();
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        saveAuth(res.data);
        await fetchProfile();
      }
    } catch (error) {
      console.error('[AUTH] Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data?.success) {
        saveAuth(res.data);
        await fetchProfile();
      }
    } catch (error) {
      console.error('[AUTH] Registration failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/profile');
      if (res.data?.success) {
        setUser(res.data.data);
      }
    } catch (_error) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      connectSocket(token);
    }
  }, [token, user]);

  useEffect(() => {
    fetchProfile();
  }, []);


  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
