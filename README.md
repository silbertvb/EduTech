# EduTech

Plataforma e-learning full-stack con **React + Vite** en el frontend y **Express + PostgreSQL** en el backend, organizada como **monorepo con npm workspaces**.

## 🚀 Demo en vivo

🔗 [EduTech — Aprende a tu ritmo](https://edutech-ujtr.onrender.com)

> ⏳ El servicio corre en el plan gratuito de Render: si nadie lo visita durante ~15 minutos se "duerme", y la primera visita puede tardar 30-50 segundos en responder mientras despierta. Las capturas de abajo cubren ese hueco si prefieres no esperar.

## 👀 Guía rápida para revisar el proyecto

Al acceder verás la pantalla de login. Desplázate hacia abajo para encontrar las opciones de acceso demo — no necesitas crear cuenta ni usar Google.

> 💡 **Recomendación:** empieza con **Demo Alumno** para ver la experiencia completa del usuario final. Luego prueba **Profesor** o **Admin** para explorar el backoffice.

**Opciones demo disponibles:**

| Rol | Qué puedes explorar |
|---|---|
| 🔴 Demo Admin | Panel de administración completo: gestión de usuarios, roles y configuración global de la plataforma |
| 🟡 Demo Profesor | Creación y gestión de cursos, lecciones, tests y preguntas |
| 🟢 Demo Alumno ⭐ | Recomendado — Experiencia de usuario final con banner estilizado, catálogo de cursos, sección "Mis cursos", progreso y tests interactivos |

## 📸 Capturas

### Vista del alumno
![Home del alumno](docs/screenshots/home-alumno.jpg)

### Lección con contenido multimedia
![Lección](docs/screenshots/leccion.jpg)

### Test corregido con revisión de respuestas
![Resultados de test](docs/screenshots/test-resultados.jpg)

## Características principales

- Autenticación con **Google OAuth 2.0** (Passport), cuenta normal con email/password y accesos demo
- Control de acceso por roles (RBAC): **alumno**, **profesor**, **administrador**
- CRUD completo de **cursos**, **lecciones**, **tests** y **preguntas**
- Registro de resultados y calificaciones por usuario
- **Backoffice** independiente para administradores (`/admin`)
- SPA React que consume la API (`/api/*`) con proxy integrado de Vite

## Requisitos

- Node.js **18+**
- Docker (para la base de datos PostgreSQL)


Las dependencias de todos los workspaces se instalan en el `node_modules` raíz mediante **npm workspaces**. No hay `node_modules` individuales por app.

## Configuración local (desarrollo)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Crea un `.env` en la raíz con:

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=elearning_platform

# Sesión
SESSION_SECRET=una_clave_segura

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5173/auth/google/callback

# Frontend (para redirecciones tras login/logout)
CLIENT_ORIGIN=http://localhost:5173

# Backoffice admin
ADMIN_USER=admin
ADMIN_PASSWORD=tu_contraseña_segura
```

### 3. Arrancar la base de datos

```bash
docker compose up -d
```

Levanta PostgreSQL 17 en el puerto `5434` e inicializa el esquema automáticamente.

### 4. Arrancar backend y frontend

```bash
npm run dev
```

- Backend (API): http://localhost:3000
- Frontend (React): http://localhost:5173
- Backoffice admin: http://localhost:5173/admin

## Backup de base de datos

<!-- TODO: edutech_backup.sql no esta presente en el repo actual (solo queda en commits antiguos). Regenerarlo con el comando de abajo y volver a subirlo, o quitar esta seccion si ya no se usa. -->

El archivo `edutech_backup.sql` (no incluido actualmente en el repositorio — ver TODO arriba) es una copia exportada de la base de datos PostgreSQL `elearning_platform` que se genera bajo demanda.

Este backup incluye el esquema y los datos actuales de la plataforma: usuarios, roles, cursos, imagenes de portada, lecciones, adjuntos multimedia de lecciones, tests, preguntas, inscripciones y resultados.

El archivo se genero desde el contenedor de PostgreSQL con:

```bash
docker exec tfg_edutech-db-1 pg_dump -U postgres -d elearning_platform > edutech_backup.sql
```

Para restaurarlo en una base de datos existente:

```bash
docker exec -i tfg_edutech-db-1 psql -U postgres -d elearning_platform < edutech_backup.sql
```

Ademas del backup completo, el proyecto incluye el archivo `edutech_cursos_ejercicios.sql`.

Este segundo archivo es una exportacion parcial pensada para conservar y compartir el contenido academico creado en la plataforma: cursos, lecciones, adjuntos multimedia, tests, preguntas, resultados e inscripciones de usuarios a cursos.

Se genero con:

```bash
docker exec tfg_edutech-db-1 pg_dump -U postgres -d elearning_platform -t courses -t lessons -t lesson_attachments -t tests -t questions -t results -t user_courses > edutech_cursos_ejercicios.sql
```

## Archivos de entrega

En la raiz del proyecto se incluye el archivo de texto requerido para la entrega:

- `url.txt`: contiene la URL de acceso a la aplicacion. Actualmente apunta al entorno local de desarrollo (`http://localhost:5173/`) y debe actualizarse si se despliega en un hosting publico.

Las credenciales de acceso (backoffice de administracion y usuarios demo) estan documentadas en la seccion [Acceso demo para evaluacion](#acceso-demo-para-evaluacion).

## Registro, acceso y roles

La pantalla de login permite tres formas de acceso:

### Google OAuth

- **Continuar como Alumno con Google**: inicia sesion con Google y crea la cuenta con rol `alumno` si todavia no existe.
- **Continuar como Profesor con Google**: inicia sesion con Google y crea la cuenta con rol `profesor` si todavia no existe.

El rol de Google OAuth se asigna en el primer acceso. Si el usuario ya existe, el rol no cambia automaticamente.

### Cuenta normal con email y password

El usuario tambien puede crear una cuenta sin Google desde la seccion **cuenta normal**:

- Selecciona si quiere registrarse como `alumno` o `profesor`.
- Introduce nombre, email y password.
- La contrasena se guarda en base de datos como hash, no en texto plano.
- Una vez creada la cuenta, puede volver a entrar con email y password desde la opcion **Entrar**.

### Acceso demo para evaluacion

La pantalla de login mantiene una seccion discreta de accesos demo:

- **Demo Admin**: entra como `administrador`.
- **Demo Profesor**: entra como `profesor`.
- **Demo Alumno**: entra como `alumno`.

Estos usuarios estan precargados en la base de datos:

| Rol | Email | Password |
|---|---|---|
| Administrador | admin@tfgdemo.com | Admin123! |
| Profesor | profesor@tfgdemo.com | Profesor123! |
| Alumno | alumno@tfgdemo.com | Alumno123! |

### Permisos principales

- `alumno`: puede ver el catalogo de cursos, inscribirse y realizar tests.
- `profesor`: solo ve y gestiona sus propios cursos.
- `administrador`: tiene acceso completo a la plataforma y al backoffice.

## Backoffice (`/admin`)

Acceso independiente del OAuth de Google, protegido por usuario y contraseña definidos en `.env`.

Desde el backoffice el administrador puede:
- Listar todos los usuarios
- Cambiar el rol de cualquier usuario
- Eliminar usuarios

> ⚠️ El login del backoffice (`ADMIN_USER`/`ADMIN_PASSWORD`) y la sesión de la app principal son sistemas de autenticación independientes. Para que la lista de usuarios cargue, primero inicia sesión en la app como **Demo Admin** (o cualquier cuenta con rol `administrador`) desde `/login`, y **luego**, en la misma pestaña, entra en `/admin` — ambas sesiones conviven en la misma cookie. Si entras directo a `/admin` sin haber iniciado sesión antes en la app, la sección de usuarios mostrará "No se pudieron cargar los usuarios".
<!-- TODO: unificar ambos sistemas de login (que el login del backoffice también autentique con Passport, o que /api/users acepte session.isAdmin) -->

## Google OAuth — URIs autorizadas

En Google Cloud Console configura:

- **Origen JavaScript autorizado:** `http://localhost:5173`
- **URI de redireccionamiento autorizado:** `http://localhost:5173/auth/google/callback`

## API — Endpoints principales

- **Autenticación**
  - `GET /auth/google?role=alumno|profesor` -> inicia login o registro con Google según el rol elegido
  - `GET /auth/google/callback` -> callback OAuth
  - `POST /auth/local/register` -> crea cuenta normal con email/password y rol `alumno` o `profesor`
  - `POST /auth/local/login` -> inicia sesion con cuenta normal
  - `POST /auth/demo-login` -> inicia sesion con usuario demo
  - `GET /auth/logout` -> cerrar sesion

- **Admin backoffice**
  - `POST /api/admin/login` → login con credenciales del `.env`
  - `POST /api/admin/logout`
  - `GET /api/admin/me`

- **Cursos**
  - `GET /api/courses`
  - `POST /api/courses` (profesor/admin)
  - `PUT /api/courses/:id` (propietario/admin)
  - `DELETE /api/courses/:id` (propietario/admin)

- **Lecciones**
  - `GET /api/courses/:courseId/lessons`
  - `POST /api/courses/:courseId/lessons` (propietario)

- **Tests / Preguntas / Resultados**
  - `GET /api/tests`
  - `POST /api/courses/:courseId/tests` (propietario)
  - `POST /api/tests/:testId/submit`

- **Usuarios**
  - `GET /api/users`
  - `PUT /api/users/:id`
  - `DELETE /api/users/:id`

## Changelog

### `refactor-ui`

#### Routing y Layout
- **Rutas anidadas con `<Outlet />`** — `Layout` migrado de `children` a `<Outlet />` de React Router. `ProtectedLayout` envuelve todas las rutas autenticadas y redirige a `/login` si no hay sesión.
- **`/admin` fuera del `ProtectedLayout`** — Corregido bug por el que navegar a `/admin` sin sesión OAuth redirigía al login de usuario en lugar de mostrar el login del backoffice.
- **Separación de vistas por rol en `/courses/:id`** — Renderiza `CourseDetailTeacher` para profesores/admins y `CourseDetailPage` para alumnos.

#### `useAuth`
- **Instancia única** — `useAuth()` solo se llama en `App.jsx`. El `user` y `logout` se pasan como props a `Layout` y `Header`, eliminando el parpadeo causado por múltiples instancias con estado independiente.
- **Bucle infinito corregido** — El `useEffect` tenía `[user]` como dependencia, provocando re-fetch continuo. Corregido a `[]`.
- **Logout simplificado** — Eliminado `redirect()` (solo válido en loaders/actions). `setUser(null)` provoca que `ProtectedLayout` redirija automáticamente.

#### Header
- Rediseñado con iconos de `lucide-react`.
- Recibe `user` y `logout` como props en lugar de llamar a `useAuth()` directamente.

#### Backoffice (`/admin`)
- **Rediseño completo** — tema oscuro (`#0f172a`), sidebar fijo, topbar, tabla de usuarios con buscador en tiempo real y 4 tarjetas de estadísticas calculadas dinámicamente (Total, Alumnos, Profesores, Admins).
- **Componentizado** en ficheros independientes dentro de `pages/admin/`: `AdminLogin`, `AdminSidebar`, `AdminTopbar`, `StatCard`, `UsersSection` (con `UserRow` interno).

---

## Producción

```bash
npm run client:build
npm -w edutech run start
```

## Despliegue (Neon + Render)

El proyecto se despliega como un **único Web Service en Render**: Express sirve tanto la API (`/api/*`, `/auth/*`) como el build estático de React (`apps/client/dist`), ya que `apps/backend/app.js` ya contempla ese modo cuando `NODE_ENV=production`. La base de datos vive en **Neon** (PostgreSQL serverless).

**Build Command:**
```bash
npm install --include=dev && npm run build
```

> Con `NODE_ENV=production` puesto (necesario para que Express sirva el build de React), `npm install` por defecto **omite** las `devDependencies` — y ahí vive `vite`, imprescindible para compilar el frontend. `--include=dev` fuerza a instalarlas igualmente durante el build, sin afectar al arranque en producción.

**Start Command:**
```bash
npm start
```

**Variables de entorno a configurar en Render:**

| Variable | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Connection string de Neon (incluye `sslmode=require`) |
| `DB_SSL` | `true` |
| `SESSION_SECRET` | Un secreto largo y aleatorio |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credenciales de Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | `https://<tu-app>.onrender.com/auth/google/callback` (el callback real se calcula en tiempo de ejecución, pero la variable debe existir para activar el login con Google) |
| `CLIENT_ORIGIN` | `https://<tu-app>.onrender.com` |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Credenciales del backoffice |

`PORT` no hace falta definirla, Render la inyecta automáticamente.

**Base de datos en Neon:** crea el esquema y los datos demo ejecutando, en este orden, contra la connection string de Neon:

```bash
psql "postgresql://usuario:password@host/basededatos?sslmode=require" -f apps/backend/database/elearning_platform.sql
psql "postgresql://usuario:password@host/basededatos?sslmode=require" -f edutech_cursos_ejercicios.sql
```

**Google Cloud Console:** añade la URL de Render a los orígenes y redirecciones autorizadas (ver sección "Google OAuth — URIs autorizadas" más abajo, sustituyendo `localhost:5173` por el dominio de Render).

## Scripts disponibles (raíz)

| Script | Descripción |
|---|---|
| `npm run dev` | Arranca backend + frontend en paralelo |
| `npm run server` | Solo el backend (nodemon) |
| `npm run client:dev` | Solo el frontend (Vite) |
| `npm run client:build` | Build de producción del frontend |
| `npm run client:start` | Preview del build de producción |
