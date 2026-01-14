# Digital Money House 💰

Aplicación web de billetera virtual completa desarrollada con Next.js 14+, TypeScript y CSS Modules. Permite a los usuarios gestionar su dinero de forma digital con funcionalidades de depósito, pago de servicios, transferencias y más.

## 🚀 Estado del Proyecto

**✅ PROYECTO COMPLETADO - Todos los Sprints Finalizados**

| Sprint   | Estado      | Funcionalidades                    |
| -------- | ----------- | ---------------------------------- |
| Sprint 1 | ✅ Completo | Landing, Registro, Login           |
| Sprint 2 | ✅ Completo | Perfil, Tarjetas, Ingresar dinero  |
| Sprint 3 | ✅ Completo | Dashboard, Actividad, Comprobantes |
| Sprint 4 | ✅ Completo | Pago de servicios, Docker          |

**Total:** 20 páginas, 18 componentes, 6 servicios API, 337 casos de prueba

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ con App Router
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules responsive (Mobile-first)
- **Estado Global**: Context API (AuthContext, UserContext)
- **API Backend**: [Digital Money House API](https://digitalmoney.digitalhouse.com/swagger/index.html)
- **Generación PDF**: jsPDF
- **Deployment**: Vercel
- **Containerización**: Docker & Docker Compose

---

## 📁 Estructura del Proyecto

```
digital-money-house/
├── app/                        # Páginas con App Router
│   ├── page.tsx               # Landing page
│   ├── login/                 # Login (2 pasos)
│   ├── register/              # Registro de usuario
│   ├── dashboard/             # Dashboard principal
│   ├── profile/               # Perfil de usuario
│   ├── cards/                 # Gestión de tarjetas
│   │   └── add/              # Agregar tarjeta
│   ├── deposit/               # Ingresar dinero
│   │   ├── account/          # Ver CVU/Alias
│   │   └── [id]/             # Depositar con tarjeta
│   ├── activity/              # Actividad y transacciones
│   │   └── [id]/             # Detalle de transacción
│   └── pay-services/          # Pagar servicios
│       └── [id]/             # Flujo de pago
│           ├── payment/      # Selección medio de pago
│           ├── confirm/      # Confirmación
│           └── success/      # Resultado
├── components/                # Componentes reutilizables
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   ├── Header/
│   ├── Footer/
│   └── Sidebar/
├── context/                   # Contextos de React
│   ├── AuthContext.tsx       # Autenticación
│   └── UserContext.tsx       # Usuario y cuenta
├── services/                  # Capa de servicios API
│   ├── apiClient.ts          # Cliente HTTP base
│   ├── authService.ts        # Login, registro, cuenta
│   ├── userService.ts        # Información de usuario
│   ├── cardService.ts        # Gestión de tarjetas
│   ├── transactionService.ts # Transacciones y actividad
│   └── serviceService.ts     # Servicios a pagar
├── types/                     # Interfaces TypeScript
│   └── index.ts              # Todos los tipos
├── utils/                     # Validaciones y helpers
│   └── validations.ts        # Funciones de validación
├── middleware.ts              # Protección de rutas
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Orquestación Docker
└── public/                    # Archivos estáticos
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/digital-money-house.git
cd digital-money-house

# Instalar dependencias
npm install
```

### Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_API_URL=https://digitalmoney.digitalhouse.com
```

---

## 💻 Desarrollo

```bash
# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linter
npm run lint
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🐳 Docker

### Build y Run con Docker

```bash
# Build de la imagen
docker build -t digital-money-house .

# Run con Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

La aplicación estará disponible en `http://localhost:3000`

### Health Check

Endpoint de salud disponible en: `http://localhost:3000/api/health`

---

## ✨ Funcionalidades Implementadas

### 🏠 Sprint 1 - Autenticación y Landing

#### Landing Page (/)

- ✅ Hero section con CTAs
- ✅ 6 tarjetas de beneficios
- ✅ Sección informativa
- ✅ Diseño responsive completo
- ✅ Links a registro y login

#### Registro (/register)

- ✅ Formulario con 7 campos validados
- ✅ Validaciones client-side:
  - Email formato válido
  - Contraseña (mín 8 chars, mayúscula, número)
  - DNI (7-8 dígitos)
  - Teléfono (10 dígitos)
  - Confirmación de contraseña
- ✅ Integración con API
- ✅ Manejo de errores
- ✅ Redirección a login

#### Login (/login)

- ✅ **Paso 1**: Ingresar email con validación
- ✅ **Paso 2**: Ingresar contraseña
- ✅ Botón "Cambiar email"
- ✅ Autenticación JWT
- ✅ Detección de sesión anterior
- ✅ Opción de limpiar sesión
- ✅ Redirección a dashboard

#### Logout

- ✅ Botón en header
- ✅ Limpieza de token y datos
- ✅ Limpieza de cookies
- ✅ Redirección a landing

#### Middleware

- ✅ Protección de rutas privadas
- ✅ Verificación de token JWT
- ✅ Redirección automática

---

### 👤 Sprint 2 - Perfil y Medios de Pago

#### Perfil de Usuario (/profile)

- ✅ Visualización de datos personales
- ✅ Avatar con inicial del nombre
- ✅ Edición de perfil:
  - Nombre y apellido
  - DNI
  - Teléfono
  - Contraseña
- ✅ Validaciones completas
- ✅ Actualización en tiempo real
- ✅ Mensajes de éxito/error

#### Gestión de Tarjetas (/cards)

- ✅ Lista de tarjetas registradas
- ✅ Auto-detección de tipo (Visa, Mastercard, AMEX)
- ✅ Número enmascarado (•••• 1234)
- ✅ Agregar nueva tarjeta (/cards/add):
  - Número de tarjeta (16 dígitos)
  - Nombre del titular
  - Fecha de vencimiento
  - CVV (3-4 dígitos)
- ✅ Validación de tarjetas
- ✅ Eliminar tarjeta con confirmación
- ✅ Integración completa con API

#### Ingresar Dinero (/deposit)

- ✅ **Opción 1**: Transferencia bancaria
  - Ver CVU y Alias
  - Copiar al portapapeles
  - Instrucciones claras
- ✅ **Opción 2**: Con tarjeta de débito/crédito
  - Selección de tarjeta
  - Ingreso de monto
  - Validaciones (min $100, max $1,000,000)
  - Procesamiento del depósito
  - Actualización de saldo
- ✅ Pantalla de éxito con detalles

---

### 📊 Sprint 3 - Dashboard y Actividad

#### Dashboard Mejorado (/dashboard)

- ✅ Saludo personalizado
- ✅ Saldo disponible en tiempo real
- ✅ CVU y Alias con botón copiar
- ✅ Últimas 10 transacciones
- ✅ Diferenciación visual por tipo:
  - 💰 Depósitos (verde)
  - 💳 Pagos (rojo)
  - 🔄 Transferencias (azul)
- ✅ Buscador de transacciones
- ✅ Link a actividad completa
- ✅ Refresh automático

#### Actividad Completa (/activity)

- ✅ Listado completo de transacciones
- ✅ Paginación (10 por página)
- ✅ Filtros avanzados:
  - Por tipo de operación
  - Por rango de fechas
  - Por monto (mín/máx)
  - Búsqueda por descripción
- ✅ Aplicación de filtros en tiempo real
- ✅ Contador de resultados
- ✅ Botón limpiar filtros
- ✅ Click para ver detalle

#### Detalle de Transacción (/activity/[id])

- ✅ Información completa:
  - ID, tipo, monto, descripción
  - Fecha y hora
  - Estado (aprobada/pendiente/rechazada)
  - Origen y destino
  - Número de referencia
- ✅ Badge de estado visual
- ✅ Descargar comprobante PDF
- ✅ Imprimir comprobante
- ✅ Navegación fluida

#### Comprobantes

- ✅ Visualización profesional
- ✅ Generación de PDF con jsPDF
- ✅ Logo y branding Digital Money House
- ✅ Todos los detalles incluidos
- ✅ Impresión optimizada
- ✅ Nombre de archivo descriptivo

---

### 💳 Sprint 4 - Pago de Servicios

#### Lista de Servicios (/pay-services)

- ✅ Visualización de todos los servicios
- ✅ Buscador por nombre de servicio
- ✅ Búsqueda case-insensitive
- ✅ Contador de resultados
- ✅ Click para seleccionar servicio

#### Flujo de Pago Completo

**1. Número de Cuenta (/pay-services/[id])**

- ✅ Formulario de número de cuenta
- ✅ Validación: mínimo 8 caracteres
- ✅ Validación: no termina en "00"
- ✅ Mensajes de error claros
- ✅ Información del servicio visible

**2. Medio de Pago (/pay-services/[id]/payment)**

- ✅ Opción "Dinero en cuenta" con saldo
- ✅ Lista de tarjetas disponibles
- ✅ Botón agregar tarjeta
- ✅ Selección visual del método
- ✅ Solo pago con dinero en cuenta habilitado

**3. Confirmación (/pay-services/[id]/confirm)**

- ✅ Resumen completo de la transacción
- ✅ Validación de fondos suficientes
- ✅ Cálculo de saldo restante
- ✅ Mensaje de error si fondos insuficientes
- ✅ Botón deshabilitado sin fondos
- ✅ Procesamiento con API

**4. Resultado (/pay-services/[id]/success)**

- ✅ Pantalla de éxito
- ✅ Badge "APROBADA"
- ✅ Monto pagado destacado
- ✅ Detalles completos
- ✅ Nuevo saldo actualizado
- ✅ Descargar comprobante PDF
- ✅ Imprimir comprobante
- ✅ Navegación a Dashboard o Nuevo Pago

#### Comprobante de Pago

- ✅ Header verde con logo
- ✅ Estado "APROBADA"
- ✅ Monto en verde
- ✅ Todos los datos de la transacción
- ✅ Servicio, número de cuenta, medio de pago
- ✅ Fecha, hora, CVU
- ✅ Footer con timestamp
- ✅ Descarga en PDF

---

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Token almacenado en localStorage y cookies
- ✅ Middleware de protección de rutas
- ✅ Validación client-side y server-side
- ✅ Sanitización de inputs
- ✅ Manejo seguro de datos sensibles
- ✅ HTTPS en producción
- ✅ Docker con usuario no-root

---

## 📱 Responsive Design

La aplicación es completamente responsive con diseño mobile-first:

- **Mobile** (320px - 767px): Diseño optimizado para móviles
- **Tablet** (768px - 1023px): Layout adaptado
- **Desktop** (1024px+): Experiencia completa de escritorio

---

## 🧪 Testing y Calidad

### Casos de Prueba Documentados

| Sprint   | Smoke Test | Regression | Total | Acumulado |
| -------- | ---------- | ---------- | ----- | --------- |
| Sprint 1 | 15         | 52         | 67    | 67        |
| Sprint 2 | 22         | 58         | 80    | 147       |
| Sprint 3 | 25         | 80         | 105   | 252       |
| Sprint 4 | 20         | 65         | 85    | **337**   |

**Total del Proyecto: 337 casos de prueba**

### Documentación de Testing

- ✅ Plan de Pruebas completo (PLAN_DE_PRUEBAS.md)
- ✅ Casos de prueba detallados por sprint
- ✅ Smoke tests para cada funcionalidad
- ✅ Regression tests acumulativos
- ✅ Testing exploratorio estructurado
- ✅ QA Sign Off template

---

## 📚 Documentación

- [README.md](README.md) - Este archivo
- [DOCUMENTACION.md](DOCUMENTACION.md) - Documentación técnica completa
- [PLAN_DE_PRUEBAS.md](PLAN_DE_PRUEBAS.md) - Plan de pruebas y casos
- [RESUMEN_SPRINT1.md](RESUMEN_SPRINT1.md) - Resumen Sprint 1
- [RESUMEN_SPRINT2.md](RESUMEN_SPRINT2.md) - Resumen Sprint 2
- [RESUMEN_SPRINT3.md](RESUMEN_SPRINT3.md) - Resumen Sprint 3
- [RESUMEN_SPRINT4.md](RESUMEN_SPRINT4.md) - Resumen Sprint 4
- [INFRAESTRUCTURA.md](INFRAESTRUCTURA.md) - Configuración Docker y deployment

---

## 🚀 Deployment

### Vercel (Producción)

El proyecto está configurado para deployment automático en Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/digital-money-house)

