import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { StudentsService } from '../../../services/students.service';
import { ExcelService } from '../../../services/excel.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-alumnos',
  standalone: true,
  imports: [DashboardLayoutComponent, FormsModule, DecimalPipe, TitleCasePipe],
  template: `
    <app-dashboard-layout>
      <div class="page-header">
        <div>
          <h1 class="page-title">Gestión de Alumnos</h1>
          <p class="page-sub">{{ total() }} alumnos registrados</p>
        </div>
        <button class="btn btn-primary" (click)="abrirNuevo()">
          <span class="btn-icon-left">＋</span> Nuevo Alumno
        </button>
        <button class="btn btn-outline" (click)="downloadTemplate()">📥 Plantilla Excel</button>
        <button class="btn btn-outline" (click)="excelInput.click()">📤 Cargar Excel</button>
        <input #excelInput type="file" accept=".xlsx,.xls" hidden (change)="onExcelUpload($event)">
        <button class="btn btn-outline" (click)="exportExcel()">📊 Exportar</button>
      </div>

      <!-- Filtros -->
      <div class="card filters-bar">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input class="form-input search-input" type="search" placeholder="Buscar por nombre, matrícula o correo..."
            [(ngModel)]="search" (ngModelChange)="onSearch()">
        </div>
        <select class="form-input filter-select" [(ngModel)]="nivelFiltro" (ngModelChange)="load()">
          <option value="">Todos los niveles</option>
          <option value="primaria">Primaria</option>
          <option value="secundaria">Secundaria</option>
          <option value="preparatoria">Preparatoria</option>
        </select>
      </div>

      <!-- Tabla -->
      <div class="card table-card">
        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando alumnos...</p>
          </div>
        } @else if (alumnos().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">👨‍🎓</span>
            <p class="empty-title">No se encontraron alumnos</p>
            <p class="empty-sub">Agrega un nuevo alumno para comenzar</p>
          </div>
        } @else {
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Matrícula</th>
                  <th>Alumno</th>
                  <th>Correo</th>
                  <th>Nivel</th>
                  <th>Grado/Grupo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (a of alumnos(); track a.id) {
                  <tr>
                    <td>
                      @if (a.photoUrl) {
                        <img class="photo-thumb" [src]="'http://localhost:8080' + a.photoUrl" [alt]="a.firstName">
                      } @else {
                        <div class="avatar">{{ getInitials(a.firstName, a.apellidoPaterno) }}</div>
                      }
                    </td>
                    <td><span class="matricula-badge">{{ a.matricula }}</span></td>
                    <td>
                      <div class="user-cell">
                        <div>
                          <span class="user-name">{{ a.firstName }} {{ a.apellidoPaterno }} {{ a.apellidoMaterno }}</span>
                          <span class="user-email-sub">{{ a.email }}</span>
                        </div>
                      </div>
                    </td>
                    <td>{{ a.email }}</td>
                    <td><span class="level-badge" [attr.data-level]="a.level">{{ a.level | titlecase }}</span></td>
                    <td>{{ a.grade }}° {{ a.group }}</td>
                    <td>
                      <span class="badge" [class.badge-success]="a.isActive" [class.badge-danger]="!a.isActive">
                        {{ a.isActive ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>
                      <div class="actions-cell">
                        <button class="btn-sm btn-view" title="Ver detalle" (click)="verDetalle(a)">👁️</button>
                        <button class="btn-sm btn-edit" title="Editar" (click)="editAlumno(a)">✏️</button>
                        <button class="btn-sm btn-photo" title="Subir foto" (click)="abrirFoto(a)">📷</button>
                        <button class="btn-sm btn-danger" title="Desactivar" (click)="desactivar(a.id)">🗑️</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="pagination">
            <button class="btn btn-outline btn-sm" [disabled]="page() === 1" (click)="prevPage()">← Anterior</button>
            <span class="pagination-info">Página {{ page() }} de {{ totalPages() }}</span>
            <button class="btn btn-outline btn-sm" [disabled]="page() >= totalPages()" (click)="nextPage()">Siguiente →</button>
          </div>
        }
      </div>

      <!-- ============ MODAL CREAR/EDITAR ============ -->
      @if (showModal) {
        <div class="modal-backdrop" (click)="cerrarModal()">
          <div class="modal-box card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editando ? 'Editar Alumno' : 'Nuevo Alumno' }}</h2>
              <button class="btn-close" (click)="cerrarModal()">✕</button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="guardar()">
                <!-- Tabs -->
                <div class="tabs">
                  <button type="button" class="tab" [class.active]="activeTab === 'personal'" (click)="activeTab = 'personal'">👤 Personal</button>
                  <button type="button" class="tab" [class.active]="activeTab === 'escolar'" (click)="activeTab = 'escolar'">🎓 Escolar</button>
                  <button type="button" class="tab" [class.active]="activeTab === 'direccion'" (click)="activeTab = 'direccion'">📍 Dirección</button>
                  <button type="button" class="tab" [class.active]="activeTab === 'padres'" (click)="activeTab = 'padres'">👨‍👩‍👧 Padres</button>
                  <button type="button" class="tab" [class.active]="activeTab === 'colegiatura'" (click)="activeTab = 'colegiatura'">💰 Colegiatura</button>
                </div>

                <!-- TAB: Personal -->
                @if (activeTab === 'personal') {
                  <div class="tab-content">
                    <div class="section-title">Datos Personales</div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Nombre(s) *</label>
                        <input class="form-input" [(ngModel)]="form.firstName" name="firstName" required placeholder="Ej: Ana Sofía">
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Apellido Paterno *</label>
                        <input class="form-input" [(ngModel)]="form.apellidoPaterno" name="apellidoPaterno" required placeholder="Ej: Martínez">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Apellido Materno *</label>
                        <input class="form-input" [(ngModel)]="form.apellidoMaterno" name="apellidoMaterno" required placeholder="Ej: Pérez">
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Correo Electrónico *</label>
                        <input class="form-input" type="email" [(ngModel)]="form.email" name="email" required placeholder="correo@ejemplo.com">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Teléfono</label>
                        <input class="form-input" [(ngModel)]="form.phone" name="phone" placeholder="10 dígitos">
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Fecha de Nacimiento</label>
                        <input class="form-input" type="date" [(ngModel)]="form.birthDate" name="birthDate">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Tipo de Sangre</label>
                        <select class="form-input" [(ngModel)]="form.bloodType" name="bloodType">
                          <option value="">Seleccionar</option>
                          <option>O+</option><option>O-</option>
                          <option>A+</option><option>A-</option>
                          <option>B+</option><option>B-</option>
                          <option>AB+</option><option>AB-</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Alergias</label>
                      <input class="form-input" [(ngModel)]="form.allergies" name="allergies" placeholder="Ninguna conocida">
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Contacto de Emergencia</label>
                        <input class="form-input" [(ngModel)]="form.emergencyContact" name="emergencyContact" placeholder="Nombre del contacto">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Teléfono de Emergencia</label>
                        <input class="form-input" [(ngModel)]="form.emergencyPhone" name="emergencyPhone" placeholder="10 dígitos">
                      </div>
                    </div>
                  </div>
                }

                <!-- TAB: Escolar -->
                @if (activeTab === 'escolar') {
                  <div class="tab-content">
                    <div class="section-title">Datos Escolares</div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Matrícula *</label>
                        <input class="form-input" [(ngModel)]="form.matricula" name="matricula" required placeholder="ALU-2025-001">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Nivel *</label>
                        <select class="form-input" [(ngModel)]="form.level" name="level" required>
                          <option value="">Seleccionar nivel</option>
                          <option value="primaria">Primaria</option>
                          <option value="secundaria">Secundaria</option>
                          <option value="preparatoria">Preparatoria</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Grado *</label>
                        <select class="form-input" [(ngModel)]="form.grade" name="grade" required>
                          <option [ngValue]="0">Seleccionar</option>
                          <option [ngValue]="1">1°</option>
                          <option [ngValue]="2">2°</option>
                          <option [ngValue]="3">3°</option>
                          <option [ngValue]="4">4°</option>
                          <option [ngValue]="5">5°</option>
                          <option [ngValue]="6">6°</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Grupo</label>
                        <select class="form-input" [(ngModel)]="form.group" name="group">
                          <option value="">Seleccionar</option>
                          <option>A</option><option>B</option><option>C</option><option>D</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Fecha de Inscripción</label>
                      <input class="form-input" type="date" [(ngModel)]="form.enrollmentDate" name="enrollmentDate">
                    </div>
                  </div>
                }

                <!-- TAB: Dirección -->
                @if (activeTab === 'direccion') {
                  <div class="tab-content">
                    <div class="section-title">Dirección del Alumno</div>
                    <div class="form-group">
                      <label class="form-label">Calle y Número</label>
                      <input class="form-input" [(ngModel)]="form.street" name="street" placeholder="Av. Constitución 456">
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Colonia</label>
                        <input class="form-input" [(ngModel)]="form.colonia" name="colonia" placeholder="Del Valle">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Ciudad</label>
                        <input class="form-input" [(ngModel)]="form.city" name="city" placeholder="Monterrey">
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Estado</label>
                        <input class="form-input" [(ngModel)]="form.state" name="state" placeholder="Nuevo León">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Código Postal</label>
                        <input class="form-input" [(ngModel)]="form.zipCode" name="zipCode" placeholder="64000">
                      </div>
                    </div>
                  </div>
                }

                <!-- TAB: Padres -->
                @if (activeTab === 'padres') {
                  <div class="tab-content">
                    <div class="section-title">Información del Padre</div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Nombre Completo</label>
                        <input class="form-input" [(ngModel)]="form.nombrePadre" name="nombrePadre" placeholder="Nombre completo del padre">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Teléfono</label>
                        <input class="form-input" [(ngModel)]="form.telefonoPadre" name="telefonoPadre" placeholder="10 dígitos">
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Correo Electrónico</label>
                        <input class="form-input" type="email" [(ngModel)]="form.emailPadre" name="emailPadre" placeholder="correo@ejemplo.com">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Ocupación</label>
                        <input class="form-input" [(ngModel)]="form.ocupacionPadre" name="ocupacionPadre" placeholder="Ej: Ingeniero">
                      </div>
                    </div>

                    <div class="section-title" style="margin-top: 1.5rem;">Información de la Madre</div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Nombre Completo</label>
                        <input class="form-input" [(ngModel)]="form.nombreMadre" name="nombreMadre" placeholder="Nombre completo de la madre">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Teléfono</label>
                        <input class="form-input" [(ngModel)]="form.telefonoMadre" name="telefonoMadre" placeholder="10 dígitos">
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Correo Electrónico</label>
                        <input class="form-input" type="email" [(ngModel)]="form.emailMadre" name="emailMadre" placeholder="correo@ejemplo.com">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Ocupación</label>
                        <input class="form-input" [(ngModel)]="form.ocupacionMadre" name="ocupacionMadre" placeholder="Ej: Doctora">
                      </div>
                    </div>
                  </div>
                }

                <!-- TAB: Colegiatura -->
                @if (activeTab === 'colegiatura') {
                  <div class="tab-content">
                    <div class="section-title">Costos de Colegiatura</div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Costo de Inscripción ($)</label>
                        <input class="form-input" type="number" step="0.01" [(ngModel)]="form.costoInscripcion" name="costoInscripcion" placeholder="5000.00">
                      </div>
                      <div class="form-group">
                        <label class="form-label">Colegiatura Mensual ($)</label>
                        <input class="form-input" type="number" step="0.01" [(ngModel)]="form.costoColegiaturasMensual" name="costoColegiaturasMensual" placeholder="4500.00">
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Tipo de Beca</label>
                        <select class="form-input" [(ngModel)]="form.tipoBeca" name="tipoBeca">
                          <option value="">Sin beca</option>
                          <option>Académica</option>
                          <option>Deportiva</option>
                          <option>Socioeconómica</option>
                          <option>Familiar</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Porcentaje de Beca (%)</label>
                        <input class="form-input" type="number" min="0" max="100" step="1" [(ngModel)]="form.porcentajeBeca" name="porcentajeBeca" placeholder="0">
                      </div>
                    </div>
                    @if (form.costoColegiaturasMensual && form.porcentajeBeca) {
                      <div class="costo-final">
                        <span>Colegiatura con beca:</span>
                        <strong>\${{ calcularColegiaturaConBeca() | number:'1.2-2' }} /mes</strong>
                      </div>
                    }
                  </div>
                }

                <div class="modal-actions">
                  <button type="button" class="btn btn-outline" (click)="cerrarModal()">Cancelar</button>
                  <button type="submit" class="btn btn-primary" [disabled]="saving">
                    {{ saving ? 'Guardando...' : (editando ? 'Actualizar Alumno' : 'Registrar Alumno') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }

      <!-- ============ MODAL DETALLE ============ -->
      @if (showDetalle) {
        <div class="modal-backdrop" (click)="showDetalle = false">
          <div class="modal-box modal-lg card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Detalle del Alumno</h2>
              <button class="btn-close" (click)="showDetalle = false">✕</button>
            </div>
            <div class="modal-body">
              @if (detalleAlumno) {
                <div class="detalle-header">
                  @if (detalleAlumno.photoUrl) {
                    <img class="detalle-photo" [src]="'http://localhost:8080' + detalleAlumno.photoUrl" alt="Foto">
                  } @else {
                    <div class="detalle-avatar">{{ getInitials(detalleAlumno.firstName, detalleAlumno.apellidoPaterno) }}</div>
                  }
                  <div>
                    <h3 class="detalle-name">{{ detalleAlumno.firstName }} {{ detalleAlumno.apellidoPaterno }} {{ detalleAlumno.apellidoMaterno }}</h3>
                    <p class="detalle-matricula">{{ detalleAlumno.matricula }}</p>
                  </div>
                </div>

                <div class="detalle-grid">
                  <div class="detalle-section">
                    <h4>📋 Datos Personales</h4>
                    <div class="info-row"><span>Correo:</span><span>{{ detalleAlumno.email }}</span></div>
                    <div class="info-row"><span>Teléfono:</span><span>{{ detalleAlumno.phone || '—' }}</span></div>
                    <div class="info-row"><span>Nacimiento:</span><span>{{ detalleAlumno.birthDate || '—' }}</span></div>
                    <div class="info-row"><span>Tipo Sangre:</span><span>{{ detalleAlumno.bloodType || '—' }}</span></div>
                    <div class="info-row"><span>Alergias:</span><span>{{ detalleAlumno.allergies || 'Ninguna' }}</span></div>
                  </div>
                  <div class="detalle-section">
                    <h4>🎓 Datos Escolares</h4>
                    <div class="info-row"><span>Nivel:</span><span>{{ detalleAlumno.level }}</span></div>
                    <div class="info-row"><span>Grado/Grupo:</span><span>{{ detalleAlumno.grade }}° {{ detalleAlumno.group }}</span></div>
                    <div class="info-row"><span>Inscripción:</span><span>{{ detalleAlumno.enrollmentDate || '—' }}</span></div>
                    <div class="info-row"><span>Emergencia:</span><span>{{ detalleAlumno.emergencyContact || '—' }}</span></div>
                    <div class="info-row"><span>Tel. Emergencia:</span><span>{{ detalleAlumno.emergencyPhone || '—' }}</span></div>
                  </div>
                  <div class="detalle-section">
                    <h4>📍 Dirección</h4>
                    <div class="info-row"><span>Calle:</span><span>{{ detalleAlumno.street || '—' }}</span></div>
                    <div class="info-row"><span>Colonia:</span><span>{{ detalleAlumno.colonia || '—' }}</span></div>
                    <div class="info-row"><span>Ciudad:</span><span>{{ detalleAlumno.city || '—' }}</span></div>
                    <div class="info-row"><span>Estado:</span><span>{{ detalleAlumno.state || '—' }}</span></div>
                    <div class="info-row"><span>C.P.:</span><span>{{ detalleAlumno.zipCode || '—' }}</span></div>
                  </div>
                  <div class="detalle-section">
                    <h4>💰 Colegiatura</h4>
                    <div class="info-row"><span>Inscripción:</span><span>{{ detalleAlumno.costoInscripcion ? ('\$' + detalleAlumno.costoInscripcion) : '—' }}</span></div>
                    <div class="info-row"><span>Mensualidad:</span><span>{{ detalleAlumno.costoColegiaturasMensual ? ('\$' + detalleAlumno.costoColegiaturasMensual) : '—' }}</span></div>
                    <div class="info-row"><span>Beca:</span><span>{{ detalleAlumno.tipoBeca || 'Sin beca' }}</span></div>
                    <div class="info-row"><span>% Beca:</span><span>{{ detalleAlumno.porcentajeBeca ? (detalleAlumno.porcentajeBeca + '%') : '—' }}</span></div>
                  </div>
                  <div class="detalle-section">
                    <h4>👨 Padre</h4>
                    <div class="info-row"><span>Nombre:</span><span>{{ detalleAlumno.nombrePadre || '—' }}</span></div>
                    <div class="info-row"><span>Teléfono:</span><span>{{ detalleAlumno.telefonoPadre || '—' }}</span></div>
                    <div class="info-row"><span>Correo:</span><span>{{ detalleAlumno.emailPadre || '—' }}</span></div>
                    <div class="info-row"><span>Ocupación:</span><span>{{ detalleAlumno.ocupacionPadre || '—' }}</span></div>
                  </div>
                  <div class="detalle-section">
                    <h4>👩 Madre</h4>
                    <div class="info-row"><span>Nombre:</span><span>{{ detalleAlumno.nombreMadre || '—' }}</span></div>
                    <div class="info-row"><span>Teléfono:</span><span>{{ detalleAlumno.telefonoMadre || '—' }}</span></div>
                    <div class="info-row"><span>Correo:</span><span>{{ detalleAlumno.emailMadre || '—' }}</span></div>
                    <div class="info-row"><span>Ocupación:</span><span>{{ detalleAlumno.ocupacionMadre || '—' }}</span></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- ============ MODAL FOTO ============ -->
      @if (showFotoModal) {
        <div class="modal-backdrop" (click)="showFotoModal = false">
          <div class="modal-box modal-sm card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Subir Foto del Alumno</h2>
              <button class="btn-close" (click)="showFotoModal = false">✕</button>
            </div>
            <div class="modal-body" style="text-align: center;">
              @if (fotoAlumno?.photoUrl) {
                <img class="foto-preview" [src]="'http://localhost:8080' + fotoAlumno!.photoUrl" alt="Foto actual">
              } @else {
                <div class="foto-placeholder">📷<br>Sin foto</div>
              }
              <div class="form-group" style="margin-top: 1rem;">
                <label class="form-label">Seleccionar imagen (JPG, PNG, max 5MB)</label>
                <input class="form-input" type="file" accept="image/*" (change)="onFileSelected($event)">
              </div>
              <div class="modal-actions" style="justify-content: center;">
                <button class="btn btn-outline" (click)="showFotoModal = false">Cancelar</button>
                <button class="btn btn-primary" [disabled]="!selectedFile || uploadingPhoto" (click)="subirFoto()">
                  {{ uploadingPhoto ? 'Subiendo...' : 'Subir Foto' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </app-dashboard-layout>
  `,
  styles: [`
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); }
    .page-sub { font-size: 0.875rem; color: var(--gray-500); margin-top: 0.25rem; }
    .btn-icon-left { margin-right: 0.25rem; }

    .filters-bar { display: flex; gap: 1rem; padding: 1rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
    .search-wrapper { position: relative; flex: 1; min-width: 240px; }
    .search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); font-size: 0.875rem; }
    .search-input { padding-left: 2.25rem; width: 100%; }
    .filter-select { min-width: 180px; }

    .table-card { padding: 0; overflow: hidden; }
    .table-wrapper { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse;
      th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--gray-100); font-size: 0.875rem; }
      th { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--gray-500); background: var(--gray-50); }
      tr:hover td { background: var(--gray-50); }
    }

    .photo-thumb { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gray-200); }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--primary-500); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
    .user-cell { display: flex; flex-direction: column; }
    .user-name { font-weight: 600; color: var(--gray-800); }
    .user-email-sub { font-size: 0.75rem; color: var(--gray-400); }

    .matricula-badge { background: var(--primary-50, #e8eef6); color: var(--primary-700, #1e3a5f); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; font-family: monospace; }
    .level-badge { padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;
      &[data-level="primaria"] { background: #dbeafe; color: #1e40af; }
      &[data-level="secundaria"] { background: #fef9c3; color: #854d0e; }
      &[data-level="preparatoria"] { background: #dcfce7; color: #15803d; }
    }
    .badge { display: inline-flex; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .badge-success { background: #dcfce7; color: #15803d; }
    .badge-danger { background: #fee2e2; color: #dc2626; }

    .actions-cell { display: flex; gap: 0.25rem; }
    .btn-sm { background: none; border: 1px solid var(--gray-200); border-radius: 0.375rem; padding: 0.25rem 0.4rem; cursor: pointer; font-size: 0.85rem; transition: all 0.15s;
      &:hover { background: var(--gray-100); }
    }
    .btn-danger:hover { background: #fee2e2; border-color: #fca5a5; }
    .btn-edit:hover { background: #dbeafe; border-color: #93c5fd; }
    .btn-view:hover { background: #f0fdf4; border-color: #86efac; }
    .btn-photo:hover { background: #fef3c7; border-color: #fcd34d; }

    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1rem; border-top: 1px solid var(--gray-100); }
    .pagination-info { font-size: 0.875rem; color: var(--gray-600); }

    .loading-state { padding: 3rem; text-align: center; color: var(--gray-400); }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--gray-200); border-top-color: var(--primary-500); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state { padding: 3rem; text-align: center; }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
    .empty-title { font-size: 1rem; font-weight: 600; color: var(--gray-600); }
    .empty-sub { font-size: 0.875rem; color: var(--gray-400); margin-top: 0.25rem; }

    /* Modal */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem; overflow-y: auto; }
    .modal-box { width: 100%; max-width: 640px; max-height: 90vh; display: flex; flex-direction: column; }
    .modal-lg { max-width: 800px; }
    .modal-sm { max-width: 420px; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--gray-100);
      h2 { font-size: 1.125rem; font-weight: 700; color: var(--gray-800); }
    }
    .modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
    .btn-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--gray-400); padding: 0.25rem 0.5rem; border-radius: 4px; &:hover { background: var(--gray-100); } }

    /* Tabs */
    .tabs { display: flex; gap: 0.25rem; margin-bottom: 1.25rem; border-bottom: 2px solid var(--gray-100); overflow-x: auto; }
    .tab { background: none; border: none; padding: 0.6rem 0.8rem; font-size: 0.8rem; font-weight: 500; color: var(--gray-500); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; white-space: nowrap; transition: all 0.15s;
      &:hover { color: var(--gray-700); }
      &.active { color: var(--primary-600, #1e3a5f); border-bottom-color: var(--primary-600, #1e3a5f); font-weight: 600; }
    }
    .tab-content { animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

    .section-title { font-size: 0.85rem; font-weight: 600; color: var(--primary-600, #1e3a5f); margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--gray-100); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 0.75rem; }
    .form-label { display: block; font-size: 0.8rem; font-weight: 500; color: var(--gray-600); margin-bottom: 0.25rem; }

    .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--gray-100); }
    .btn-outline { background: #fff; border: 1px solid var(--gray-300); color: var(--gray-700); }
    .costo-final { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 0.75rem 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;
      span { color: var(--gray-600); font-size: 0.875rem; }
      strong { color: #15803d; font-size: 1.1rem; }
    }

    /* Detalle */
    .detalle-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-100); }
    .detalle-photo { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-500); }
    .detalle-avatar { width: 72px; height: 72px; border-radius: 50%; background: var(--primary-500); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; }
    .detalle-name { font-size: 1.25rem; font-weight: 700; color: var(--gray-800); }
    .detalle-matricula { font-size: 0.875rem; color: var(--gray-500); font-family: monospace; }
    .detalle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .detalle-section { h4 { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--gray-700); } }
    .info-row { display: flex; justify-content: space-between; padding: 0.35rem 0; font-size: 0.825rem; border-bottom: 1px solid var(--gray-50);
      span:first-child { color: var(--gray-500); font-weight: 500; }
      span:last-child { color: var(--gray-800); text-align: right; }
    }

    /* Foto */
    .foto-preview { width: 160px; height: 160px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-500); margin-bottom: 1rem; }
    .foto-placeholder { width: 160px; height: 160px; border-radius: 50%; background: var(--gray-100); display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--gray-400); margin-bottom: 1rem; }

    @media (max-width: 640px) {
      .form-row { grid-template-columns: 1fr; }
      .detalle-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminAlumnosComponent implements OnInit {
  alumnos = signal<any[]>([]);
  loading = signal(true);
  total = signal(0);
  page = signal(1);
  totalPages = signal(1);
  search = '';
  nivelFiltro = '';

  showModal = false;
  showDetalle = false;
  showFotoModal = false;
  editando: any = null;
  detalleAlumno: any = null;
  fotoAlumno: any = null;
  saving = false;
  uploadingPhoto = false;
  selectedFile: File | null = null;
  activeTab = 'personal';
  private searchTimer: any;

  form: any = this.emptyForm();

  constructor(private studentsService: StudentsService, private toast: ToastService, private excelService: ExcelService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.studentsService.getAll({ search: this.search, level: this.nivelFiltro, page: this.page(), limit: 15 }).subscribe({
      next: (res: any) => {
        this.alumnos.set(res.content || []);
        this.total.set(res.totalElements || 0);
        this.totalPages.set(res.totalPages || 1);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.alumnos.set([]); }
    });
  }

  onSearch() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.page.set(1); this.load(); }, 400);
  }

  prevPage() { if (this.page() > 1) { this.page.update(p => p - 1); this.load(); } }
  nextPage() { if (this.page() < this.totalPages()) { this.page.update(p => p + 1); this.load(); } }

  getInitials(f: string, l: string) { return ((f?.[0] || '') + (l?.[0] || '')).toUpperCase(); }

  emptyForm() {
    return {
      firstName: '', apellidoPaterno: '', apellidoMaterno: '', email: '', phone: '',
      matricula: '', level: '', grade: 0, group: '', enrollmentDate: '', birthDate: '',
      bloodType: '', allergies: '', emergencyContact: '', emergencyPhone: '',
      street: '', colonia: '', city: '', state: '', zipCode: '',
      costoInscripcion: null, costoColegiaturasMensual: null, tipoBeca: '', porcentajeBeca: null,
      nombrePadre: '', telefonoPadre: '', emailPadre: '', ocupacionPadre: '',
      nombreMadre: '', telefonoMadre: '', emailMadre: '', ocupacionMadre: ''
    };
  }

  abrirNuevo() {
    this.editando = null;
    this.form = this.emptyForm();
    this.activeTab = 'personal';
    this.showModal = true;
  }

  editAlumno(a: any) {
    this.editando = a;
    this.form = {
      firstName: a.firstName, apellidoPaterno: a.apellidoPaterno, apellidoMaterno: a.apellidoMaterno,
      email: a.email, phone: a.phone || '',
      matricula: a.matricula, level: a.level, grade: a.grade, group: a.group || '',
      enrollmentDate: a.enrollmentDate || '', birthDate: a.birthDate || '',
      bloodType: a.bloodType || '', allergies: a.allergies || '',
      emergencyContact: a.emergencyContact || '', emergencyPhone: a.emergencyPhone || '',
      street: a.street || '', colonia: a.colonia || '', city: a.city || '', state: a.state || '', zipCode: a.zipCode || '',
      costoInscripcion: a.costoInscripcion, costoColegiaturasMensual: a.costoColegiaturasMensual,
      tipoBeca: a.tipoBeca || '', porcentajeBeca: a.porcentajeBeca,
      nombrePadre: a.nombrePadre || '', telefonoPadre: a.telefonoPadre || '',
      emailPadre: a.emailPadre || '', ocupacionPadre: a.ocupacionPadre || '',
      nombreMadre: a.nombreMadre || '', telefonoMadre: a.telefonoMadre || '',
      emailMadre: a.emailMadre || '', ocupacionMadre: a.ocupacionMadre || ''
    };
    this.activeTab = 'personal';
    this.showModal = true;
  }

  cerrarModal() { this.showModal = false; this.editando = null; this.form = this.emptyForm(); }

  guardar() {
    if (!this.form.firstName || !this.form.apellidoPaterno || !this.form.apellidoMaterno || !this.form.email) {
      this.toast.error('Completa los campos requeridos en la pestaña Personal');
      this.activeTab = 'personal';
      return;
    }
    if (!this.form.matricula || !this.form.level || !this.form.grade) {
      this.toast.error('Completa matrícula, nivel y grado en la pestaña Escolar');
      this.activeTab = 'escolar';
      return;
    }
    this.saving = true;
    const obs = this.editando
      ? this.studentsService.update(this.editando.id, this.form)
      : this.studentsService.create(this.form);
    obs.subscribe({
      next: () => {
        this.toast.success(this.editando ? 'Alumno actualizado' : 'Alumno registrado correctamente');
        this.cerrarModal(); this.load(); this.saving = false;
      },
      error: (err: any) => {
        this.toast.error(err.error?.message || 'Error al guardar alumno');
        this.saving = false;
      }
    });
  }

  verDetalle(a: any) {
    this.detalleAlumno = a;
    this.showDetalle = true;
  }

  desactivar(id: number) {
    if (!confirm('¿Estás seguro de desactivar este alumno?')) return;
    this.studentsService.deactivate(id).subscribe({
      next: () => { this.toast.success('Alumno desactivado'); this.load(); },
      error: () => this.toast.error('Error al desactivar alumno')
    });
  }

  abrirFoto(a: any) {
    this.fotoAlumno = a;
    this.selectedFile = null;
    this.showFotoModal = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('La imagen no debe superar los 5MB');
        return;
      }
      this.selectedFile = file;
    }
  }

  subirFoto() {
    if (!this.selectedFile || !this.fotoAlumno) return;
    this.uploadingPhoto = true;
    this.studentsService.uploadPhoto(this.fotoAlumno.id, this.selectedFile).subscribe({
      next: (res) => {
        this.toast.success('Foto actualizada correctamente');
        this.showFotoModal = false;
        this.uploadingPhoto = false;
        this.load();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al subir foto');
        this.uploadingPhoto = false;
      }
    });
  }

  calcularColegiaturaConBeca(): number {
    const costo = this.form.costoColegiaturasMensual || 0;
    const porcentaje = this.form.porcentajeBeca || 0;
    return costo - (costo * porcentaje / 100);
  }

  downloadTemplate() { this.excelService.downloadAlumnosTemplate(); }

  exportExcel() {
    const data = this.alumnos().map(a => ({
      Matrícula: a.matricula, Nombre: a.firstName, 'Apellido Paterno': a.apellidoPaterno,
      'Apellido Materno': a.apellidoMaterno, Email: a.email, Teléfono: a.phone,
      Nivel: a.level, Grado: a.grade, Grupo: a.group,
      'Costo Inscripción': a.costoInscripcion, 'Colegiatura Mensual': a.costoColegiaturasMensual,
      'Tipo Beca': a.tipoBeca || '', '% Beca': a.porcentajeBeca || 0,
    }));
    this.excelService.exportToExcel(data, 'alumnos_export', 'Alumnos');
  }

  async onExcelUpload(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await this.excelService.readExcel(file);
      const mapped = this.excelService.mapAlumnosData(rows);
      if (mapped.length === 0) { this.toast.error('El archivo está vacío'); return; }
      this.toast.info('Importando ' + mapped.length + ' alumnos...');
      this.studentsService.bulkImport(mapped).subscribe({
        next: (result: any) => {
          this.toast.success('Importados: ' + result.imported + ', Errores: ' + result.errors);
          if (result.errorMessages?.length) {
            result.errorMessages.slice(0, 5).forEach((msg: string) => this.toast.error(msg));
          }
          this.load();
        },
        error: (err: any) => this.toast.error(err.error?.message || 'Error al importar')
      });
    } catch {
      this.toast.error('Error al leer el archivo Excel');
    }
    event.target.value = '';
  }
}
