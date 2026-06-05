import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, DatePipe } from '@angular/common';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { UniformsService } from '../../../services/uniforms.service';
import { StudentsService } from '../../../services/students.service';
import { ExcelService } from '../../../services/excel.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-uniformes',
  standalone: true,
  imports: [DashboardLayoutComponent, FormsModule, DecimalPipe, DatePipe],
  template: `
    <app-dashboard-layout>
      <div class="page-header">
        <div>
          <h1 class="page-title">Uniformes</h1>
          <p class="page-sub">Inventario y ventas de uniformes escolares</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" (click)="downloadTemplate()">📥 Plantilla Excel</button>
          <button class="btn btn-outline" (click)="fileInput.click()">📤 Cargar Excel</button>
          <input #fileInput type="file" accept=".xlsx,.xls" hidden (change)="onFileUpload($event)">
          <button class="btn btn-outline" (click)="exportExcel()">📊 Exportar</button>
          <button class="btn btn-primary" (click)="openModal()">+ Nuevo Uniforme</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-icon" style="background:#dbeafe">👔</div>
          <div class="stat-info"><span class="stat-value">{{ stats().totalItems }}</span><span class="stat-label">Artículos</span></div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="background:#d1fae5">📦</div>
          <div class="stat-info"><span class="stat-value">{{ stats().totalStock }}</span><span class="stat-label">En stock</span></div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon" style="background:#fef3c7">💲</div>
          <div class="stat-info"><span class="stat-value">\${{ stats().totalVentas | number:'1.0-0' }}</span><span class="stat-label">Ventas totales</span></div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'inventario'" (click)="activeTab = 'inventario'">Inventario</button>
        <button class="tab" [class.active]="activeTab === 'ventas'" (click)="activeTab = 'ventas'">Ventas</button>
      </div>

      <!-- Inventario Tab -->
      @if (activeTab === 'inventario') {
        <div class="card table-card">
          <div class="table-toolbar">
            <input class="form-input search-input" type="search" placeholder="Buscar uniforme..."
              [(ngModel)]="searchTerm" (ngModelChange)="filterUniforms()">
            <select class="form-input" [(ngModel)]="filterCategoria" (ngModelChange)="filterUniforms()">
              <option value="">Todas las categorías</option>
              <option value="escolar">Escolar</option>
              <option value="deportivo">Deportivo</option>
              <option value="gala">Gala</option>
            </select>
          </div>
          @if (loading()) {
            <div class="loading-state">Cargando...</div>
          } @else if (filteredUniforms().length === 0) {
            <div class="empty-state"><span>👔</span><p>No hay uniformes registrados</p></div>
          } @else {
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Talla</th>
                    <th>Categoría</th>
                    <th>Nivel</th>
                    <th>Género</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (u of filteredUniforms(); track u.id) {
                    <tr>
                      <td class="fw-600">{{ u.nombre }}</td>
                      <td><span class="badge badge-info">{{ u.talla }}</span></td>
                      <td>{{ u.categoria }}</td>
                      <td>{{ u.nivel || '-' }}</td>
                      <td>{{ u.genero }}</td>
                      <td class="fw-600">\${{ u.precio | number:'1.0-0' }}</td>
                      <td>
                        <span class="badge" [class.badge-success]="u.stock > 5" [class.badge-warning]="u.stock > 0 && u.stock <= 5" [class.badge-danger]="u.stock === 0">
                          {{ u.stock }}
                        </span>
                      </td>
                      <td>
                        <div class="action-btns">
                          <button class="btn btn-sm btn-outline" (click)="editUniform(u)">✏️</button>
                          <button class="btn btn-sm btn-outline btn-danger" (click)="deleteUniform(u)">🗑️</button>
                          <button class="btn btn-sm btn-primary" (click)="openSaleModal(u)">Vender</button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }

      <!-- Ventas Tab -->
      @if (activeTab === 'ventas') {
        <div class="card table-card">
          @if (sales().length === 0) {
            <div class="empty-state"><span>🧾</span><p>No hay ventas registradas</p></div>
          } @else {
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Uniforme</th>
                    <th>Alumno</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (s of sales(); track s.id) {
                    <tr>
                      <td>{{ s.createdAt | date:'dd/MM/yyyy' }}</td>
                      <td>{{ s.uniformName }}</td>
                      <td>{{ s.studentName }}</td>
                      <td>{{ s.cantidad }}</td>
                      <td class="fw-600">\${{ s.total | number:'1.0-0' }}</td>
                      <td>
                        <span class="badge" [class.badge-warning]="s.estado === 'pendiente'" [class.badge-success]="s.estado === 'pagado'" [class.badge-info]="s.estado === 'entregado'">
                          {{ s.estado }}
                        </span>
                      </td>
                      <td>
                        @if (s.estado === 'pendiente') {
                          <button class="btn btn-sm btn-primary" (click)="updateSaleEstado(s.id, 'pagado')">Marcar pagado</button>
                        } @else if (s.estado === 'pagado') {
                          <button class="btn btn-sm btn-outline" (click)="updateSaleEstado(s.id, 'entregado')">Marcar entregado</button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }

      <!-- Modal Crear/Editar Uniforme -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingId ? 'Editar' : 'Nuevo' }} Uniforme</h2>
              <button class="modal-close" (click)="closeModal()">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label>Nombre *</label>
                  <input class="form-input" [(ngModel)]="form.nombre" placeholder="Ej: Playera escolar">
                </div>
                <div class="form-group">
                  <label>Talla *</label>
                  <input class="form-input" [(ngModel)]="form.talla" placeholder="Ej: CH, M, G, XG">
                </div>
                <div class="form-group">
                  <label>Precio *</label>
                  <input class="form-input" type="number" [(ngModel)]="form.precio" placeholder="350">
                </div>
                <div class="form-group">
                  <label>Stock *</label>
                  <input class="form-input" type="number" [(ngModel)]="form.stock" placeholder="50">
                </div>
                <div class="form-group">
                  <label>Categoría</label>
                  <select class="form-input" [(ngModel)]="form.categoria">
                    <option value="escolar">Escolar</option>
                    <option value="deportivo">Deportivo</option>
                    <option value="gala">Gala</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Nivel</label>
                  <select class="form-input" [(ngModel)]="form.nivel">
                    <option value="">Todos</option>
                    <option value="primaria">Primaria</option>
                    <option value="secundaria">Secundaria</option>
                    <option value="preparatoria">Preparatoria</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Género</label>
                  <select class="form-input" [(ngModel)]="form.genero">
                    <option value="unisex">Unisex</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                  </select>
                </div>
                <div class="form-group full-width">
                  <label>Descripción</label>
                  <textarea class="form-input" [(ngModel)]="form.descripcion" rows="2" placeholder="Descripción opcional"></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" (click)="closeModal()">Cancelar</button>
              <button class="btn btn-primary" (click)="saveUniform()" [disabled]="saving()">
                {{ saving() ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal Venta -->
      @if (showSaleModal()) {
        <div class="modal-overlay" (click)="closeSaleModal()">
          <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Registrar Venta</h2>
              <button class="modal-close" (click)="closeSaleModal()">✕</button>
            </div>
            <div class="modal-body">
              <p class="sale-item-name">{{ saleForm.uniformName }} - {{ saleForm.talla }} (\${{ saleForm.precio | number:'1.0-0' }})</p>
              <div class="form-group">
                <label>Matrícula del Alumno *</label>
                <input class="form-input" [(ngModel)]="saleForm.matricula" placeholder="MAT-2025-001">
              </div>
              <div class="form-group">
                <label>Cantidad *</label>
                <input class="form-input" type="number" [(ngModel)]="saleForm.cantidad" min="1">
              </div>
              <div class="sale-total">
                Total: <strong>\${{ (saleForm.precio * saleForm.cantidad) | number:'1.0-0' }}</strong>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" (click)="closeSaleModal()">Cancelar</button>
              <button class="btn btn-primary" (click)="saveSale()" [disabled]="saving()">Registrar</button>
            </div>
          </div>
        </div>
      }

      <!-- Upload result modal -->
      @if (showUploadResult()) {
        <div class="modal-overlay" (click)="showUploadResult.set(false)">
          <div class="modal-content modal-sm" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Resultado de Carga</h2>
              <button class="modal-close" (click)="showUploadResult.set(false)">✕</button>
            </div>
            <div class="modal-body">
              <p>✅ Importados: <strong>{{ uploadResult().imported }}</strong></p>
              <p>❌ Errores: <strong>{{ uploadResult().errors }}</strong></p>
              @if (uploadResult().errorMessages?.length) {
                <div class="error-list">
                  @for (msg of uploadResult().errorMessages; track msg) {
                    <p class="error-msg">{{ msg }}</p>
                  }
                </div>
              }
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" (click)="showUploadResult.set(false)">Cerrar</button>
            </div>
          </div>
        </div>
      }
    </app-dashboard-layout>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); }
    .page-sub { font-size: 0.875rem; color: var(--gray-500); margin-top: 0.25rem; }
    .header-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }
    .stat-icon { width: 48px; height: 48px; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
    .stat-info { .stat-value { display: block; font-size: 1.25rem; font-weight: 700; color: var(--gray-800); } .stat-label { font-size: 0.8125rem; color: var(--gray-500); } }
    .tabs { display: flex; gap: 0; margin-bottom: 1rem; border-bottom: 2px solid var(--gray-200); }
    .tab { padding: 0.75rem 1.5rem; font-weight: 500; color: var(--gray-500); border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; }
    .tab.active { color: var(--primary); border-bottom-color: var(--primary); }
    .table-card { padding: 0; overflow: hidden; }
    .table-toolbar { display: flex; gap: 0.75rem; padding: 1rem 1.25rem; border-bottom: 1px solid var(--gray-200); flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 200px; }
    .table-wrapper { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: var(--gray-500); background: var(--gray-50); border-bottom: 1px solid var(--gray-200); }
    .data-table td { padding: 0.75rem 1rem; font-size: 0.875rem; border-bottom: 1px solid var(--gray-100); }
    .fw-600 { font-weight: 600; }
    .badge { padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge-success { background: #d1fae5; color: #065f46; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-info { background: #dbeafe; color: #1e40af; }
    .action-btns { display: flex; gap: 0.375rem; }
    .loading-state, .empty-state { padding: 3rem; text-align: center; color: var(--gray-500); }
    .empty-state span { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem; }
    .modal-content { background: white; border-radius: 1rem; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; }
    .modal-sm { max-width: 440px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--gray-200); h2 { font-size: 1.125rem; font-weight: 600; } }
    .modal-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--gray-400); }
    .modal-body { padding: 1.5rem; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid var(--gray-200); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { label { display: block; font-size: 0.8125rem; font-weight: 500; color: var(--gray-700); margin-bottom: 0.375rem; } }
    .full-width { grid-column: 1 / -1; }
    .form-input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--gray-300); border-radius: 0.5rem; font-size: 0.875rem; }
    .form-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    .sale-item-name { font-weight: 600; color: var(--gray-800); margin-bottom: 1rem; padding: 0.75rem; background: var(--gray-50); border-radius: 0.5rem; }
    .sale-total { text-align: right; font-size: 1.125rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--gray-200); }
    .btn { padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-primary { background: var(--primary); color: white; } .btn-primary:hover { background: var(--primary-dark); }
    .btn-outline { background: white; border: 1px solid var(--gray-300); color: var(--gray-700); } .btn-outline:hover { background: var(--gray-50); }
    .btn-danger { color: #dc2626; border-color: #fca5a5; }
    .btn-sm { padding: 0.375rem 0.625rem; font-size: 0.8125rem; }
    .error-list { max-height: 200px; overflow-y: auto; margin-top: 0.75rem; }
    .error-msg { font-size: 0.8125rem; color: #dc2626; padding: 0.25rem 0; }
  `]
})
export class AdminUniformesComponent implements OnInit {
  uniforms = signal<any[]>([]);
  filteredUniforms = signal<any[]>([]);
  sales = signal<any[]>([]);
  stats = signal<any>({ totalItems: 0, totalStock: 0, totalVentas: 0 });
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  showSaleModal = signal(false);
  showUploadResult = signal(false);
  uploadResult = signal<any>({ imported: 0, errors: 0, errorMessages: [] });

