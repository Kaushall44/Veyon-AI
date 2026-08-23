export type Role = 
  | 'Student' 
  | 'Faculty' 
  | 'Lab_In_Charge' 
  | 'Maintenance_Staff' 
  | 'Admin' 
  | 'Super_Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department: string;
  registrationNo?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string) => Promise<boolean>;
  loginAsDemoUser: (roleOrEmail: Role | string) => void;
  logout: () => void;
  isAuthorized: (allowedRoles: Role[]) => boolean;
  authWarning: string | null;
  clearAuthWarning: () => void;
}
