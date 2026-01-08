# Plan de Pruebas - Digital Money House

## Sprint 1: Testing & Calidad

---

## 1. ¿Cómo escribir un caso de prueba?

Un caso de prueba debe seguir la siguiente estructura:

### Estructura de un Caso de Prueba:

| Campo                  | Descripción                                       |
| ---------------------- | ------------------------------------------------- |
| **ID**                 | Identificador único (ej: TC-001)                  |
| **Título**             | Descripción breve y clara del caso                |
| **Precondiciones**     | Estado del sistema antes de ejecutar la prueba    |
| **Pasos**              | Secuencia numerada de acciones a realizar         |
| **Datos de Entrada**   | Valores específicos a utilizar                    |
| **Resultado Esperado** | Comportamiento esperado del sistema               |
| **Resultado Actual**   | Lo que realmente ocurre (se completa al ejecutar) |
| **Estado**             | Pasó / Falló / Bloqueado                          |
| **Prioridad**          | Alta / Media / Baja                               |
| **Tipo**               | Funcional / No Funcional / Regresión              |

### Ejemplo de Caso de Prueba:

```
ID: TC-LOGIN-001
Título: Verificar login exitoso con credenciales válidas
Precondiciones:
  - Usuario registrado en el sistema
  - Usuario no está logueado
Pasos:
  1. Navegar a /login
  2. Ingresar email válido
  3. Click en "Continuar"
  4. Ingresar contraseña correcta
  5. Click en "Ingresar"
Datos de Entrada:
  - Email: usuario@test.com
  - Password: Test1234
Resultado Esperado:
  - Usuario redirigido a /dashboard
  - Token guardado en localStorage
  - Header muestra opciones de usuario logueado
Estado: Pasó
Prioridad: Alta
Tipo: Funcional
```

---

## 2. ¿Cómo reportar un defecto?

### Estructura de un Reporte de Defecto:

| Campo                     | Descripción                                         |
| ------------------------- | --------------------------------------------------- |
| **ID**                    | Identificador único del defecto (ej: BUG-001)       |
| **Título**                | Resumen claro del problema                          |
| **Severidad**             | Crítica / Alta / Media / Baja                       |
| **Prioridad**             | Urgente / Alta / Media / Baja                       |
| **Estado**                | Nuevo / Asignado / En Progreso / Resuelto / Cerrado |
| **Ambiente**              | Desarrollo / QA / Producción                        |
| **Navegador/Dispositivo** | Chrome 120, Firefox 119, Mobile iOS, etc.           |
| **Pasos para Reproducir** | Secuencia detallada de pasos                        |
| **Resultado Esperado**    | Comportamiento correcto                             |
| **Resultado Actual**      | Comportamiento erróneo observado                    |
| **Evidencia**             | Screenshots, videos, logs                           |
| **Asignado a**            | Desarrollador responsable                           |

### Niveles de Severidad:

- **Crítica**: Sistema no funciona, bloquea funcionalidad principal
- **Alta**: Funcionalidad importante no trabaja correctamente
- **Media**: Funcionalidad menor afectada, hay workaround
- **Baja**: Cosmético, no afecta funcionalidad

### Ejemplo de Reporte de Defecto:

```
ID: BUG-001
Título: El logout no redirecciona a la página principal
Severidad: Media
Prioridad: Alta
Estado: Resuelto
Ambiente: Desarrollo
Navegador: Chrome 120
Pasos para Reproducir:
  1. Login con usuario válido
  2. Click en "Cerrar Sesión" en el header
Resultado Esperado:
  - Usuario redirigido a landing page (/)
  - Token eliminado de localStorage
Resultado Actual:
  - Usuario redirigido a /login en lugar de /
Evidencia: [screenshot adjunto]
Asignado a: Frontend Dev
```

---

## 3. Criterio para Suite de Smoke Test

### ¿Qué es Smoke Testing?

