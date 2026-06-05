import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header';
import { FooterComponent } from '../../../components/footer/footer';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <div class="page-hero">
      <div class="hero-bg"></div>
      <div class="container hero-content">
        <span class="hero-badge">Nuestra comunidad</span>
        <h1>Galería de<br><span class="highlight">Momentos</span></h1>
        <p>Capturamos la esencia y los mejores momentos de nuestra vida escolar</p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- Stats bar -->
        <div class="gallery-stats">
          <div class="stat-item">
            <span class="stat-number">{{ items.length }}</span>
            <span class="stat-label">Imágenes</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ categories.length - 1 }}</span>
            <span class="stat-label">Categorías</span>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="filter-bar">
          <div class="filter-track">
            @for (cat of categories; track cat) {
              <button [class]="'filter-chip ' + (activeCategory === cat ? 'active' : '')" (click)="filter(cat)">
                <span class="chip-icon">{{ getCategoryIcon(cat) }}</span>
                {{ cat }}
                @if (activeCategory === cat && cat !== 'Todos') {
                  <span class="chip-count">{{ filteredItems.length }}</span>
                }
              </button>
            }
          </div>
        </div>

        <!-- Gallery Grid -->
        @if (filteredItems.length) {
          <div class="gallery-masonry">
            @for (item of filteredItems; track item.id; let i = $index) {
              <div class="gallery-item" [class]="'gallery-item size-' + getCardSize(i)" (click)="openModal(item, i)">
                <div class="item-image">
                  <img [src]="item.imageUrl || '/assets/placeholder.jpg'" [alt]="item.title" loading="lazy">
                  <div class="item-overlay">
                    <div class="overlay-top">
                      <span class="category-tag">{{ item.category }}</span>
                    </div>
                    <div class="overlay-bottom">
                      <h3>{{ item.title }}</h3>
                      @if (item.description) {
                        <p>{{ item.description }}</p>
                      }
                    </div>
                    <div class="overlay-center">
                      <span class="zoom-icon">🔍</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <div class="empty-visual">
              <span class="empty-icon">📷</span>
              <div class="empty-circles">
                <span class="circle c1"></span>
                <span class="circle c2"></span>
                <span class="circle c3"></span>
              </div>
            </div>
            <h3>No hay imágenes disponibles</h3>
            <p>Pronto agregaremos más contenido a nuestra galería.</p>
          </div>
        }
      </div>
    </section>

    <!-- Lightbox Modal -->
    @if (selectedItem) {
      <div class="lightbox" (click)="closeModal()">
        <div class="lightbox-content" (click)="$event.stopPropagation()">
          <button class="lb-close" (click)="closeModal()">✕</button>

          <div class="lb-nav">
            <button class="lb-arrow lb-prev" (click)="prevImage($event)" [disabled]="selectedIndex === 0">‹</button>
            <button class="lb-arrow lb-next" (click)="nextImage($event)" [disabled]="selectedIndex === filteredItems.length - 1">›</button>
          </div>

          <div class="lb-image-wrap">
            <img [src]="selectedItem.imageUrl || '/assets/placeholder.jpg'" [alt]="selectedItem.title">
          </div>

          <div class="lb-info">
            <div class="lb-meta">
              <span class="category-tag">{{ selectedItem.category }}</span>
              <span class="lb-counter">{{ selectedIndex + 1 }} / {{ filteredItems.length }}</span>
            </div>
            <h3>{{ selectedItem.title }}</h3>
            @if (selectedItem.description) {
              <p>{{ selectedItem.description }}</p>
            }
          </div>
        </div>
      </div>
    }

    <app-footer />
  `,
  styles: [`
    /* Hero */
    .page-hero { position: relative; padding: 10rem 0 5rem; overflow: hidden; background: var(--gray-900); }
    .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--primary-600) 0%, var(--accent-600) 50%, var(--primary-800) 100%); opacity: 0.9; }
    .hero-bg::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%); }
    .hero-content { position: relative; z-index: 1; color: #fff; }
    .hero-badge { display: inline-block; padding: 0.375rem 1rem; background: rgba(255,255,255,0.15); border-radius: 9999px; font-size: 0.8125rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 1.25rem; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); }
    .hero-content h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.25rem, 5vw, 3.5rem); font-weight: 700; line-height: 1.15; margin-bottom: 1rem; }
    .highlight { background: linear-gradient(90deg, var(--accent-300), var(--accent-200)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero-content p { font-size: 1.125rem; opacity: 0.75; max-width: 500px; }

    /* Stats */
    .gallery-stats { display: flex; gap: 2rem; margin-bottom: 2rem; padding: 1.25rem 1.5rem; background: var(--gray-50); border-radius: 1rem; border: 1px solid var(--gray-100); }
    .stat-item { display: flex; align-items: center; gap: 0.625rem; }
    .stat-number { font-size: 1.5rem; font-weight: 800; color: var(--primary-500); }
    .stat-label { font-size: 0.8125rem; color: var(--gray-500); font-weight: 500; }

    /* Filters */
    .filter-bar { margin-bottom: 2.5rem; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .filter-track { display: flex; gap: 0.625rem; padding: 0.25rem 0; }
    .filter-chip {
      display: flex; align-items: center; gap: 0.375rem; padding: 0.625rem 1.25rem; border-radius: 9999px;
      font-size: 0.875rem; font-weight: 500; white-space: nowrap;
      background: #fff; color: var(--gray-600); border: 1.5px solid var(--gray-200); cursor: pointer; transition: all 0.25s;
      &:hover:not(.active) { border-color: var(--primary-300); color: var(--primary-500); background: var(--primary-50); }
      &.active { background: var(--primary-500); color: #fff; border-color: var(--primary-500); box-shadow: 0 4px 12px rgba(var(--primary-rgb, 37,99,235), 0.3); }
    }
    .chip-icon { font-size: 1rem; }
    .chip-count { background: rgba(255,255,255,0.25); padding: 0.1rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }

    /* Masonry Grid */
    .gallery-masonry { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; grid-auto-flow: dense; }
    .gallery-item { cursor: pointer; }
    .gallery-item.size-large { grid-column: span 2; grid-row: span 2; }

    .item-image { position: relative; border-radius: 1rem; overflow: hidden; height: 100%; min-height: 240px;
      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
    }
    .gallery-item:hover .item-image img { transform: scale(1.08); }

    .item-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%, rgba(0,0,0,0.2) 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 1.25rem; opacity: 0; transition: opacity 0.35s; }
    .gallery-item:hover .item-overlay { opacity: 1; }

    .overlay-top { display: flex; justify-content: flex-end; }
    .category-tag { display: inline-block; padding: 0.25rem 0.75rem; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); border-radius: 9999px; font-size: 0.75rem; font-weight: 600; color: #fff; text-transform: capitalize; border: 1px solid rgba(255,255,255,0.15); }
    .overlay-bottom {
      h3 { color: #fff; font-size: 1.0625rem; font-weight: 600; margin-bottom: 0.25rem; }
      p { color: rgba(255,255,255,0.75); font-size: 0.8125rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    }
    .overlay-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
    .zoom-icon { font-size: 2rem; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: transform 0.3s; border: 1px solid rgba(255,255,255,0.2); }
    .gallery-item:hover .zoom-icon { transform: scale(1.1); }

    /* Empty state */
    .empty-state { text-align: center; padding: 5rem 2rem; }
    .empty-visual { position: relative; display: inline-block; margin-bottom: 1.5rem; }
    .empty-icon { font-size: 4rem; position: relative; z-index: 1; }
    .empty-circles { position: absolute; inset: -20px; }
    .circle { position: absolute; border-radius: 50%; border: 2px dashed var(--gray-200); }
    .c1 { width: 80px; height: 80px; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: spin 20s linear infinite; }
    .c2 { width: 110px; height: 110px; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: spin 30s linear infinite reverse; }
    .c3 { width: 140px; height: 140px; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: spin 40s linear infinite; }
    @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
    .empty-state h3 { font-size: 1.375rem; color: var(--gray-700); margin-bottom: 0.5rem; }
    .empty-state p { color: var(--gray-400); font-size: 0.9375rem; }

    /* Lightbox */
    .lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.25s; backdrop-filter: blur(12px); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .lightbox-content { max-width: 900px; width: 100%; position: relative; animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes scaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .lb-close { position: absolute; top: -3rem; right: 0; background: rgba(255,255,255,0.15); color: #fff; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 1.25rem; cursor: pointer; transition: background 0.2s; z-index: 1; &:hover { background: rgba(255,255,255,0.3); } }

    .lb-nav { position: absolute; top: 50%; left: 0; right: 0; display: flex; justify-content: space-between; z-index: 2; transform: translateY(-50%); pointer-events: none; }
    .lb-arrow { pointer-events: all; background: rgba(255,255,255,0.15); color: #fff; border: none; width: 48px; height: 48px; border-radius: 50%; font-size: 1.75rem; cursor: pointer; transition: all 0.2s; backdrop-filter: blur(8px);
      &:hover:not(:disabled) { background: rgba(255,255,255,0.3); transform: scale(1.1); }
      &:disabled { opacity: 0.3; cursor: default; }
    }
    .lb-prev { margin-left: -1.5rem; }
    .lb-next { margin-right: -1.5rem; }

    .lb-image-wrap { border-radius: 1rem; overflow: hidden; background: var(--gray-900);
      img { width: 100%; max-height: 70vh; object-fit: contain; display: block; }
    }

    .lb-info { padding: 1.25rem 0.5rem; color: #fff; }
    .lb-meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
    .lb-counter { font-size: 0.8125rem; color: rgba(255,255,255,0.5); font-weight: 500; }
    .lb-info h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.375rem; }
    .lb-info p { color: rgba(255,255,255,0.6); font-size: 0.9375rem; line-height: 1.6; }

    /* Responsive */
    @media (max-width: 768px) {
      .gallery-masonry { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
      .gallery-item.size-large { grid-column: span 2; grid-row: span 1; }
      .item-image { min-height: 160px; }
      .gallery-stats { gap: 1.25rem; }
      .lb-prev { margin-left: -0.5rem; }
      .lb-next { margin-right: -0.5rem; }
    }
    @media (max-width: 480px) {
      .gallery-masonry { grid-template-columns: 1fr; }
      .gallery-item.size-large { grid-column: span 1; }
    }
  `]
})
export class GaleriaComponent implements OnInit {
  items: any[] = [];
  filteredItems: any[] = [];
  categories = ['Todos'];
  activeCategory = 'Todos';
  selectedItem: any = null;
  selectedIndex = 0;

  private categoryIcons: Record<string, string> = {
    'Todos': '🏠', 'instalaciones': '🏫', 'eventos': '🎉', 'deportes': '⚽',
    'academico': '📚', 'cultura': '🎭', 'general': '📸'
  };

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getPublicGallery().subscribe({
      next: (data) => {
        this.items = data?.content || data || [];
        const cats = new Set(this.items.map((i: any) => i.category).filter(Boolean));
        this.categories = ['Todos', ...cats];
        this.filteredItems = this.items;
      },
      error: () => {}
    });
  }

  filter(cat: string) {
    this.activeCategory = cat;
    this.filteredItems = cat === 'Todos' ? this.items : this.items.filter((i: any) => i.category === cat);
  }

  getCategoryIcon(cat: string): string {
    return this.categoryIcons[cat] || '📁';
  }

  getCardSize(index: number): string {
    return (index % 7 === 0) ? 'large' : 'normal';
  }

  openModal(item: any, index: number) {
    this.selectedItem = item;
    this.selectedIndex = index;
  }

  closeModal() { this.selectedItem = null; }

  prevImage(e: Event) {
    e.stopPropagation();
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.selectedItem = this.filteredItems[this.selectedIndex];
    }
  }

  nextImage(e: Event) {
    e.stopPropagation();
    if (this.selectedIndex < this.filteredItems.length - 1) {
      this.selectedIndex++;
      this.selectedItem = this.filteredItems[this.selectedIndex];
    }
  }
}
