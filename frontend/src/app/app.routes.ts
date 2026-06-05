import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public
  { path: '', loadComponent: () => import('./pages/public/home/home').then(m => m.HomeComponent) },
  { path: 'nosotros', loadComponent: () => import('./pages/public/about/about').then(m => m.AboutComponent) },
  { path: 'oferta-educativa', loadComponent: () => import('./pages/public/oferta/oferta').then(m => m.OfertaComponent) },
  { path: 'oferta-educativa/:nivel', loadComponent: () => import('./pages/public/oferta/oferta').then(m => m.OfertaComponent) },
  { path: 'instalaciones', loadComponent: () => import('./pages/public/instalaciones/instalaciones').then(m => m.InstalacionesComponent) },
  { path: 'galeria', loadComponent: () => import('./pages/public/galeria/galeria').then(m => m.GaleriaComponent) },
  { path: 'comunidad', loadComponent: () => import('./pages/public/comunidad/comunidad').then(m => m.ComunidadComponent) },
  { path: 'contacto', loadComponent: () => import('./pages/public/contacto/contacto').then(m => m.ContactoComponent) },

  // Auth
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent) },

  // Admin
  { path: 'admin', canActivate: [authGuard, roleGuard('admin')], children: [
    { path: '', loadComponent: () => import('./pages/admin/dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) },
    { path: 'alumnos', loadComponent: () => import('./pages/admin/alumnos/admin-alumnos').then(m => m.AdminAlumnosComponent) },
    { path: 'cobranza', loadComponent: () => import('./pages/admin/cobranza/admin-cobranza').then(m => m.AdminCobranzaComponent) },
    { path: 'uniformes', loadComponent: () => import('./pages/admin/uniformes/admin-uniformes').then(m => m.AdminUniformesComponent) },
    { path: 'usuarios', loadComponent: () => import('./pages/admin/users/admin-users').then(m => m.AdminUsersComponent) },
    { path: 'avisos', loadComponent: () => import('./pages/admin/content/admin-content').then(m => m.AdminContentComponent), data: { contentType: 'announcements' } },
    { path: 'noticias', loadComponent: () => import('./pages/admin/content/admin-content').then(m => m.AdminContentComponent), data: { contentType: 'news' } },
    { path: 'galeria', loadComponent: () => import('./pages/admin/content/admin-content').then(m => m.AdminContentComponent), data: { contentType: 'gallery' } },
    { path: 'calendario', loadComponent: () => import('./pages/admin/content/admin-content').then(m => m.AdminContentComponent), data: { contentType: 'calendar' } },
    { path: 'solicitudes', loadComponent: () => import('./pages/admin/content/admin-content').then(m => m.AdminContentComponent), data: { contentType: 'contacts' } },
  ]},

  // Teacher
  { path: 'docente', canActivate: [authGuard, roleGuard('teacher')], children: [
    { path: '', loadComponent: () => import('./pages/teacher/dashboard/teacher-dashboard').then(m => m.TeacherDashboardComponent) },
    { path: 'grupos', loadComponent: () => import('./pages/teacher/groups/teacher-groups').then(m => m.TeacherGroupsComponent) },
    { path: 'tareas', loadComponent: () => import('./pages/shared/assignments/assignments-page').then(m => m.AssignmentsPageComponent) },
    { path: 'calificaciones', loadComponent: () => import('./pages/shared/grades/grades-page').then(m => m.GradesPageComponent) },
    { path: 'avisos', loadComponent: () => import('./pages/shared/announcements/announcements-page').then(m => m.AnnouncementsPageComponent) },
    { path: 'mensajes', loadComponent: () => import('./pages/shared/messages/messages-page').then(m => m.MessagesPageComponent) },
  ]},

  // Student
  { path: 'alumno', canActivate: [authGuard, roleGuard('student')], children: [
    { path: '', loadComponent: () => import('./pages/student/dashboard/student-dashboard').then(m => m.StudentDashboardComponent) },
    { path: 'tareas', loadComponent: () => import('./pages/shared/assignments/assignments-page').then(m => m.AssignmentsPageComponent), data: { isStudent: true } },
    { path: 'calificaciones', loadComponent: () => import('./pages/shared/grades/grades-page').then(m => m.GradesPageComponent) },
    { path: 'avisos', loadComponent: () => import('./pages/shared/announcements/announcements-page').then(m => m.AnnouncementsPageComponent) },
    { path: 'calendario', loadComponent: () => import('./pages/shared/calendar/calendar-page').then(m => m.CalendarPageComponent) },
  ]},

  // Parent
  { path: 'padre', canActivate: [authGuard, roleGuard('parent')], children: [
    { path: '', loadComponent: () => import('./pages/parent/dashboard/parent-dashboard').then(m => m.ParentDashboardComponent) },
    { path: 'calificaciones', loadComponent: () => import('./pages/shared/grades/grades-page').then(m => m.GradesPageComponent) },
    { path: 'tareas', loadComponent: () => import('./pages/shared/assignments/assignments-page').then(m => m.AssignmentsPageComponent) },
    { path: 'avisos', loadComponent: () => import('./pages/shared/announcements/announcements-page').then(m => m.AnnouncementsPageComponent) },
    { path: 'calendario', loadComponent: () => import('./pages/shared/calendar/calendar-page').then(m => m.CalendarPageComponent) },
    { path: 'mensajes', loadComponent: () => import('./pages/shared/messages/messages-page').then(m => m.MessagesPageComponent) },
  ]},

  // Fallback
  { path: '**', redirectTo: '' },
];