Pruebas básicas para verificar que las funcionalidades críticas del sistema funcionan. Se ejecutan después de cada build.

### Criterios de inclusión:

✅ **Incluir en Smoke Test si:**

- Es una funcionalidad crítica del sistema
- Bloquea el uso de otras funcionalidades
- Se ejecuta en menos de 5 minutos
- Cubre el flujo principal (happy path)
- Es estable y no cambia frecuentemente
- Verifica que el build es testeable

### Casos que DEBEN estar en Smoke Test - Sprint 1:

1. ✅ **TC-SMOKE-001**: Acceso a landing page
2. ✅ **TC-SMOKE-002**: Navegación a página de registro
3. ✅ **TC-SMOKE-003**: Navegación a página de login
4. ✅ **TC-SMOKE-004**: Registro exitoso de usuario
5. ✅ **TC-SMOKE-005**: Login exitoso (paso 1: email)
6. ✅ **TC-SMOKE-006**: Login exitoso (paso 2: contraseña)
7. ✅ **TC-SMOKE-007**: Redirección a dashboard después de login
8. ✅ **TC-SMOKE-008**: Logout exitoso

---

## 4. Criterio para Suite de Regression Test

### ¿Qué es Regression Testing?

Pruebas completas para verificar que cambios nuevos no rompieron funcionalidades existentes.

### Criterios de inclusión:

✅ **Incluir en Regression Test si:**

- Cubre funcionalidad existente que debe seguir funcionando
- Prueba casos edge y negativos
- Valida integraciones entre módulos
- Incluye todos los casos de Smoke Test
- Prueba validaciones y manejo de errores
- Verifica compatibilidad (navegadores, dispositivos)

### Estructura de Suite de Regresión:

```
Suite de Regresión = Smoke Test + Casos Adicionales
```

---

## 5. Casos de Prueba - Sprint 1

### 5.1 Landing Page

| ID          | Título                                              | Prioridad | Suite      |
| ----------- | --------------------------------------------------- | --------- | ---------- |
| TC-LAND-001 | Verificar carga de landing page                     | Alta      | Smoke      |
| TC-LAND-002 | Verificar botón "Crear Cuenta" redirige a /register | Alta      | Smoke      |
| TC-LAND-003 | Verificar botón "Iniciar Sesión" redirige a /login  | Alta      | Smoke      |
| TC-LAND-004 | Verificar visualización de beneficios del producto  | Media     | Regression |
| TC-LAND-005 | Verificar responsividad en mobile (< 768px)         | Media     | Regression |
| TC-LAND-006 | Verificar responsividad en tablet (768px - 1024px)  | Media     | Regression |
| TC-LAND-007 | Verificar responsividad en desktop (> 1024px)       | Media     | Regression |

### 5.2 Registro de Usuario

| ID         | Título                                               | Prioridad | Suite      |
| ---------- | ---------------------------------------------------- | --------- | ---------- |
| TC-REG-001 | Registro exitoso con datos válidos                   | Alta      | Smoke      |
| TC-REG-002 | Redirección a /login después de registro exitoso     | Alta      | Smoke      |
| TC-REG-003 | Validación de campo email requerido                  | Alta      | Regression |
| TC-REG-004 | Validación de formato de email inválido              | Alta      | Regression |
| TC-REG-005 | Validación de contraseña requerida                   | Alta      | Regression |
| TC-REG-006 | Validación de contraseña débil (sin mayúscula)       | Alta      | Regression |
| TC-REG-007 | Validación de contraseña débil (sin número)          | Alta      | Regression |
| TC-REG-008 | Validación de contraseña débil (< 8 caracteres)      | Alta      | Regression |
| TC-REG-009 | Validación de confirmación de contraseña no coincide | Alta      | Regression |
| TC-REG-010 | Validación de DNI requerido                          | Media     | Regression |
| TC-REG-011 | Validación de DNI inválido (< 7 dígitos)             | Media     | Regression |
| TC-REG-012 | Validación de DNI inválido (> 8 dígitos)             | Media     | Regression |
| TC-REG-013 | Validación de teléfono requerido                     | Media     | Regression |
| TC-REG-014 | Validación de teléfono inválido (≠ 10 dígitos)       | Media     | Regression |
| TC-REG-015 | Validación de nombre requerido                       | Alta      | Regression |
| TC-REG-016 | Validación de apellido requerido                     | Alta      | Regression |
| TC-REG-017 | Mensaje de error cuando email ya existe              | Alta      | Regression |
| TC-REG-018 | Link "Inicia sesión aquí" redirige a /login          | Media     | Regression |
| TC-REG-019 | Formulario responsivo en mobile                      | Media     | Regression |
| TC-REG-020 | Deshabilitar botón mientras procesa registro         | Media     | Regression |

