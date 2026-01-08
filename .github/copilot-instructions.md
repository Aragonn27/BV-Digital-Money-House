# Digital Money House - Copilot Instructions

## Proyecto
Aplicación web de billetera virtual Digital Money House usando Next.js 14+ con App Router y TypeScript.

## Stack Tecnológico
- Framework: Next.js 14+ con App Router
- Lenguaje: TypeScript
- Estilos: CSS Modules responsive
- API Backend: https://digitalmoney.digitalhouse.com/swagger/index.html
- Deployment: Vercel

## Estructura del Proyecto
- `/app`: Páginas con App Router
- `/components`: Componentes reutilizables
- `/services`: Capa de servicios para API
- `/types`: Interfaces TypeScript
- `/utils`: Validaciones y helpers
- `/context`: Contextos de React (Auth, User)
- `/middleware.ts`: Protección de rutas

## Páginas Principales
- Landing page (/)
- Registro (/register)
- Login (/login)
- Dashboard (/dashboard)
- Perfil (/profile)
- Gestión de tarjetas (/cards)
- Ingresar dinero (/add-money)
- Actividad (/activity)
- Pagar servicios (/pay-services)

## Autenticación
- JWT token almacenado en localStorage/cookies
- Middleware para rutas protegidas
- Context API para estado global de usuario

## Validaciones
- Formularios con validación client-side
- Manejo de errores de API
- Testing con casos de prueba

## Sprints
- Sprint 1: Landing, Registro, Login (deployado en Vercel)
- Sprint 2: Perfil, Tarjetas, Ingresar dinero
- Sprint 3: Dashboard, Pagar servicios, Comprobantes
- Sprint 4: Actividad con filtros
