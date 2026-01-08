# Infraestructura - Digital Money House

## Sprint 1: Diseño y Configuración

---

## 1. Herramientas Necesarias para Funcionamiento Local

### 1.1 Requisitos del Sistema

| Herramienta | Versión Mínima | Propósito                      |
| ----------- | -------------- | ------------------------------ |
| **Node.js** | 18.17.0+       | Runtime de JavaScript          |
| **npm**     | 9.0.0+         | Gestor de paquetes             |
| **Git**     | 2.40.0+        | Control de versiones           |
| **Docker**  | 24.0.0+        | Contenedorización (opcional)   |
| **VS Code** | 1.85.0+        | Editor de código (recomendado) |

### 1.2 Instalación Local

```bash
# 1. Clonar repositorio
git clone https://gitlab.com/tu-usuario/digital-money-house.git
cd digital-money-house

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Ejecutar en modo desarrollo
npm run dev

# Aplicación disponible en: http://localhost:3000
```

### 1.3 Docker (Opcional)

Para ejecutar la aplicación en un contenedor Docker:

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependencias
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build de la aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Imagen de producción
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: "3.8"

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://digitalmoney.digitalhouse.com
    restart: unless-stopped
    networks:
      - dmh-network

networks:
  dmh-network:
    driver: bridge
```

```bash
# Comandos Docker
docker-compose up -d          # Iniciar contenedor
docker-compose down           # Detener contenedor
docker-compose logs -f        # Ver logs
```

---

## 2. Arquitectura del Sistema

### 2.1 Arquitectura de Microservicios

```
┌─────────────────────────────────────────────────────────────┐
│                    DIGITAL MONEY HOUSE                       │
│                   Arquitectura de Sistema                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   USUARIOS/CLIENTES  │
│  (Web, Mobile, App)  │
└──────────┬───────────┘
           │
           │ HTTPS
           │
┌──────────▼───────────────────────────────────────────────────┐
│                         FRONTEND                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Next.js 14 Application (Vercel)               │   │
│  │  - App Router                                         │   │
│  │  - React Components                                   │   │
│  │  - Client-side Routing                                │   │
│  │  - SSR/SSG                                            │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬───────────────────────────────────────────────────┘
           │
           │ REST API (HTTPS)
           │
┌──────────▼───────────────────────────────────────────────────┐
│                    API GATEWAY / BACKEND                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │   Digital House API (digitalmoney.digitalhouse.com)   │   │
│  │                                                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │   Auth      │  │   Users     │  │  Accounts   │ │   │
│  │  │  Service    │  │  Service    │  │   Service   │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  │                                                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │  │   Cards     │  │Transactions │  │  Services   │ │   │
│  │  │  Service    │  │  Service    │  │   Service   │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬───────────────────────────────────────────────────┘
           │
           │ Database Connections
           │
┌──────────▼───────────────────────────────────────────────────┐
│                        BASE DE DATOS                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL / MySQL Database              │   │
│  │                                                        │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │   Users   │  │ Accounts  │  │   Cards   │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘        │   │
│  │                                                        │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │Transactions│ │ Services  │  │   Logs    │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘        │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos

```
Usuario → Frontend (Next.js) → API Gateway → Microservicios → Base de Datos
   ↑                                                                  │
   └──────────────────── Respuesta ←──────────────────────────────────┘
```

---

## 3. Diseño de Red y Componentes

### 3.1 Diagrama de Red

```
┌────────────────────────────────────────────────────────────────────┐
│                           INTERNET                                  │
└────────────────────┬───────────────────────────────────────────────┘
                     │
                     │ HTTPS (443)
                     │
┌────────────────────▼───────────────────────────────────────────────┐
│                      CLOUDFLARE CDN                                 │
│                   (DNS, SSL, DDoS Protection)                       │
└────────────────────┬───────────────────────────────────────────────┘
                     │
     ┌───────────────┴───────────────┐
     │                               │
     │                               │
┌────▼──────────────┐   ┌───────────▼────────────┐
│   VERCEL EDGE     │   │   AWS CLOUD            │
│   (Frontend)      │   │   (Backend)            │
│                   │   │                        │
│ ┌───────────────┐ │   │ ┌────────────────────┐│
│ │  Next.js App  │ │   │ │   API Gateway      ││
│ │  (SSR/SSG)    │ │   │ │   (Load Balancer)  ││
│ └───────────────┘ │   │ └─────────┬──────────┘│
│                   │   │           │            │
│ Regions:          │   │           │            │
│ - us-east-1       │   │  ┌────────▼──────────┐│
│ - sa-east-1       │   │  │  VPC (Private)    ││
└───────────────────┘   │  │  10.0.0.0/16      ││
                        │  │                    ││
                        │  │ ┌────────────────┐││
                        │  │ │  Subnet Public │││
                        │  │ │  10.0.1.0/24   │││
                        │  │ │                │││
                        │  │ │ ┌────────────┐│││
                        │  │ │ │ Services   ││││
                        │  │ │ │ Containers ││││
                        │  │ │ └────────────┘│││
                        │  │ └────────────────┘││
                        │  │                    ││
                        │  │ ┌────────────────┐││
                        │  │ │ Subnet Private ││││
                        │  │ │ 10.0.2.0/24    │││
                        │  │ │                │││
                        │  │ │ ┌────────────┐│││
                        │  │ │ │   RDS      ││││
                        │  │ │ │ PostgreSQL ││││
                        │  │ │ └────────────┘│││
                        │  │ └────────────────┘││
                        │  └────────────────────┘│
                        └────────────────────────┘
```