### 5.3 Login (Dos Pasos)

| ID         | Título                                            | Prioridad | Suite      |
| ---------- | ------------------------------------------------- | --------- | ---------- |
| TC-LOG-001 | Login exitoso - Paso 1: email válido              | Alta      | Smoke      |
| TC-LOG-002 | Login exitoso - Paso 2: contraseña válida         | Alta      | Smoke      |
| TC-LOG-003 | Redirección a /dashboard después de login exitoso | Alta      | Smoke      |
| TC-LOG-004 | Token guardado en localStorage después de login   | Alta      | Smoke      |
| TC-LOG-005 | Validación email requerido en paso 1              | Alta      | Regression |
| TC-LOG-006 | Validación formato email inválido en paso 1       | Alta      | Regression |
| TC-LOG-007 | Botón "Continuar" avanza al paso 2                | Alta      | Regression |
| TC-LOG-008 | Display de email en paso 2                        | Media     | Regression |
| TC-LOG-009 | Botón "Cambiar" regresa al paso 1                 | Media     | Regression |
| TC-LOG-010 | Validación contraseña requerida en paso 2         | Alta      | Regression |
| TC-LOG-011 | Mensaje de error con credenciales incorrectas     | Alta      | Regression |
| TC-LOG-012 | Link "Regístrate aquí" redirige a /register       | Media     | Regression |
| TC-LOG-013 | Deshabilitar botón mientras procesa login         | Media     | Regression |
| TC-LOG-014 | Formulario responsivo en mobile                   | Media     | Regression |
| TC-LOG-015 | Focus automático en campo email (paso 1)          | Baja      | Regression |
| TC-LOG-016 | Focus automático en campo password (paso 2)       | Baja      | Regression |

### 5.4 Logout

| ID         | Título                                               | Prioridad | Suite      |
| ---------- | ---------------------------------------------------- | --------- | ---------- |
| TC-OUT-001 | Logout exitoso redirige a landing page (/)           | Alta      | Smoke      |
| TC-OUT-002 | Token eliminado de localStorage después de logout    | Alta      | Smoke      |
| TC-OUT-003 | Datos de usuario eliminados de localStorage          | Alta      | Regression |
| TC-OUT-004 | Datos de cuenta eliminados de localStorage           | Alta      | Regression |
| TC-OUT-005 | Header muestra opciones de usuario no logueado       | Media     | Regression |
| TC-OUT-006 | Acceso denegado a rutas protegidas después de logout | Alta      | Regression |

### 5.5 Persistencia de Sesión

| ID          | Título                                                 | Prioridad | Suite      |
| ----------- | ------------------------------------------------------ | --------- | ---------- |
| TC-PERS-001 | Sesión persiste al recargar navegador                  | Alta      | Regression |
| TC-PERS-002 | Usuario sigue logueado después de cerrar/abrir pestaña | Alta      | Regression |
| TC-PERS-003 | Token válido permite acceso a rutas protegidas         | Alta      | Regression |

