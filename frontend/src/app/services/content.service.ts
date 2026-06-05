import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly API = '/api/content';
  private readonly http = inject(HttpClient);

  // Announcements
  getAnnouncements(params?: any) {
    let httpParams = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k]) httpParams = httpParams.set(k, params[k]); });
    return this.http.get<any>(`${this.API}/announcements`, { params: httpParams });
  }
  createAnnouncement(data: any) { return this.http.post<any>(`${this.API}/announcements`, data); }
  updateAnnouncement(id: number, data: any) { return this.http.put<any>(`${this.API}/announcements/${id}`, data); }
  deleteAnnouncement(id: number) { return this.http.delete(`${this.API}/announcements/${id}`); }

  // News
  getPublicNews() { return this.http.get<any>(`${this.API}/news/public`); }
  getNews() { return this.http.get<any>(`${this.API}/news`); }
  createNews(data: any) { return this.http.post<any>(`${this.API}/news`, data); }
  updateNews(id: number, data: any) { return this.http.put<any>(`${this.API}/news/${id}`, data); }
  deleteNews(id: number) { return this.http.delete(`${this.API}/news/${id}`); }

  // Gallery
  getGallery(params?: any) {
    let httpParams = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k]) httpParams = httpParams.set(k, params[k]); });
    return this.http.get<any>(`${this.API}/gallery/public`, { params: httpParams });
  }
  getPublicGallery(params?: any) { return this.getGallery(params); }
  createGalleryItem(data: any) { return this.http.post<any>(`${this.API}/gallery`, data); }
  updateGalleryItem(id: number, data: any) { return this.http.put<any>(`${this.API}/gallery/${id}`, data); }
  deleteGalleryItem(id: number) { return this.http.delete(`${this.API}/gallery/${id}`); }
  addToGallery(formData: FormData) { return this.http.post<any>(`${this.API}/gallery`, formData); }
  deleteFromGallery(id: number) { return this.http.delete(`${this.API}/gallery/${id}`); }

  // Contact
  createContactRequest(data: any) { return this.http.post<any>(`${this.API}/contact`, data); }
  sendContact(data: any) { return this.createContactRequest(data); }
  getContactRequests() { return this.http.get<any>(`${this.API}/contacts`); }
  getContacts() { return this.getContactRequests(); }
  updateContact(id: number, data: any) { return this.http.put<any>(`${this.API}/contacts/${id}`, data); }

  // Calendar
  getCalendar(params?: any) {
    let httpParams = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k]) httpParams = httpParams.set(k, params[k]); });
    return this.http.get<any>(`${this.API}/calendar/public`, { params: httpParams });
  }
  getPublicCalendar(params?: any) { return this.getCalendar(params); }
  createCalendarEvent(data: any) { return this.http.post<any>(`${this.API}/calendar`, data); }
  updateCalendarEvent(id: number, data: any) { return this.http.put<any>(`${this.API}/calendar/${id}`, data); }
  deleteCalendarEvent(id: number) { return this.http.delete(`${this.API}/calendar/${id}`); }
  createEvent(data: any) { return this.createCalendarEvent(data); }
  updateEvent(id: number, data: any) { return this.updateCalendarEvent(id, data); }
  deleteEvent(id: number) { return this.deleteCalendarEvent(id); }

  // Messages
  getMessages() { return this.http.get<any>(`${this.API}/messages`); }
  sendMessage(data: any) { return this.http.post<any>(`${this.API}/messages`, data); }
  markAsRead(id: number) { return this.http.put<any>(`${this.API}/messages/${id}/read`, {}); }
}
