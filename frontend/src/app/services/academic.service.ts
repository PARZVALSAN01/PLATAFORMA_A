import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AcademicService {
  private readonly API = '/api/academic';
  private readonly http = inject(HttpClient);

  getClasses() {
    return this.http.get<any>(`${this.API}/classes`);
  }

  getAssignments(params?: any) {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<any>(`${this.API}/assignments`, { params: httpParams });
  }

  getStudentAssignments() {
    return this.http.get<any>(`${this.API}/assignments/student`);
  }

  createAssignment(data: any) {
    return this.http.post<any>(`${this.API}/assignments`, data);
  }

  updateAssignment(id: number, data: any) {
    return this.http.put<any>(`${this.API}/assignments/${id}`, data);
  }

  deleteAssignment(id: number) {
    return this.http.delete(`${this.API}/assignments/${id}`);
  }

  getGrades(params?: any) {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<any>(`${this.API}/grades`, { params: httpParams });
  }

  createGrade(data: any) {
    return this.http.post<any>(`${this.API}/grades`, data);
  }

  updateGrade(id: number, data: any) {
    return this.http.put<any>(`${this.API}/grades/${id}`, data);
  }
}
