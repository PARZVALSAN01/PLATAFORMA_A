import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { UsersService } from '../../../services/users.service';
import { ExcelService } from '../../../services/excel.service';
import { ToastService } from '../../../services/toast.service';

const MESES = ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
const STORAGE_KEY = 'cobranza_2025_2026';
const COLEGIATURA = 2500;

@Component({
  selector: 'app-admin-cobranza',
  standalone: true,
  imports: [DashboardLayoutComponent, FormsModule, CommonModule],
  templateUrl: './admin-cobranza.html',
  styleUrl: './admin-cobranza.css'
})
export class AdminCobranzaComponent implements OnInit {
  readonly MESES = MESES;
  readonly colegiatura = COLEGIATURA;

  alumnos = signal<any[]>([]);
  alumnosFiltrados = signal<any[]>([]);
  loading = signal(true);
  mesActivo = new Date().getMonth() >= 7 ? new Date().getMonth() - 7 : new Date().getMonth() + 5;
  search = '';
  filtroEstado = '';
  private pagos: Record<string, boolean> = {};

  constructor(private usersService: UsersService, private toast: ToastService, private excelService: ExcelService) {
    const saved = localStorage.getItem(STORAGE_KEY);
    this.pagos = saved ? JSON.parse(saved) : {};
  }

  ngOnInit() {
    this.usersService.getAll({ role: 'student', page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        const lista = res.content || res;
        this.alumnos.set(lista);
        this.alumnosFiltrados.set(lista);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filtrar() {
    let lista = this.alumnos();
    if (this.search) {
      const q = this.search.toLowerCase();
      lista = lista.filter((a: any) =>
        (a.firstName + ' ' + a.lastName).toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
    }
    if (this.filtroEstado === 'al_dia') lista = lista.filter((a: any) => this.adeudo(a.id) === 0);
    if (this.filtroEstado === 'adeudo') lista = lista.filter((a: any) => this.adeudo(a.id) > 0);
    this.alumnosFiltrados.set(lista);
  }

  key(alumnoId: number, mes: number) { return `${alumnoId}_${mes}`; }
  isPaid(alumnoId: number, mes: number) { return !!this.pagos[this.key(alumnoId, mes)]; }
  pagadosMes(mes: number) { return this.alumnos().filter((a: any) => this.isPaid(a.id, mes)).length; }
  adeudo(alumnoId: number) { return MESES.filter((_, i) => !this.isPaid(alumnoId, i)).length * COLEGIATURA; }

  totalCobrado() {
    return this.alumnos().reduce((sum: number, a: any) =>
      sum + MESES.filter((_, i) => this.isPaid(a.id, i)).length * COLEGIATURA, 0);
  }
  totalPendiente() {
    return this.alumnos().reduce((sum: number, a: any) => sum + this.adeudo(a.id), 0);
  }

  marcarPagado(alumnoId: number, mes: number) {
    this.pagos[this.key(alumnoId, mes)] = true;
    this.save();
    this.toast.success('Pago registrado');
  }

  desmarcarPagado(alumnoId: number, mes: number) {
    delete this.pagos[this.key(alumnoId, mes)];
    this.save();
    this.toast.info('Pago revertido');
  }

  marcarTodosPagados() {
    this.alumnos().forEach((a: any) => { this.pagos[this.key(a.id, this.mesActivo)] = true; });
    this.save();
    this.toast.success('Todos pagados en ' + MESES[this.mesActivo]);
  }

  private save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pagos)); }
  initials(a: any) { return ((a.firstName?.[0] || '') + (a.lastName?.[0] || '')).toUpperCase(); }

  downloadTemplate() { this.excelService.downloadCobranzaTemplate(); }

  exportExcel() {
    const data: any[] = [];
    this.alumnos().forEach((a: any) => {
      MESES.forEach((mes, i) => {
        data.push({
          Matrícula: a.email,
          Alumno: a.firstName + ' ' + a.lastName,
          Mes: mes,
          Monto: COLEGIATURA,
          Estado: this.isPaid(a.id, i) ? 'pagado' : 'pendiente',
        });
      });
    });
    this.excelService.exportToExcel(data, 'cobranza_export', 'Cobranza');
  }

  async onExcelUpload(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const rows = await this.excelService.readExcel(file);
      let imported = 0;
      rows.forEach((row: any) => {
        const alumno = this.alumnos().find((a: any) =>
          a.email === (row['matricula'] || row['Matrícula'] || row['email']));
        if (!alumno) return;
        const mesName = row['mes'] || row['Mes'] || '';
        const mesIdx = MESES.findIndex(m => m.toLowerCase() === mesName.toLowerCase());
        if (mesIdx < 0) return;
        const estado = (row['estado'] || row['Estado'] || '').toLowerCase();
        if (estado === 'pagado') {
          this.pagos[this.key(alumno.id, mesIdx)] = true;
          imported++;
        }
      });
      this.save();
      this.toast.success('Importados ' + imported + ' pagos desde Excel');
    } catch {
      this.toast.error('Error al leer el archivo Excel');
    }
    event.target.value = '';
  }
}
