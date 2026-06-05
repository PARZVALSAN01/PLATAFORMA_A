export interface Subject {
  id: number;
  name: string;
  code: string;
  level?: string;
  grade?: number;
  description?: string;
}

export interface ClassGroup {
  id: number;
  name: string;
  level: string;
  grade: number;
  group: string;
  schoolYear: string;
}

export interface Assignment {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  maxScore: number;
  createdAt?: string;
}

export interface Grade {
  id: number;
  score: number;
  period: string;
  comments?: string;
  schoolYear: string;
  createdAt?: string;
}
