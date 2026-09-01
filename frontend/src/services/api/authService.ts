import { apiClient } from './apiClient';
import { User, Role } from '../../types/auth';
import { MOCK_USERS } from '../../data/mockUsers';
import { supabase } from '../../lib/supabaseClient';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  user: User;
}

export interface RegisterPayload {
  reg_number: string;
  email: string;
  password: string;
  full_name: string;
  role: string;
  department: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    // 1. Try registering via Supabase Auth
    try {
      if (supabase && supabase.auth) {
        await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: {
            data: {
              full_name: payload.full_name,
              reg_number: payload.reg_number,
              role: payload.role,
              department: payload.department
            }
          }
        });
      }
    } catch (e) {
      console.warn('Supabase Auth sign-up notice:', e);
    }

    // 2. Register with backend
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', payload);
      return response.data;
    } catch (err) {
      // Create registered user object in memory for local fallback
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: payload.full_name,
        full_name: payload.full_name,
        email: payload.email,
        role: payload.role as Role,
        department: payload.department,
        registrationNo: payload.reg_number,
        reg_number: payload.reg_number,
      };
      return {
        access_token: `supabase_token_${newUser.id}_${Date.now()}`,
        token_type: 'bearer',
        user: newUser
      };
    }
  },

  async login(email: string, password?: string): Promise<AuthResponse> {
    // 1. Attempt Supabase Auth login if password provided
    if (password && supabase && supabase.auth) {
      try {
        const { data: supaData, error: supaErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (supaData && supaData.session) {
          localStorage.setItem('supabase_access_token', supaData.session.access_token);
        }
      } catch (e) {
        console.warn('Supabase auth login check:', e);
      }
    }

    // 2. Call backend login
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      // Fallback for offline prototype testing & demo accounts
      const matchedUser = MOCK_USERS[email] || Object.values(MOCK_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (matchedUser) {
        return {
          access_token: `mock_jwt_${matchedUser.id}_${Date.now()}`,
          token_type: 'bearer',
          user: matchedUser,
        };
      }
      throw err;
    }
  },

  async loginAsDemoUser(roleOrEmail: Role | string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', { email: roleOrEmail });
      return response.data;
    } catch (err) {
      let targetUser = MOCK_USERS[roleOrEmail] || Object.values(MOCK_USERS).find(
        (u) => u.role === roleOrEmail || u.email.toLowerCase() === roleOrEmail.toLowerCase()
      );
      if (!targetUser) {
        targetUser = MOCK_USERS['student@soa.ac.in'];
      }
      return {
        access_token: `mock_jwt_${targetUser.id}_${Date.now()}`,
        token_type: 'bearer',
        user: targetUser,
      };
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (err) {
      return MOCK_USERS['student@soa.ac.in'];
    }
  },

  async logout(): Promise<void> {
    try {
      if (supabase && supabase.auth) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('supabase_access_token');
    } catch (err) {
      console.log('Supabase sign-out notice.');
    }
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.log('Logged out locally.');
    }
  },
};
