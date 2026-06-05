import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { ContentService } from '../../../services/content.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [DashboardLayoutComponent, FormsModule, DatePipe],
  template: `
    <app-dashboard-layout>
      <div class="page-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <button class="btn btn-primary" (click)="openCreate()">+ Nuevo</button>
      </div>

      <!-- Gallery grid view -->
      @if (contentType === 'gallery') {
        @if (items.length) {
          <div class="gallery-admin-grid">
            @for (item of items; track item.id) {
              <div class="gallery-admin-card card">
                <div class="gallery-thumb">
                  <img [src]="item.imageUrl || '/assets/placeholder.jpg'" [alt]="item.title">
                  <div class="gallery-thumb-overlay">
                    <button class="btn-icon" (click)="deleteItem(item.id)" title="Eliminar">🗑️</button>
                  </div>
                </div>
                <div class="gallery-card-info">
                  <h4>{{ item.title }}</h4>
                  <span class="badge">{{ item.category }}</span>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state card">
            <span class="empty-icon">📷</span>
            <h3>No hay imágenes</h3>
            <p>Sube la primera imagen a la galería</p>
          </div>
        }
      } @else {
        <!-- Table view for other content types -->
        <div class="card table-wrapper">
          <table class="table">
            <thead><tr><th>Título</th><th>Fecha</th><th>Acciones</th></tr></thead>
            <tbody>
              @for (item of items; track item.id) {
                <tr>
                  <td>{{ item.title }}</td>
                  <td>{{ item.createdAt | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline" (click)="editItem(item)">Editar</button>
                    <button class="btn btn-sm btn-danger" (click)="deleteItem(item.id)">Eliminar</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="3" style="text-align:center;color:var(--gray-400);">Sin registros</td></tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (showModal) {
        <div class="modal-overlay" (click)="showModal = false">
          <div class="modal card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editing ? 'Editar' : 'Nuevo' }} {{ singularTitle }}</h2>
              <button class="modal-close" (click)="showModal = false">✕</button>
            </div>
            <form (ngSubmit)="save()" class="form-stack" style="padding:1.5rem;">
              <div class="form-group"><label class="form-label">Título</label><input class="form-input" [(ngModel)]="form.title" name="title" required></div>

              @if (contentType === 'gallery') {
                <div class="form-group">
                  <label class="form-label">Descripción</label>
                  <textarea class="form-input" [(ngModel)]="form.description" name="desc" rows="3" placeholder="Descripción breve de la imagen"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Categoría</label>
                  <select class="form-input" [(ngModel)]="form.category" name="category">
                    <option value="general">General</option>
                    <option value="instalaciones">Instalaciones</option>
                    <option value="eventos">Eventos</option>
                    <option value="deportes">Deportes</option>
                    <option value="academico">Académico</option>
                    <option value="cultura">Cultura</option>
                  </select>
                </div>
                @if (!editing) {
                  <div class="form-group">
                    <label class="form-label">Imagen (máx. 20 MB)</label>
                    <div class="upload-zone"
                         [class.drag-over]="isDragOver"
                         (dragover)="onDragOver($event)"
                         (dragleave)="isDragOver = false"
                         (drop)="onDrop($event)"
                         (click)="fileInput.click()">
                      @if (imagePreview) {
                        <img [src]="imagePreview" class="upload-preview" alt="Vista previa">
                        <button type="button" class="btn btn-sm btn-outline remove-preview" (click)="removeFile($event)">Cambiar imagen</button>
                      } @else {
                        <div class="upload-placeholder">
                          <span class="upload-icon">📁</span>
                          <p>Arrastra una imagen aquí o <strong>haz clic para seleccionar</strong></p>
                          <span class="upload-hint">JPG, PNG, WebP — máx. 20 MB</span>
                        </div>
                      }
                      <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" hidden>
                    </div>
                    @if (fileSizeError) {
                      <p class="form-error">{{ fileSizeError }}</p>
                    }
                  </div>
                }
              } @else {
                <div class="form-group"><label class="form-label">Contenido</label><textarea class="form-input" [(ngModel)]="form.content" name="content" rows="5"></textarea></div>
                @if (contentType === 'announcements' || contentType === 'news') {
                  <div class="form-group"><label class="form-label">Categoría</label><input class="form-input" [(ngModel)]="form.category" name="category"></div>
                }
              }

              @if (contentType === 'calendar') {
                <div class="form-group"><label class="form-label">Descripción</label><textarea class="form-input" [(ngModel)]="form.description" name="desc" rows="3"></textarea></div>
                <div class="form-row">
                  <div class="form-group"><label class="form-label">Fecha inicio</label><input type="datetime-local" class="form-input" [(ngModel)]="form.startDate" name="start"></div>
                  <div class="form-group"><label class="form-label">Fecha fin</label><input type="datetime-local" class="form-input" [(ngModel)]="form.endDate" name="end"></div>
                </div>
              }
              <button type="submit" class="btn btn-primary w-full" [disabled]="uploading">
                {{ uploading ? 'Subiendo...' : (editing ? 'Actualizar' : 'Crear') }}
              </button>
            </form>
          </div>
        </div>
      }
    </app-dashboard-layout>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); }
    .table-wrapper { overflow-x: auto; }
    .form-stack { display: flex; flex-direction: column; gap: 1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .w-full { width: 100%; }
    .btn-danger { background: #dc2626; color: #fff; &:hover { background: #b91c1c; } }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal { width: 100%; max-width: 550px; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--gray-200);
      h2 { font-size: 1.125rem; font-weight: 600; }
      .modal-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--gray-400); }
    }
    /* Gallery admin grid */
    .gallery-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
    .gallery-admin-card { overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;
      &:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
    }
    .gallery-thumb { position: relative; height: 160px; overflow: hidden;
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    .gallery-thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
    .gallery-thumb:hover .gallery-thumb-overlay { opacity: 1; }
    .btn-icon { background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 1.25rem; cursor: pointer; transition: transform 0.2s; &:hover { transform: scale(1.1); } }
    .gallery-card-info { padding: 0.75rem 1rem;
      h4 { font-size: 0.875rem; font-weight: 600; color: var(--gray-800); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .badge { font-size: 0.6875rem; padding: 0.2rem 0.5rem; background: var(--primary-50); color: var(--primary-600); border-radius: 9999px; font-weight: 500; }
    }
    /* Upload zone */
    .upload-zone { border: 2px dashed var(--gray-300); border-radius: 0.75rem; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--gray-50);
      &:hover, &.drag-over { border-color: var(--primary-400); background: var(--primary-50); }
    }
    .upload-placeholder {
      .upload-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
      p { font-size: 0.875rem; color: var(--gray-600); margin-bottom: 0.25rem; strong { color: var(--primary-500); } }
      .upload-hint { font-size: 0.75rem; color: var(--gray-400); }
    }
    .upload-preview { max-height: 180px; max-width: 100%; border-radius: 0.5rem; object-fit: contain; margin-bottom: 0.75rem; }
    .remove-preview { margin-top: 0.5rem; }
    .form-error { color: #dc2626; font-size: 0.8125rem; margin-top: 0.375rem; }
    .empty-state { text-align: center; padding: 3rem 2rem;
      .empty-icon { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
      h3 { font-size: 1.125rem; color: var(--gray-700); margin-bottom: 0.25rem; }
      p { color: var(--gray-400); font-size: 0.875rem; }
    }
  `]
})
export class AdminContentComponent implements OnInit {
  contentType: 'announcements' | 'news' | 'gallery' | 'calendar' | 'contacts' = 'announcements';

