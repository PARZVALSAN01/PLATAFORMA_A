import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class ExcelService {

  /** Exportar datos a Excel */
  exportToExcel(data: any[], fileName: string, sheetName = 'Datos') {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  /** Generar plantilla Excel con encabezados */
  downloadTemplate(headers: string[], fileName: string, sampleData?: any[]) {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...(sampleData || [])]);
    // Ajustar ancho de columnas
    ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 5, 15) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
    XLSX.writeFile(wb, `${fileName}_plantilla.xlsx`);
  }

  /** Leer archivo Excel y devolver JSON */
  readExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const wb = XLSX.read(data, { type: 'array' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
          resolve(json);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  /** Plantilla de Alumnos */
  downloadAlumnosTemplate() {
    const headers = [
      'matricula', 'firstName', 'apellidoPaterno', 'apellidoMaterno', 'email', 'phone',
      'level', 'grade', 'group', 'birthDate', 'bloodType', 'allergies',
      'emergencyContact', 'emergencyPhone',
      'street', 'colonia', 'city', 'state', 'zipCode',
      'costoInscripcion', 'costoColegiaturasMensual', 'tipoBeca', 'porcentajeBeca',
      'nombrePadre', 'telefonoPadre', 'emailPadre', 'ocupacionPadre',
      'nombreMadre', 'telefonoMadre', 'emailMadre', 'ocupacionMadre'
    ];
    const sample = [[
      'MAT-2025-001', 'Juan', 'Pérez', 'López', 'juan@correo.com', '5551234567',
      'primaria', '1', 'A', '2015-03-15', 'O+', 'Ninguna',
      'María López', '5559876543',
      'Calle 1 #100', 'Centro', 'Mérida', 'Yucatán', '97000',
      '5000', '2500', '', '0',
      'Pedro Pérez', '5551111111', 'pedro@correo.com', 'Ingeniero',
      'María López', '5552222222', 'maria@correo.com', 'Doctora'
    ]];
    this.downloadTemplate(headers, 'alumnos', sample);
  }

  /** Plantilla de Cobranza */
  downloadCobranzaTemplate() {
    const headers = ['matricula', 'alumno', 'mes', 'monto', 'estado', 'fechaPago', 'referencia'];
    const sample = [[
      'MAT-2025-001', 'Juan Pérez López', 'Agosto', '2500', 'pagado', '2025-08-15', 'REF-001'
    ]];
    this.downloadTemplate(headers, 'cobranza', sample);
  }

  /** Plantilla de Uniformes */
  downloadUniformesTemplate() {
    const headers = ['nombre', 'talla', 'precio', 'stock', 'categoria', 'nivel', 'genero', 'descripcion'];
    const sample = [[
      'Playera escolar', 'CH', '350', '50', 'escolar', 'primaria', 'unisex', 'Playera blanca con logo'
    ]];
    this.downloadTemplate(headers, 'uniformes', sample);
  }

  /** Mapear datos Excel de alumnos al formato del API */
  mapAlumnosData(rows: any[]): any[] {
    return rows.map(r => ({
      matricula: r['matricula'] || r['Matricula'] || r['MATRICULA'] || '',
      firstName: r['firstName'] || r['Nombre'] || r['nombre'] || r['NOMBRE'] || '',
      apellidoPaterno: r['apellidoPaterno'] || r['Apellido Paterno'] || r['apellido_paterno'] || '',
      apellidoMaterno: r['apellidoMaterno'] || r['Apellido Materno'] || r['apellido_materno'] || '',
      email: r['email'] || r['Email'] || r['EMAIL'] || r['Correo'] || '',
      phone: r['phone'] || r['Telefono'] || r['telefono'] || r['TELEFONO'] || '',
      level: (r['level'] || r['Nivel'] || r['nivel'] || 'primaria').toLowerCase(),
      grade: r['grade'] || r['Grado'] || r['grado'] || '',
      group: r['group'] || r['Grupo'] || r['grupo'] || '',
      birthDate: r['birthDate'] || r['Fecha Nacimiento'] || r['fecha_nacimiento'] || null,
      bloodType: r['bloodType'] || r['Tipo Sangre'] || r['tipo_sangre'] || '',
      allergies: r['allergies'] || r['Alergias'] || r['alergias'] || '',
      emergencyContact: r['emergencyContact'] || r['Contacto Emergencia'] || '',
      emergencyPhone: r['emergencyPhone'] || r['Tel Emergencia'] || '',
      street: r['street'] || r['Calle'] || r['calle'] || '',
      colonia: r['colonia'] || r['Colonia'] || '',
      city: r['city'] || r['Ciudad'] || r['ciudad'] || '',
      state: r['state'] || r['Estado'] || r['estado'] || '',
      zipCode: r['zipCode'] || r['CP'] || r['cp'] || '',
      costoInscripcion: Number(r['costoInscripcion'] || r['Costo Inscripcion'] || 0),
      costoColegiaturasMensual: Number(r['costoColegiaturasMensual'] || r['Colegiatura Mensual'] || 0),
      tipoBeca: r['tipoBeca'] || r['Tipo Beca'] || '',
      porcentajeBeca: Number(r['porcentajeBeca'] || r['% Beca'] || 0),
      nombrePadre: r['nombrePadre'] || r['Nombre Padre'] || '',
      telefonoPadre: r['telefonoPadre'] || r['Tel Padre'] || '',
      emailPadre: r['emailPadre'] || r['Email Padre'] || '',
      ocupacionPadre: r['ocupacionPadre'] || r['Ocupacion Padre'] || '',
      nombreMadre: r['nombreMadre'] || r['Nombre Madre'] || '',
      telefonoMadre: r['telefonoMadre'] || r['Tel Madre'] || '',
      emailMadre: r['emailMadre'] || r['Email Madre'] || '',
      ocupacionMadre: r['ocupacionMadre'] || r['Ocupacion Madre'] || '',
    }));
  }

  /** Mapear datos Excel de uniformes al formato del API */
  mapUniformesData(rows: any[]): any[] {
    return rows.map(r => ({
      nombre: r['nombre'] || r['Nombre'] || r['NOMBRE'] || '',
      talla: r['talla'] || r['Talla'] || r['TALLA'] || '',
      precio: Number(r['precio'] || r['Precio'] || r['PRECIO'] || 0),
      stock: Number(r['stock'] || r['Stock'] || r['STOCK'] || 0),
      categoria: (r['categoria'] || r['Categoria'] || r['CATEGORIA'] || 'escolar').toLowerCase(),
      nivel: (r['nivel'] || r['Nivel'] || r['NIVEL'] || '').toLowerCase(),
      genero: (r['genero'] || r['Genero'] || r['GENERO'] || 'unisex').toLowerCase(),
      descripcion: r['descripcion'] || r['Descripcion'] || r['DESCRIPCION'] || '',
    }));
  }
}