### 5.6 Rutas Protegidas (Middleware)

| ID         | Título                                                            | Prioridad | Suite      |
| ---------- | ----------------------------------------------------------------- | --------- | ---------- |
| TC-MID-001 | Redirigir a /login cuando usuario no logueado accede a /dashboard | Alta      | Regression |
| TC-MID-002 | Redirigir a /login cuando usuario no logueado accede a /profile   | Alta      | Regression |
| TC-MID-003 | Redirigir a /dashboard cuando usuario logueado accede a /login    | Media     | Regression |
| TC-MID-004 | Redirigir a /dashboard cuando usuario logueado accede a /register | Media     | Regression |

### 5.7 Responsividad

| ID          | Título                                         | Prioridad | Suite      |
| ----------- | ---------------------------------------------- | --------- | ---------- |
| TC-RESP-001 | Layout responsive en iPhone 12 (390x844)       | Alta      | Regression |
| TC-RESP-002 | Layout responsive en iPad (768x1024)           | Media     | Regression |
| TC-RESP-003 | Layout responsive en Desktop HD (1920x1080)    | Media     | Regression |
| TC-RESP-004 | Menu hamburguesa visible en mobile             | Media     | Regression |
| TC-RESP-005 | Navegación funcional en todas las resoluciones | Alta      | Regression |

---

## 6. Suite de Smoke Test - Resumen

**Total de casos:** 8  
**Tiempo estimado de ejecución:** 10 minutos

1. TC-LAND-001: Acceso a landing page
2. TC-LAND-002: Navegación a registro
3. TC-LAND-003: Navegación a login
4. TC-REG-001: Registro exitoso
5. TC-LOG-001: Login paso 1 exitoso
6. TC-LOG-002: Login paso 2 exitoso
7. TC-LOG-003: Redirección a dashboard
8. TC-OUT-001: Logout exitoso

**Criterio de aceptación:**  
✅ Todos los casos deben PASAR para considerar el build como estable.

---

## 7. Suite de Regression Test - Resumen

**Total de casos:** 67  
**Tiempo estimado de ejecución:** 2-3 horas

Incluye:

- 8 casos de Smoke Test
- 7 casos de Landing Page
- 20 casos de Registro
- 16 casos de Login
- 6 casos de Logout
- 3 casos de Persistencia
- 4 casos de Middleware
- 5 casos de Responsividad

**Criterio de aceptación:**  
✅ Mínimo 95% de casos deben PASAR  
⚠️ Ningún defecto crítico puede estar abierto

---

## 8. Ambientes de Prueba

| Ambiente   | URL                             | Propósito                          |
| ---------- | ------------------------------- | ---------------------------------- |
| Desarrollo | http://localhost:3000           | Testing durante desarrollo         |
| QA         | https://dmh-qa.vercel.app       | Testing formal antes de producción |
| Producción | https://digitalmoney.vercel.app | Testing post-deployment            |

---

## 9. Navegadores y Dispositivos

### Navegadores Desktop:

- Chrome 120+ ✅ (Prioritario)
- Firefox 119+ ✅
- Safari 17+ ⚠️ (Secundario)
- Edge 120+ ⚠️ (Secundario)

### Dispositivos Mobile:

- iPhone 12/13/14 ✅ (iOS Safari)
- Samsung Galaxy S21+ ✅ (Chrome Android)
- iPad Air ⚠️ (iOS Safari)

---

## 10. Próximos Pasos

- [ ] Ejecutar suite de Smoke Test
- [ ] Documentar resultados en planilla de casos de prueba
- [ ] Reportar defectos encontrados
- [ ] Ejecutar suite de Regression Test
- [ ] Generar reporte de cobertura de pruebas
- [ ] Subir planilla a GitLab

---

**Fecha de creación:** Enero 8, 2026  
**Versión:** 1.0  
**Sprint:** 1  
**Responsable QA:** [Nombre del QA]
