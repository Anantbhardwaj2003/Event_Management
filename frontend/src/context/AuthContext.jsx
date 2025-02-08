import { createContext, useContext, useState } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData, onSuccess, onError) => {
    api.login(userData).then((data) => {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      onSuccess(data);
    }).catch((error) => {
      console.error('Login error:', error);
      onError(error);
    });
  };

  const register = (userData, onSuccess, onError) => {
    api.register(userData).then((data) => {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      onSuccess(data);
    }).catch((error) => {
      console.error('Register error:', error);
      onError(error);
    });
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const guestLogin = () => {
    setUser({ id: 'guest', name: 'Guest User', isGuest: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, guestLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);