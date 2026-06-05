import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { UsersService } from '../../../services/users.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DashboardLayoutComponent, FormsModule],
  template: `
    <app-dashboard-layout>
      <div class="page-header">
        <h1 class="page-title">Gestión de Usuarios</h1>
        <button class="btn btn-primary" (click)="openCreate()">+ Nuevo Usuario</button>
      </div>

      <div class="card" style="padding:1rem;margin-bottom:1.5rem;">
        <div class="filters">
          <input type="text" class="form-input" placeholder="Buscar por nombre o correo..." [(ngModel)]="search" (input)="filterUsers()">
          <select class="form-input" [(ngModel)]="roleFilter" (change)="filterUsers()" style="max-width:200px;">
            <option value="">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Docente</option>
            <option value="student">Alumno</option>
            <option value="parent">Padre</option>
          </select>
        </div>
      </div>

      <div class="card table-wrapper">
        <table class="table">
          <thead>
            <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            @for (user of filteredUsers; track user.id) {
              <tr>
                <td>{{ user.firstName }} {{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td><span class="badge badge-primary">{{ user.role }}</span></td>
                <td><span [class]="'badge ' + (user.isActive ? 'badge-accent' : 'badge-gray')">{{ user.isActive ? 'Activo' : 'Inactivo' }}</span></td>
                <td>
                  <button class="btn btn-sm btn-outline" (click)="editUser(user)">Editar</button>
                  <button class="btn btn-sm btn-danger" (click)="deleteUser(user.id)">Eliminar</button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" style="text-align:center;color:var(--gray-400);">No se encontraron usuarios</td></tr>
            }
          </tbody>
        </table>
      </div>

      @if (showModal) {
        <div class="modal-overlay" (click)="showModal = false">
          <div class="modal card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingUser ? 'Editar' : 'Nuevo' }} Usuario</h2>
              <button class="modal-close" (click)="showModal = false">✕</button>
            </div>
            <form (ngSubmit)="saveUser()" class="form-stack" style="padding:1.5rem;">
              <div class="form-row">
                <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" [(ngModel)]="userForm.firstName" name="fn" required></div>
                <div class="form-group"><label class="form-label">Apellido</label><input class="form-input" [(ngModel)]="userForm.lastName" name="ln" required></div>
              </div>
              <div class="form-group"><label class="form-label">Correo</label><input type="email" class="form-input" [(ngModel)]="userForm.email" name="em" required></div>
              @if (!editingUser) {
                <div class="form-group"><label class="form-label">Contraseña</label><input type="password" class="form-input" [(ngModel)]="userForm.password" name="pw" required></div>
              }
              <div class="form-group">
                <label class="form-label">Rol</label>
                <select class="form-input" [(ngModel)]="userForm.role" name="rl" required>
                  <option value="admin">Administrador de usuarios</option><option value="teacher">Docente</option>
                  <option value="student">Alumno</option><option value="parent">Padre</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-full">{{ editingUser ? 'Actualizar' : 'Crear' }}</button>
            </form>
          </div>
        </div>
      }
    </app-dashboard-layout>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); }
    .filters { display: flex; gap: 1rem; flex-wrap: wrap; }
    .table-wrapper { overflow-x: auto; }
    .form-stack { display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .w-full { width: 100%; }
    .btn-danger { background: #dc2626; color: #fff; &:hover { background: #b91c1c; } }
    .badge-gray { background: var(--gray-100); color: var(--gray-600); }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal { width: 100%; max-width: 500px; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--gray-200);
      h2 { font-size: 1.125rem; font-weight: 600; }
      .modal-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--gray-400); }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  search = '';
  roleFilter = '';
  showModal = false;
  editingUser: any = null;
  userForm = { firstName: '', lastName: '', email: '', password: '', role: 'admin' };

  constructor(private usersService: UsersService, private toast: ToastService) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.usersService.getAll().subscribe({
      next: (data) => { this.users = data?.content || data || []; this.filterUsers(); },
      error: () => this.toast.show('Error al cargar usuarios', 'error')
    });
  }

  filterUsers() {
    let result = this.users;
    if (this.roleFilter) result = result.filter((u: any) => u.role === this.roleFilter);
    if (this.search) {
      const s = this.search.toLowerCase();
      result = result.filter((u: any) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }
    this.filteredUsers = result;
  }

  editUser(user: any) {
    this.editingUser = user;
    this.userForm = { firstName: user.firstName, lastName: user.lastName, email: user.email, password: '', role: user.role };
    this.showModal = true;
  }

  openCreate() {
    this.editingUser = null;
    this.userForm = { firstName: '', lastName: '', email: '', password: '', role: 'admin' };
    this.showModal = true;
  }

  saveUser() {
    if (!this.userForm.firstName || !this.userForm.lastName || !this.userForm.email || (!this.editingUser && !this.userForm.password)) {
      this.toast.show('Completa los campos requeridos', 'error');
      return;
    }
    const obs = this.editingUser
      ? this.usersService.update(this.editingUser.id, this.userForm)
      : this.usersService.create(this.userForm);
    obs.subscribe({
      next: () => {
        this.toast.show(this.editingUser ? 'Usuario actualizado' : 'Usuario creado', 'success');
        this.showModal = false;
        this.editingUser = null;
        this.userForm = { firstName: '', lastName: '', email: '', password: '', role: 'admin' };
        this.loadUsers();
      },
      error: (e) => this.toast.show(e.error?.message || 'Error', 'error')
    });
  }

  deleteUser(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.usersService.remove(id).subscribe({
      next: () => { this.toast.show('Usuario eliminado', 'success'); this.loadUsers(); },
      error: () => this.toast.show('Error al eliminar', 'error')
    });
  }
}
