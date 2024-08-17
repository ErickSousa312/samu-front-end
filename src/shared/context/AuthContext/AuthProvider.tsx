import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/api';

interface AuthContextType {
  user: { role: string, email: string, username: string, id: string } | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ role: string, email: string, username: string, id: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(storedUser)); // Restaura os dados do usuário
    }
  }, []);

  const login = async (token: string, email: string) => {
    localStorage.setItem('token', token);

    try {
      const response = await api.get(`/users/email/${email}`);
      const userData = response.data;
      setUser(userData);
    
      // Salva os dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error("Erro ao buscar dados do usuário:", error);
      if (error.response && error.response.status === 500) {
        alert("Erro no servidor. Por favor, tente novamente mais tarde.");
      } else {
        alert("Erro ao buscar os dados do usuário.");
      }
    }
    
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
