import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasRole, login, logout } from '../../../utils/AuthHelpers';
import AuthContext from './AuthContext';

interface User {
  id: string;
  role: 'admin' | 'driver' | 'user';
  name: string;
  email: string;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedUser: User = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedUser);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login: (userData: User, token: string) => login(userData, token, setUser, setToken),
        logout: () => logout(setUser, setToken, navigate),
        hasRole: (roles: string[]) => hasRole(roles, user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