  items: any[] = [];
  showModal = false;
  editing: any = null;
  form: any = {};
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isDragOver = false;
  fileSizeError: string | null = null;
  uploading = false;

  private readonly MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  get pageTitle(): string {
    const map: Record<string, string> = { announcements: 'Avisos', news: 'Noticias', gallery: 'Galería', calendar: 'Calendario', contacts: 'Solicitudes' };
    return map[this.contentType] || 'Contenido';
  }
  get singularTitle(): string {
    const map: Record<string, string> = { announcements: 'Aviso', news: 'Noticia', gallery: 'Imagen', calendar: 'Evento', contacts: 'Solicitud' };
    return map[this.contentType] || 'Elemento';
  }

  constructor(private contentService: ContentService, private toast: ToastService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.contentType = data['contentType'] || 'announcements';
      this.load();
    });
  }

  load() {
    const loaders: Record<string, any> = {
      announcements: () => this.contentService.getAnnouncements(),
      news: () => this.contentService.getNews(),
      gallery: () => this.contentService.getGallery(),
      calendar: () => this.contentService.getCalendar(),
      contacts: () => this.contentService.getContactRequests(),
    };
    (loaders[this.contentType] || loaders['announcements'])().subscribe({
      next: (d: any) => this.items = d?.content || d || [],
      error: () => this.toast.show('Error al cargar', 'error')
    });
  }

  openCreate() {
    this.editing = null;
    this.form = { title: '', content: '', category: 'general', description: '', startDate: '', endDate: '' };
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileSizeError = null;
    this.showModal = true;
  }

  editItem(item: any) {
    this.editing = item;
    this.form = { ...item };
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileSizeError = null;
    this.showModal = true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.handleFile(input.files[0]);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files.length) this.handleFile(event.dataTransfer.files[0]);
  }

  private handleFile(file: File) {
    this.fileSizeError = null;
    if (!file.type.startsWith('image/')) {
      this.fileSizeError = 'Solo se permiten archivos de imagen.';
      return;
    }
    if (file.size > this.MAX_FILE_SIZE) {
      this.fileSizeError = `El archivo pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 20 MB.`;
      return;
    }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileSizeError = null;
  }

  save() {
    if (this.contentType === 'gallery' && !this.editing) {
      if (!this.selectedFile) { this.toast.show('Selecciona una imagen', 'error'); return; }
      this.uploading = true;
      const fd = new FormData();
      fd.append('file', this.selectedFile);
      fd.append('title', this.form.title);
      fd.append('description', this.form.description || '');
      fd.append('category', this.form.category || 'general');
      this.contentService.addToGallery(fd).subscribe({
        next: () => { this.toast.show('Imagen subida', 'success'); this.showModal = false; this.uploading = false; this.load(); },
        error: () => { this.toast.show('Error al subir imagen', 'error'); this.uploading = false; }
      });
      return;
    }
    const creators: Record<string, any> = {
      announcements: (d: any) => this.editing ? this.contentService.updateAnnouncement(this.editing.id, d) : this.contentService.createAnnouncement(d),
      news: (d: any) => this.editing ? this.contentService.updateNews(this.editing.id, d) : this.contentService.createNews(d),
      gallery: (d: any) => this.editing ? this.contentService.updateGalleryItem(this.editing.id, d) : this.contentService.createGalleryItem(d),
      calendar: (d: any) => this.editing ? this.contentService.updateCalendarEvent(this.editing.id, d) : this.contentService.createCalendarEvent(d),
    };
    const fn = creators[this.contentType];
    if (!fn) return;
    fn(this.form).subscribe({
      next: () => { this.toast.show(this.editing ? 'Actualizado' : 'Creado', 'success'); this.showModal = false; this.load(); },
      error: () => this.toast.show('Error al guardar', 'error')
    });
  }

  deleteItem(id: number) {
    if (!confirm('¿Eliminar este elemento?')) return;
    const deleters: Record<string, any> = {
      announcements: (i: number) => this.contentService.deleteAnnouncement(i),
      news: (i: number) => this.contentService.deleteNews(i),
      gallery: (i: number) => this.contentService.deleteGalleryItem(i),
      calendar: (i: number) => this.contentService.deleteCalendarEvent(i),
    };
    (deleters[this.contentType] || deleters['announcements'])(id).subscribe({
      next: () => { this.toast.show('Eliminado', 'success'); this.load(); },
      error: () => this.toast.show('Error al eliminar', 'error')
    });
  }
}