- ✅ Deploy automático desde main/master
- ✅ Preview deployments para PRs
- ✅ Variables de entorno configuradas
- ✅ Build optimizado con Next.js standalone

### Docker (Alternativo)

También puedes deployar usando Docker:

```bash
# Build y push a registry
docker build -t digital-money-house .
docker tag digital-money-house your-registry/digital-money-house
docker push your-registry/digital-money-house

# Deploy en tu servidor
docker pull your-registry/digital-money-house
docker run -d -p 3000:3000 digital-money-house
```

### AWS ECS/Fargate (Preparado)

El proyecto está listo para deployment en AWS:

1. Push de imagen a AWS ECR
2. Crear task definition en ECS
3. Configurar Application Load Balancer
4. Deploy en Fargate
5. Configurar health checks
6. Agregar CloudWatch logs

---

## 🎯 Características Técnicas

### Context API

- **AuthContext**: Manejo de autenticación

  - Login/Logout
  - Estado de autenticación
  - Gestión de token
  - Loading states

- **UserContext**: Información de usuario
  - Datos del usuario
  - Información de cuenta
  - Refresh de datos
  - Persistencia en localStorage

### Servicios API

Capa de abstracción para comunicación con la API:

- **apiClient**: Cliente HTTP base con interceptores
- **authService**: Autenticación y cuenta
- **userService**: Información de usuario
- **cardService**: Gestión de tarjetas
- **transactionService**: Transacciones y actividad
- **serviceService**: Servicios a pagar

