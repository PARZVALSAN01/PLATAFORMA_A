import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header';
import { FooterComponent } from '../../../components/footer/footer';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SlicePipe, HeaderComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  news: any[] = [];

  stats = [
    { value: '5000+', label: 'Alumnos formados' },
    { value: '50+', label: 'Docentes' },
    { value: '22+', label: 'Años de experiencia' },
    { value: '100%', label: 'Excelencia académica' },
  ];

  values = [
    { icon: '🏆', title: 'Olimpiadas del Conocimiento', desc: 'Resultados sobresalientes, incluyendo triunfos en Olimpiadas del Conocimiento.' },
    { icon: '🧠', title: 'Departamento Psicopedagógico', desc: 'Equipo enfocado en el área emocional y académica de cada estudiante.' },
    { icon: '🇲🇽', title: 'Valores Mexicanos', desc: 'Fomentamos principios humanos y valores que fortalecen nuestras raíces.' },
    { icon: '💻', title: 'Tecnología de Punta', desc: 'Laboratorios de cómputo con equipos modernos para el aprendizaje digital.' },
    { icon: '⚽', title: 'Deportes', desc: 'Programas de educación física y actividades deportivas completos.' },
    { icon: '🎨', title: 'Arte y Cultura', desc: 'Talleres de música y artes para desarrollar la creatividad de nuestros alumnos.' },
  ];

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getPublicNews().subscribe({
      next: (data) => this.news = (data?.content || data || []).slice(0, 3),
      error: () => {}
    });
  }

  ngAfterViewInit() {
    // Animate stats on scroll
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = '1';
          (e.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.stat-item, .value-card, .level-card, .news-card').forEach((el, i) => {
      (el as HTMLElement).style.cssText += `opacity:0;transform:translateY(24px);transition:opacity 0.6s ${i * 0.08}s ease,transform 0.6s ${i * 0.08}s ease`;
      obs.observe(el);
    });
  }
}
