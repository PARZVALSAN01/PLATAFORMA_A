import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Student } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private readonly API = '/api/students';
  private readonly http = inject(HttpClient);

  getAll(params?: { search?: string; level?: string; page?: number; limit?: number }) {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const val = (params as any)[key];
        if (val !== undefined && val !== '') {
          httpParams = httpParams.set(key, val);
        }
      });
    }
    return this.http.get<any>(this.API, { params: httpParams });
  }

  getById(id: number) {
    return this.http.get<Student>(`${this.API}/${id}`);
  }

  getByMatricula(matricula: string) {
    return this.http.get<Student>(`${this.API}/matricula/${matricula}`);
  }

  create(data: any) {
    return this.http.post<Student>(this.API, data);
  }

  update(id: number, data: any) {
    return this.http.put<Student>(`${this.API}/${id}`, data);
  }

  deactivate(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }

  uploadPhoto(id: number, file: File) {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<Student>(`${this.API}/${id}/photo`, formData);
  }

  bulkImport(students: any[]) {
    return this.http.post<any>(`${this.API}/bulk`, students);
  }

  getCobranzaStats() {
    return this.http.get<any>(`${this.API}/stats/cobranza`);
  }
}