### Validaciones

Funciones de validación reutilizables:

- Email formato válido
- Contraseña segura (8+ chars, mayúscula, número)
- DNI (7-8 dígitos)
- Teléfono (10 dígitos)
- Número de tarjeta (16 dígitos, Luhn algorithm)
- Fecha de vencimiento
- CVV (3-4 dígitos)
- Montos (min/max)

---

## 🏆 Logros del Proyecto

### Funcionalidades

- ✅ 20 páginas implementadas
- ✅ 18 componentes reutilizables
- ✅ 6 servicios API
- ✅ Sistema completo de autenticación
- ✅ Gestión completa de tarjetas
- ✅ Múltiples métodos de ingreso de dinero
- ✅ Pago de servicios end-to-end
- ✅ Actividad con filtros avanzados
- ✅ Comprobantes descargables e imprimibles

### Calidad

- ✅ 337 casos de prueba documentados
- ✅ Testing exploratorio estructurado
- ✅ Validaciones exhaustivas
- ✅ Manejo robusto de errores
- ✅ UX/UI consistente

### Infraestructura

- ✅ Dockerización completa
- ✅ Health checks implementados
- ✅ Preparado para la nube
- ✅ CI/CD con Vercel
- ✅ Imagen optimizada (~150MB)

---

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es parte del curso de Digital House.

---

## 📞 Soporte

Para preguntas o soporte:

- Email: soporte@digitalmoney.com
- Documentación: Ver archivos .md en el repositorio

---

## 🎓 Créditos

Desarrollado como proyecto final del curso de Digital House - Full Stack Web Development.

**Tecnologías principales:**

- Next.js 14+
- TypeScript
- React 18
- CSS Modules
- Docker

---

**Estado del Proyecto: ✅ COMPLETADO AL 100%**

**Última actualización: Enero 14, 2026**
