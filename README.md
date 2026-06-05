# 🏫 Instituto Anáhuac - Plataforma Escolar

Plataforma web completa para el Instituto Anáhuac. Incluye sitio público institucional y sistema de gestión escolar con paneles para administradores, docentes, alumnos y padres de familia.

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18 + Vite |
| **Estilos** | Tailwind CSS |
| **Backend** | Node.js + Express |
| **Base de datos** | MongoDB + Mongoose |
| **Autenticación** | JWT + bcryptjs |
| **Iconos** | Lucide React |

## 📁 Estructura del Proyecto

```
instituto-anahuac/
├── client/                    # Frontend React
│   ├── public/               # Archivos estáticos
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── layout/       # Header, Footer, DashboardLayout
│   │   │   └── common/       # ProtectedRoute, etc.
│   │   ├── context/          # AuthContext
│   │   ├── pages/
│   │   │   ├── public/       # Páginas del sitio público
│   │   │   ├── auth/         # Login, Register
│   │   │   ├── admin/        # Panel de administración
│   │   │   ├── teacher/      # Panel de docentes
│   │   │   ├── student/      # Panel de alumnos
│   │   │   └── parent/       # Panel de padres
│   │   ├── services/         # API client (Axios)
│   │   ├── App.jsx           # Rutas principales
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Estilos globales + Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Backend API
│   ├── src/
│   │   ├── config/           # Conexión a MongoDB
│   │   ├── controllers/      # Lógica de negocio
│   │   ├── middleware/        # Auth, upload
│   │   ├── models/           # Modelos Mongoose
│   │   ├── routes/           # Rutas API REST
│   │   ├── seeds/            # Datos de prueba
│   │   └── server.js         # Entry point
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🚀 Instalación y Ejecución

### Requisitos previos

- **Node.js** v18 o superior
- **MongoDB** (local o MongoDB Atlas)
- **npm** o **yarn**

### 1. Clonar / Descargar el proyecto

```bash
cd instituto-anahuac
```

### 2. Configurar el Backend

```bash
cd server

# Instalar dependencias
npm install

# Crear archivo de configuración
copy .env.example .env
# (Editar .env con tus datos de MongoDB)

# Sembrar datos de prueba
npm run seed

# Iniciar el servidor
npm run dev
```

El servidor iniciará en `http://localhost:5000`

### 3. Configurar el Frontend

```bash
cd client

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend iniciará en `http://localhost:5173`

## 📋 Variables de Entorno (.env)

### Node/Express

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/instituto_anahuac
JWT_SECRET=tu_clave_secreta_segura
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Spring Boot

El backend Java lee credenciales desde variables de entorno. Usa `backend/.env.example` como referencia y evita guardar contraseñas reales en `application.properties`.

```env
DB_URL=jdbc:mysql://127.0.0.1:3306/instituto_anahuac?useSSL=false&serverTimezone=America/Mexico_City&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
DB_USERNAME=root
DB_PASSWORD=
JWT_SECRET=change-this-development-secret-at-least-32-characters-long
CORS_ALLOWED_ORIGINS=http://localhost:4200
```

## 👤 Credenciales de Prueba

Después de ejecutar `npm run seed`:

| Rol | Correo | Contraseña |
|-----|--------|------------|
| **Admin** | admin@institutoanahuac.edu.mx | Admin123! |
| **Docente** | maria.gonzalez@institutoanahuac.edu.mx | Docente123! |
| **Docente** | carlos.hernandez@institutoanahuac.edu.mx | Docente123! |
| **Alumno** | ana.martinez@institutoanahuac.edu.mx | Alumno123! |
| **Alumno** | diego.lopez@institutoanahuac.edu.mx | Alumno123! |
| **Padre** | roberto.martinez@gmail.com | Padre123! |

## 📡 API Endpoints

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/profile` | Obtener perfil |
| PUT | `/api/auth/profile` | Actualizar perfil |
| PUT | `/api/auth/change-password` | Cambiar contraseña |

### Usuarios (Admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/stats` | Estadísticas |
| GET | `/api/users/:id` | Obtener usuario |
| POST | `/api/users` | Crear usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Desactivar usuario |

### Académico
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/academic/assignments` | Listar tareas |
| POST | `/api/academic/assignments` | Crear tarea |
| GET | `/api/academic/grades` | Listar calificaciones |
| POST | `/api/academic/grades` | Registrar calificación |

### Contenido
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/content/announcements` | Listar avisos |
| POST | `/api/content/announcements` | Crear aviso |
| GET | `/api/content/news/public` | Noticias públicas |
| POST | `/api/content/contact` | Enviar contacto |
| GET | `/api/content/gallery/public` | Galería pública |
| GET | `/api/content/calendar/public` | Calendario público |
| GET | `/api/content/messages` | Mensajes |
| POST | `/api/content/messages` | Enviar mensaje |

## 🎨 Diseño

- **Colores principales**: Azul marino (#1e3a5f), Dorado (#c9a84c), Blanco
- **Tipografía**: Inter (UI) + Playfair Display (títulos)
- **Diseño responsivo**: Mobile-first para celular, tablet y escritorio
- **Componentes**: Cards, botones, inputs con estilo premium

## 🔒 Seguridad

- Contraseñas encriptadas con **bcryptjs** (12 rounds)
- Autenticación con **JWT**
- Middleware de autorización por **roles**
- Validación de formularios con **express-validator**
- Headers de seguridad con **Helmet**
- CORS configurado
- Protección de rutas en frontend y backend

## 📊 Modelos de Base de Datos

- **User** - Usuarios del sistema
- **Student** - Perfil de alumno
- **Teacher** - Perfil de docente
- **Parent** - Perfil de padre
- **Subject** - Materias
- **Class** - Clases/Grupos
- **Assignment** - Tareas
- **Grade** - Calificaciones
- **Announcement** - Avisos
- **News** - Noticias
- **Gallery** - Galería de imágenes
- **ContactRequest** - Solicitudes de contacto
- **CalendarEvent** - Eventos del calendario
- **Message** - Mensajes internos

## 🔮 Próximos pasos sugeridos

1. Agregar las imágenes reales del instituto en `client/public/images/`
2. Implementar recuperación de contraseña por email
3. Agregar subida de archivos para tareas de alumnos
4. Implementar chat en tiempo real con Socket.io
5. Agregar dashboard de analíticas con gráficas
6. Implementar notificaciones push
7. Agregar módulo de pagos/colegiaturas
8. Implementar generación de boletas en PDF

---

Desarrollado para el **Instituto Anáhuac** 🏫