### 3.2 Componentes del Sistema

#### **FRONTEND (Vercel)**

```
┌─────────────────────────────────────┐
│         VERCEL PLATFORM             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Next.js Application       │   │
│  │   - App Router              │   │
│  │   - API Routes              │   │
│  │   - Static Assets           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Edge Functions            │   │
│  │   - Middleware              │   │
│  │   - Authentication          │   │
│  └─────────────────────────────┘   │
│                                     │
│  Storage:                           │
│  - Vercel KV (Redis)                │
│  - Vercel Blob (S3-like)            │
└─────────────────────────────────────┘
```

#### **BACKEND (AWS / Digital House)**

```
┌─────────────────────────────────────┐
│         AWS INFRASTRUCTURE          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Application Load Balancer │   │
│  │   - SSL Termination         │   │
│  │   - Health Checks           │   │
│  └────────────┬────────────────┘   │
│               │                     │
│  ┌────────────▼────────────────┐   │
│  │   ECS Cluster               │   │
│  │   (Fargate)                 │   │
│  │                             │   │
│  │  ┌─────────┐  ┌─────────┐  │   │
│  │  │Auth API │  │User API │  │   │
│  │  │Service  │  │Service  │  │   │
│  │  └─────────┘  └─────────┘  │   │
│  │                             │   │
│  │  ┌─────────┐  ┌─────────┐  │   │
│  │  │Card API │  │Trans API│  │   │
│  │  │Service  │  │Service  │  │   │
│  │  └─────────┘  └─────────┘  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Amazon RDS                │   │
│  │   - PostgreSQL 14           │   │
│  │   - Multi-AZ                │   │
│  │   - Automated Backups       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Amazon S3                 │   │
│  │   - Static Files            │   │
│  │   - Document Storage        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   CloudWatch                │   │
│  │   - Logs                    │   │
│  │   - Metrics                 │   │
│  │   - Alarms                  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### **BASE DE DATOS**

```
┌─────────────────────────────────────┐
│         DATABASE LAYER              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Primary Database          │   │
│  │   PostgreSQL 14             │   │
│  │   Instance: db.t3.medium    │   │
│  │   Storage: 100GB SSD        │   │
│  │   Connections: 100 max      │   │
│  └─────────────────────────────┘   │
│               │                     │
│               │ Replication         │
│               ▼                     │
│  ┌─────────────────────────────┐   │
│  │   Replica Database          │   │
│  │   (Read-only)               │   │
│  │   For Analytics & Reports   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Schemas:                           │
│  - users                            │
│  - accounts                         │
│  - cards                            │
│  - transactions                     │
│  - services                         │
│  - audit_logs                       │
└─────────────────────────────────────┘
```

---

## 4. Seguridad

### 4.1 Capas de Seguridad

```
┌─────────────────────────────────────────┐
│  Layer 1: CDN & DDoS Protection         │
│  - Cloudflare                           │
│  - Rate Limiting                        │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  Layer 2: SSL/TLS Encryption            │
│  - HTTPS Only                           │
│  - TLS 1.3                              │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  Layer 3: Application Security          │
│  - JWT Authentication                   │
│  - CORS Configuration                   │
│  - XSS Protection                       │
│  - CSRF Tokens                          │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  Layer 4: Network Security              │
│  - VPC with Private Subnets             │
│  - Security Groups                      │
│  - NACLs                                │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  Layer 5: Data Security                 │
│  - Encryption at Rest                   │
│  - Encryption in Transit                │
│  - Database Access Control              │
│  - Audit Logs                           │
└─────────────────────────────────────────┘
```

### 4.2 Variables de Entorno

```bash
# .env.local (Frontend)
NEXT_PUBLIC_API_URL=https://digitalmoney.digitalhouse.com

