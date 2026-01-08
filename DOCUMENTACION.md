# Proyecto Digital Money House - Documentación

## Objetivos del Proyecto

Crear una aplicación web de billetera virtual llamada Digital Money House que permita a los usuarios:

1. Registrarse e iniciar sesión de forma segura
2. Gestionar medios de pago (tarjetas de crédito/débito)
3. Cargar saldo en su billetera virtual
4. Pagar servicios usando saldo o tarjetas
5. Consultar el historial de transacciones
6. Tener una CVU (Cuenta Virtual Uniforme) única

## Planificación y Backlog

### Sprint 1: Autenticación y Landing (Semana 1-2)

- [x] Configuración inicial del proyecto Next.js con TypeScript
- [x] Página de inicio (Landing page)
- [x] Formulario de registro con validaciones
- [x] Formulario de login
- [x] Sistema de autenticación con JWT
- [x] Integración con API de Digital House
- [x] Deployment en Vercel

### Sprint 2: Perfil y Gestión de Medios de Pago (Semana 3-4)

- [x] Página "Mi Perfil" con datos del usuario
- [ ] Edición de datos del perfil
- [ ] Página de gestión de tarjetas
- [ ] Agregar tarjetas de crédito/débito
- [ ] Eliminar tarjetas
- [ ] Página de ingreso de dinero
- [ ] Integración con medios de pago

### Sprint 3: Dashboard y Pagos (Semana 5-6)

- [x] Dashboard con saldo disponible
- [ ] Mostrar últimos movimientos en dashboard
- [ ] Lista de servicios disponibles
- [ ] Selección y pago de servicios
- [ ] Comprobante de pago
- [ ] Validación de saldo suficiente

### Sprint 4: Actividad y Filtros (Semana 7-8)

- [ ] Página de actividad completa
- [ ] Listado de todas las transacciones
- [ ] Filtros por fecha
- [ ] Filtros por tipo de transacción
- [ ] Búsqueda de transacciones
- [ ] Paginación

## Stack Tecnológico

- **Frontend**: Next.js 14+ con App Router
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules responsive
- **Estado**: Context API (AuthContext, UserContext)
- **API**: REST API de Digital House
- **Deployment**: Vercel
- **Control de versiones**: Git/GitLab

## Estructura del Proyecto

```
digital-money-house/
├── app/                      # App Router de Next.js
│   ├── layout.tsx           # Layout principal con providers
│   ├── page.tsx             # Landing page
│   ├── login/               # Página de login
│   ├── register/            # Página de registro
│   ├── dashboard/           # Dashboard del usuario
│   ├── profile/             # Perfil del usuario
│   ├── cards/               # Gestión de tarjetas
│   ├── add-money/           # Ingresar dinero
│   ├── activity/            # Actividad/movimientos
│   └── pay-services/        # Pagar servicios
├── components/              # Componentes reutilizables
│   ├── Header/
│   ├── Footer/
│   ├── Button/
│   ├── Input/
│   └── Card/
├── context/                 # Contextos de React
│   ├── AuthContext.tsx
│   └── UserContext.tsx
├── services/                # Servicios de API
│   ├── apiClient.ts
│   ├── authService.ts
│   ├── userService.ts
│   ├── cardService.ts
│   ├── transactionService.ts
│   └── serviceService.ts
├── types/                   # Tipos TypeScript
│   └── index.ts
├── utils/                   # Utilidades y validaciones
│   └── validations.ts
├── middleware.ts            # Middleware de autenticación
└── public/                  # Archivos estáticos
```

## Funcionalidades Implementadas

### Sprint 1 ✅

- ✅ Landing page responsiva con información de servicios
- ✅ Registro de usuarios con validaciones
- ✅ Login con JWT
- ✅ Context API para autenticación y usuario
- ✅ Middleware para protección de rutas
- ✅ Header responsive con navegación
- ✅ Footer
- ✅ Componentes reutilizables (Button, Input, Card)
- ✅ Integración con API de Digital House
- ✅ Configuración para deployment en Vercel

### Sprint 2 (En progreso)

- ✅ Página de perfil con datos del usuario
- 🔄 Edición de perfil
- 🔄 Gestión de tarjetas
- 🔄 Ingreso de dinero

## Testing

### Casos de Prueba Implementados

1. Validación de email en formularios
2. Validación de contraseña (mínimo 8 caracteres, mayúscula, número)
3. Validación de DNI (7-8 dígitos)
4. Validación de teléfono (10 dígitos)
5. Validación de coincidencia de contraseñas
6. Manejo de errores de API
7. Redirección después de login exitoso
8. Protección de rutas privadas

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Crear archivo de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm start
```

## Deployment en Vercel

El proyecto está configurado para deployment automático en Vercel:

1. Conectar repositorio de GitLab/GitHub a Vercel
2. Configurar variables de entorno:
   - `NEXT_PUBLIC_API_URL=https://digitalmoney.digitalhouse.com`
3. Deploy automático en cada push a main

## API Endpoints Utilizados

- `POST /api/users` - Registro de usuario
- `POST /api/login` - Inicio de sesión
- `GET /api/users/:id` - Obtener datos de usuario
- `PATCH /api/users/:id` - Actualizar usuario
- `GET /api/account/:id` - Obtener cuenta
- `GET /api/account/:id/cards` - Listar tarjetas
- `POST /api/account/:id/cards` - Agregar tarjeta
- `DELETE /api/account/:id/cards/:cardId` - Eliminar tarjeta
- `GET /api/account/:id/transactions` - Listar transacciones
- `POST /api/account/:id/deposits` - Depositar dinero
- `GET /api/service` - Listar servicios
- `POST /api/account/:id/transferences` - Pagar servicio

## Lecciones Aprendidas

1. **Next.js App Router**: Migrar de Pages Router a App Router requiere entender bien el concepto de Server Components y Client Components
2. **TypeScript**: La tipificación estricta ayuda a prevenir errores y mejora la experiencia de desarrollo
3. **Context API**: Para aplicaciones medianas, Context API es suficiente sin necesidad de Redux
4. **CSS Modules**: Permiten scope local de estilos evitando conflictos
5. **Validaciones**: Es importante validar tanto en cliente como en servidor
6. **Middleware de Next.js**: Permite proteger rutas de forma eficiente sin duplicar código

## Próximos Pasos

1. Completar funcionalidad de edición de perfil
2. Implementar gestión completa de tarjetas
3. Crear flujo de ingreso de dinero
4. Desarrollar sistema de pago de servicios
5. Implementar filtros en actividad
6. Agregar tests automatizados con Jest/Testing Library
7. Mejorar accesibilidad (a11y)
8. Optimizar rendimiento con lazy loading
9. Agregar modo oscuro

## Autor

Proyecto desarrollado como parte del desafío Digital Money House

## Fecha

Enero 2026
