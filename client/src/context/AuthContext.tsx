import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  switchDemoRole: (role: Role) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('siakad_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      if (!localStorage.getItem('siakad_token')) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const data = await api.get<User>('/auth/me');
      setUser(data);
    } catch (err) {
      console.error('Failed to load user:', err);
      localStorage.removeItem('siakad_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (identifier: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.post<{ token: string; user: User }>('/auth/login', {
        identifier,
        password,
      });

      localStorage.setItem('siakad_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('siakad_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  const switchDemoRole = async (role: Role): Promise<User> => {
    let identifier = '';
    let password = '';

    if (role === 'ADMIN') {
      identifier = 'admin@example.com';
      password = 'admin123';
    } else if (role === 'GURU') {
      identifier = 'guru@example.com';
      password = 'guru123';
    } else if (role === 'SISWA') {
      identifier = 'siswa@example.com';
      password = 'siswa123';
    }

    return await login(identifier, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        refreshUser,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