  activeTab = 'inventario';
  searchTerm = '';
  filterCategoria = '';
  editingId: number | null = null;

  form: any = { nombre: '', talla: '', precio: 0, stock: 0, categoria: 'escolar', nivel: '', genero: 'unisex', descripcion: '' };
  saleForm: any = { uniformId: 0, uniformName: '', talla: '', precio: 0, matricula: '', cantidad: 1 };

  constructor(
    private uniformsService: UniformsService,
    private studentsService: StudentsService,
    private excelService: ExcelService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.uniformsService.getAll().subscribe({
      next: (data) => {
        this.uniforms.set(data);
        this.filteredUniforms.set(data);
        this.loading.set(false);
        this.calcStats();
      },
      error: () => this.loading.set(false)
    });
    this.uniformsService.getSales().subscribe({
      next: (data) => this.sales.set(data),
      error: () => {}
    });
  }

  calcStats() {
    const items = this.uniforms();
    const totalStock = items.reduce((s, u) => s + (u.stock || 0), 0);
    const totalVentas = this.sales().reduce((s, v) => s + (v.total || 0), 0);
    this.stats.set({ totalItems: items.length, totalStock, totalVentas });
  }

  filterUniforms() {
    let list = this.uniforms();
    if (this.searchTerm) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter((u: any) => u.nombre.toLowerCase().includes(q) || u.talla.toLowerCase().includes(q));
    }
    if (this.filterCategoria) {
      list = list.filter((u: any) => u.categoria === this.filterCategoria);
    }
    this.filteredUniforms.set(list);
  }

  openModal(u?: any) {
    this.editingId = u ? u.id : null;
    this.form = u ? { ...u } : { nombre: '', talla: '', precio: 0, stock: 0, categoria: 'escolar', nivel: '', genero: 'unisex', descripcion: '' };
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  saveUniform() {
    if (!this.form.nombre || !this.form.talla || !this.form.precio) {
      this.toast.error('Nombre, talla y precio son requeridos');
      return;
    }
    this.saving.set(true);
    const obs = this.editingId
      ? this.uniformsService.update(this.editingId, this.form)
      : this.uniformsService.create(this.form);

    obs.subscribe({
      next: () => {
        this.toast.success(this.editingId ? 'Uniforme actualizado' : 'Uniforme creado');
        this.saving.set(false);
        this.closeModal();
        this.loadData();
      },
      error: (err: any) => {
        this.toast.error(err.error?.message || 'Error al guardar');
        this.saving.set(false);
      }
    });
  }

  editUniform(u: any) { this.openModal(u); }

  deleteUniform(u: any) {
    if (!confirm('¿Eliminar uniforme "' + u.nombre + '"?')) return;
    this.uniformsService.delete(u.id).subscribe({
      next: () => { this.toast.success('Eliminado'); this.loadData(); },
      error: () => this.toast.error('Error al eliminar')
    });
  }

  openSaleModal(u: any) {
    this.saleForm = { uniformId: u.id, uniformName: u.nombre, talla: u.talla, precio: u.precio, matricula: '', cantidad: 1 };
    this.showSaleModal.set(true);
  }

  closeSaleModal() { this.showSaleModal.set(false); }

  saveSale() {
    if (!this.saleForm.matricula || this.saleForm.cantidad < 1) {
      this.toast.error('Matrícula y cantidad son requeridos');
      return;
    }
    this.saving.set(true);
    // Find student by matricula first
    this.studentsService.getByMatricula(this.saleForm.matricula).subscribe({
      next: (student: any) => {
        const saleData = {
          uniformId: this.saleForm.uniformId,
          studentId: student.id,
          cantidad: this.saleForm.cantidad,
        };
        this.uniformsService.createSale(saleData).subscribe({
          next: () => {
            this.toast.success('Venta registrada');
            this.saving.set(false);
            this.closeSaleModal();
            this.loadData();
          },
          error: (err: any) => {
            this.toast.error(err.error?.message || 'Error al registrar venta');
            this.saving.set(false);
          }
        });
      },
      error: () => {
        this.toast.error('Alumno no encontrado con esa matrícula');
        this.saving.set(false);
      }
    });
  }

  updateSaleEstado(id: number, estado: string) {
    this.uniformsService.updateSaleEstado(id, estado).subscribe({
      next: () => { this.toast.success('Estado actualizado'); this.loadData(); },
      error: () => this.toast.error('Error al actualizar')
    });
  }

  downloadTemplate() { this.excelService.downloadUniformesTemplate(); }

  exportExcel() {
    const data = this.uniforms().map(u => ({
      Nombre: u.nombre, Talla: u.talla, Precio: u.precio, Stock: u.stock,
      Categoría: u.categoria, Nivel: u.nivel || '', Género: u.genero, Descripción: u.descripcion || ''
    }));
    this.excelService.exportToExcel(data, 'uniformes_export', 'Uniformes');
  }

  async onFileUpload(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await this.excelService.readExcel(file);
      const mapped = this.excelService.mapUniformesData(rows);
      if (mapped.length === 0) { this.toast.error('El archivo está vacío'); return; }

      this.uniformsService.bulkImport(mapped).subscribe({
        next: (result) => {
          this.uploadResult.set(result);
          this.showUploadResult.set(true);
          this.loadData();
        },
        error: (err) => this.toast.error(err.error?.message || 'Error al importar')
      });
    } catch {
      this.toast.error('Error al leer el archivo Excel');
    }
    event.target.value = '';
  }
}
