export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Student {
  id: number;
  firstName: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  matricula: string;
  level: string;
  grade: number;
  group: string;
  birthDate?: string;
  bloodType?: string;
  allergies?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  enrollmentDate?: string;
  // Dirección
  street?: string;
  colonia?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  // Colegiatura
  costoInscripcion?: number;
  costoColegiaturasMensual?: number;
  tipoBeca?: string;
  porcentajeBeca?: number;
  // Info padres
  nombrePadre?: string;
  telefonoPadre?: string;
  emailPadre?: string;
  ocupacionPadre?: string;
  nombreMadre?: string;
  telefonoMadre?: string;
  emailMadre?: string;
  ocupacionMadre?: string;
  isActive: boolean;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Teacher {
  id: number;
  user: User;
  employeeId: string;
  specialization?: string;
  education?: string;
  hireDate?: string;
}

export interface Parent {
  id: number;
  user: User;
  occupation?: string;
  workPhone?: string;
  address?: string;
  relationship?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  profile?: Student | Teacher | Parent;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
}
