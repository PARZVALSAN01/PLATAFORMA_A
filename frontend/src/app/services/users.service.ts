import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DashboardStats, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly API = '/api/users';
  private readonly http = inject(HttpClient);

  getAll(params?: any) {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<any>(this.API, { params: httpParams });
  }

  getById(id: number) {
    return this.http.get<User>(`${this.API}/${id}`);
  }

  create(data: any) {
    return this.http.post<User>(this.API, data);
  }

  update(id: number, data: any) {
    return this.http.put<User>(`${this.API}/${id}`, data);
  }

  remove(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }

  getStats() {
    return this.http.get<DashboardStats>(`${this.API}/stats`);
  }
}
