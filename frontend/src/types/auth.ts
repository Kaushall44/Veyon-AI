export type Role = 
  | 'Student' 
  | 'Faculty' 
  | 'Lab_In_Charge' 
  | 'Estates_Staff'
  | 'Maintenance_Staff' 
  | 'Grievance_Officer'
  | 'Admin' 
  | 'Super_Admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  role: Role;
  department: string;
  registrationNo?: string;
  reg_number?: string;
  semester?: number;
  cgpa?: number;
  attendance_pct?: number;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<boolean>;
  register: (payload: {
    reg_number: string;
    email: string;
    password: string;
    full_name: string;
    role: string;
    department: string;
  }) => Promise<boolean>;
  loginAsDemoUser: (roleOrEmail: Role | string) => void;
  logout: () => void;
  isAuthorized: (allowedRoles: Role[]) => boolean;
  authWarning: string | null;
  clearAuthWarning: () => void;
}
