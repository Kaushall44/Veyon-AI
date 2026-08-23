import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, AuthState, AuthContextType } from '../types/auth';
import { MOCK_USERS } from '../data/mockUsers';

const AUTH_STORAGE_KEY_USER = 'soa_nexus_user';
const AUTH_STORAGE_KEY_TOKEN = 'soa_nexus_auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authWarning, setAuthWarning] = useState<string | null>(null);

  // Initialize session from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY_USER);
      const storedToken = localStorage.getItem(AUTH_STORAGE_KEY_TOKEN);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        // Default seed user: Student
        const defaultStudent = MOCK_USERS['student@soa.ac.in'];
        setUser(defaultStudent);
        setToken(`demo_jwt_token_${defaultStudent.id}`);
        localStorage.setItem(AUTH_STORAGE_KEY_USER, JSON.stringify(defaultStudent));
        localStorage.setItem(AUTH_STORAGE_KEY_TOKEN, `demo_jwt_token_${defaultStudent.id}`);
      }
    } catch (e) {
      console.error('Failed to parse auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    const matchedUser = MOCK_USERS[email] || Object.values(MOCK_USERS).find((u) => u.email === email);
    
    if (matchedUser) {
      const mockToken = `jwt_token_${matchedUser.id}_${Date.now()}`;
      setUser(matchedUser);
      setToken(mockToken);
      localStorage.setItem(AUTH_STORAGE_KEY_USER, JSON.stringify(matchedUser));
      localStorage.setItem(AUTH_STORAGE_KEY_TOKEN, mockToken);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const loginAsDemoUser = (roleOrEmail: Role | string) => {
    let targetUser: User | undefined;
    
    // Check if role or email passed
    if (MOCK_USERS[roleOrEmail]) {
      targetUser = MOCK_USERS[roleOrEmail];
    } else {
      targetUser = Object.values(MOCK_USERS).find(
        (u) => u.role === roleOrEmail || u.email.toLowerCase() === roleOrEmail.toLowerCase()
      );
    }

    if (!targetUser) {
      targetUser = MOCK_USERS['student@soa.ac.in'];
    }

    const mockToken = `demo_jwt_token_${targetUser.id}_${Date.now()}`;
    setUser(targetUser);
    setToken(mockToken);
    localStorage.setItem(AUTH_STORAGE_KEY_USER, JSON.stringify(targetUser));
    localStorage.setItem(AUTH_STORAGE_KEY_TOKEN, mockToken);
    setAuthWarning(null);
  };

  const logout = () => {
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
