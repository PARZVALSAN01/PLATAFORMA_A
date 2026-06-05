import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UniformsService {
  private readonly API = '/api/uniforms';
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<any[]>(this.API);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  create(data: any) {
    return this.http.post<any>(this.API, data);
  }

  update(id: number, data: any) {
    return this.http.put<any>(`${this.API}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }

  bulkImport(uniforms: any[]) {
    return this.http.post<any>(`${this.API}/bulk`, uniforms);
  }

  getStats() {
    return this.http.get<any>(`${this.API}/stats`);
  }

  getSales() {
    return this.http.get<any[]>(`${this.API}/sales`);
  }

  createSale(data: any) {
    return this.http.post<any>(`${this.API}/sales`, data);
  }

  updateSaleEstado(id: number, estado: string) {
    return this.http.put<any>(`${this.API}/sales/${id}/estado`, { estado });
  }
}
