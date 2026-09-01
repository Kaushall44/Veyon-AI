import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, AuthContextType } from '../types/auth';
import { authService, RegisterPayload } from '../services/api/authService';
import { MOCK_USERS } from '../data/mockUsers';

const AUTH_STORAGE_KEY_USER = 'soa_nexus_user';
const AUTH_STORAGE_KEY_TOKEN = 'soa_nexus_auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authWarning, setAuthWarning] = useState<string | null>(null);

  // Initialize session from storage or seed defaults
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY_USER);
      const storedToken = localStorage.getItem(AUTH_STORAGE_KEY_TOKEN);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        const defaultStudent = MOCK_USERS['student@soa.ac.in'];
        setUser(defaultStudent);
        setToken(`jwt_session_${defaultStudent.id}`);
        localStorage.setItem(AUTH_STORAGE_KEY_USER, JSON.stringify(defaultStudent));
        localStorage.setItem(AUTH_STORAGE_KEY_TOKEN, `jwt_session_${defaultStudent.id}`);
      }
    } catch (e) {
      console.error('Failed to parse auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authRes = await authService.login(email, password);
      setUser(authRes.user);
      setToken(authRes.access_token);
      localStorage.setItem(AUTH_STORAGE_KEY_USER, JSON.stringify(authRes.user));
      localStorage.setItem(AUTH_STORAGE_KEY_TOKEN, authRes.access_token);
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      return false;
    }
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    setIsLoading(true);
    try {
      const authRes = await authService.register(payload);
      setUser(authRes.user);
      setToken(authRes.access_token);
      localStorage.setItem(AUTH_STORAGE_KEY_USER, JSON.stringify(authRes.user));
      localStorage.setItem(AUTH_STORAGE_KEY_TOKEN, authRes.access_token);
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      return false;
    }
  };

  const loginAsDemoUser = async (roleOrEmail: Role | string) => {
    setIsLoading(true);
    try {
      const authRes = await authService.loginAsDemoUser(roleOrEmail);
      setUser(authRes.user);
      setToken(authRes.access_token);
      localStorage.setItem(AUTH_STORAGE_KEY_USER, JSON.stringify(authRes.user));
      localStorage.setItem(AUTH_STORAGE_KEY_TOKEN, authRes.access_token);
      setAuthWarning(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY_USER);
    localStorage.removeItem(AUTH_STORAGE_KEY_TOKEN);
  };

  const isAuthorized = (allowedRoles: Role[]): boolean => {
    if (!user) return false;
    if (allowedRoles.includes(user.role)) return true;
    if (user.role === 'Admin' || user.role === 'Super_Admin') return true;
    return false;
  };

  const clearAuthWarning = () => {
    setAuthWarning(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        loginAsDemoUser,
        logout,
        isAuthorized,
        authWarning,
        clearAuthWarning,
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