# Backend (Ejemplo)
DATABASE_URL=postgresql://user:pass@host:5432/dmh
JWT_SECRET=super-secret-key-change-in-production
API_KEY=digital-house-api-key
REDIS_URL=redis://localhost:6379
```

---

## 5. Monitoreo y Logging

### 5.1 Stack de Monitoreo

```
┌─────────────────────────────────────────┐
│           MONITORING STACK              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Vercel Analytics                 │ │
│  │  - Performance Metrics            │ │
│  │  - Core Web Vitals                │ │
│  │  - Real User Monitoring           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  AWS CloudWatch                   │ │
│  │  - Application Logs               │ │
│  │  - Infrastructure Metrics         │ │
│  │  - Custom Metrics                 │ │
│  │  - Alarms & Notifications         │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Error Tracking (Opcional)        │ │
│  │  - Sentry                         │ │
│  │  - Error Reporting                │ │
│  │  - Performance Monitoring         │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 5.2 Métricas Clave

| Métrica              | Threshold | Acción         |
| -------------------- | --------- | -------------- |
| CPU Usage            | > 80%     | Auto-scaling   |
| Memory Usage         | > 85%     | Auto-scaling   |
| API Response Time    | > 2s      | Alerta         |
| Error Rate           | > 5%      | Alerta crítica |
| Database Connections | > 90      | Alerta         |

---

## 6. Escalabilidad

### 6.1 Estrategia de Auto-Scaling

**Frontend (Vercel):**

- Auto-scaling automático
- Edge functions en múltiples regiones
- CDN global

**Backend:**

```yaml
Auto-Scaling Configuration:
  Min Instances: 2
  Max Instances: 10
  Target CPU: 70%
  Scale Up: +2 instances when CPU > 70% for 2 min
  Scale Down: -1 instance when CPU < 30% for 5 min
```

### 6.2 Load Balancing

```
                    Internet
                        │
                        ▼
              ┌─────────────────┐
              │ Load Balancer   │
              │ (Round Robin)   │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │Instance│    │Instance│    │Instance│
   │   1    │    │   2    │    │   3    │
   └────────┘    └────────┘    └────────┘
```

---

## 7. Backup y Recuperación

### 7.1 Estrategia de Backup

```
┌──────────────────────────────────────┐
│        BACKUP STRATEGY               │
│                                      │
│  Database:                           │
│  - Automated daily backups           │
│  - Retention: 30 days                │
│  - Point-in-time recovery            │
│                                      │
│  Application Code:                   │
│  - Git repository (GitLab)           │
│  - Branch protection                 │
│  - Tagged releases                   │
│                                      │
│  Environment Config:                 │
│  - Infrastructure as Code            │
│  - Terraform/CloudFormation          │
│  - Version controlled                │
└──────────────────────────────────────┘
```

### 7.2 Disaster Recovery

| Escenario             | RTO     | RPO    | Estrategia                    |
| --------------------- | ------- | ------ | ----------------------------- |
| Database Failure      | 1 hora  | 5 min  | Restore from automated backup |
| Region Outage         | 2 horas | 15 min | Failover to secondary region  |
| Code Deployment Issue | 15 min  | 0      | Rollback to previous version  |

---

## 8. CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                            │
└─────────────────────────────────────────────────────────────┘

Developer Push
      │
      ▼
┌──────────────┐
│  Git Push    │
│  to main     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  GitLab CI           │
│  1. Lint Code        │
│  2. Run Tests        │
│  3. Build            │
│  4. Security Scan    │
└──────┬───────────────┘
       │
       │ ✅ Passed
       ▼
┌──────────────────────┐
│  Vercel Deploy       │
│  1. Build Next.js    │
│  2. Deploy to Edge   │
│  3. Run E2E Tests    │
└──────┬───────────────┘
       │
       │ ✅ Success
       ▼
┌──────────────────────┐
│  Production Live ✓   │
└──────────────────────┘
```

---

## 9. Costos Estimados (Mensual)

| Servicio   | Costo Estimado   | Notas                |
| ---------- | ---------------- | -------------------- |
| Vercel Pro | $20              | Frontend hosting     |
| AWS ECS    | $50-100          | Backend containers   |
| AWS RDS    | $30-60           | Database             |
| AWS S3     | $5-10            | Storage              |
| CloudWatch | $10-20           | Monitoring           |
| Cloudflare | $0-20            | CDN/Security         |
| **TOTAL**  | **$115-230/mes** | Escala según tráfico |

---

## 10. Próximos Pasos

- [ ] Configurar pipeline CI/CD en GitLab
- [ ] Implementar monitoreo con CloudWatch
- [ ] Configurar auto-scaling policies
- [ ] Implementar estrategia de backup
- [ ] Documentar runbooks operacionales
- [ ] Configurar alertas y notificaciones
- [ ] Realizar pruebas de carga
- [ ] Implementar disaster recovery plan

---

**Fecha:** Enero 8, 2026  
**Versión:** 1.0  
**Responsable Infraestructura:** [Nombre]
