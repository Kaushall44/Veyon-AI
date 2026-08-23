import { User } from '../types/auth';

export const MOCK_USERS: Record<string, User> = {
  'student@soa.ac.in': {
    id: 'STU-2023-042',
    email: 'student@soa.ac.in',
    name: 'Kaushal Raj Gupta',
    role: 'Student',
    department: 'Computer Science & Engineering',
    registrationNo: '2023-CSE-042',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  'faculty@soa.ac.in': {
    id: 'FAC-CSE-018',
    email: 'faculty@soa.ac.in',
    name: 'Dr. Sunita Panigrahi',
    role: 'Faculty',
    department: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  'labincharge@soa.ac.in': {
    id: 'FAC-CSE-012',
    email: 'labincharge@soa.ac.in',
    name: 'Prof. A. K. Samanta',
    role: 'Lab_In_Charge',
    department: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
  'maintenance@soa.ac.in': {
    id: 'EST-TECH-088',
    email: 'maintenance@soa.ac.in',
    name: 'Rajesh Kumar',
    role: 'Maintenance_Staff',
    department: 'Campus Estates & Facilities',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
  'admin@soa.ac.in': {
    id: 'ADM-OFF-001',
    email: 'admin@soa.ac.in',
    name: 'Admin Officer Patnaik',
    role: 'Admin',
    department: 'Academic Administration',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
};

export const DEMO_ROLES_MAP: Array<{ role: User['role']; label: string; email: string; description: string; color: string }> = [
  {
    role: 'Student',
    label: 'Student (Kaushal Raj Gupta)',
    email: 'student@soa.ac.in',
    description: 'Request lab bookings, certificates, report repairs, & grievances',
    color: 'indigo',
  },
  {
    role: 'Faculty',
    label: 'Faculty (Dr. Sunita Panigrahi)',
    email: 'faculty@soa.ac.in',
    description: 'Review academic requests & approve student lab reservations',
    color: 'emerald',
  },
  {
    role: 'Lab_In_Charge',
    label: 'Lab In-Charge (Prof. Samanta)',
    email: 'labincharge@soa.ac.in',
    description: 'Manage lab slot availability & issue door entry passes',
    color: 'purple',
  },
  {
    role: 'Maintenance_Staff',
    label: 'Maintenance Staff (Rajesh Kumar)',
    email: 'maintenance@soa.ac.in',
    description: 'Receive repair complaints & update technician status',
    color: 'amber',
  },
  {
    role: 'Admin',
    label: 'System Admin (Officer Patnaik)',
    email: 'admin@soa.ac.in',
    description: 'Inspect full JSON audit trails & upload knowledge base PDFs',
    color: 'red',
  },
];
