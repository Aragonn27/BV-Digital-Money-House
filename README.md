# Digital Money House

Aplicación web de billetera virtual desarrollada con Next.js 14+, TypeScript y CSS Modules.

## Stack Tecnológico

- **Framework**: Next.js 14+ con App Router
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules responsive
- **API Backend**: https://digitalmoney.digitalhouse.com/swagger/index.html
- **Deployment**: Vercel

## Estructura del Proyecto

```
├── app/                 # Páginas con App Router
├── components/          # Componentes reutilizables
├── services/           # Capa de servicios para API
├── types/              # Interfaces TypeScript
├── utils/              # Validaciones y helpers
├── context/            # Contextos de React (Auth, User)
├── middleware.ts       # Protección de rutas
└── public/             # Archivos estáticos
```

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env.local` basado en `.env.example`:

```bash
cp .env.example .env.local
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Build

```bash
npm run build
npm start
```

## Funcionalidades

### Sprint 1

- ✅ Landing page
- ✅ Registro de usuario
- ✅ Login
- ✅ Cierre de sesión

### Sprint 2

- 🔄 Perfil de usuario (Mi Perfil)
- 🔄 Gestión de medios de pago
- 🔄 Ingreso de dinero a la billetera

### Sprint 3

- 🔄 Dashboard con saldo y últimos movimientos
- 🔄 Pago de servicios
- 🔄 Comprobantes de pago

### Sprint 4

- 🔄 Actividad del usuario con filtros

## Deployment

El proyecto está configurado para deployment automático en Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/digital-money-house)
