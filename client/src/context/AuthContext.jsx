import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('hms_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('hms_user'); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('hms_token', data.token);
    localStorage.setItem('hms_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (fullName, email, password, role) => {
    const res = await api.post('/auth/register', { fullName, email, password, role });
    const data = res.data;
    localStorage.setItem('hms_token', data.token);
    localStorage.setItem('hms_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
