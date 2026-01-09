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

## 8. Casos de Prueba - Sprint 2

### 8.1 Mi Perfil - Visualización de Datos

| ID         | Título                           | Prioridad | Suite      |
| ---------- | -------------------------------- | --------- | ---------- |
| TC-PRF-001 | Acceso a página de perfil        | Alta      | Smoke      |
| TC-PRF-002 | Visualización de nombre completo | Alta      | Smoke      |
| TC-PRF-003 | Visualización de email           | Alta      | Smoke      |
| TC-PRF-004 | Visualización de DNI             | Alta      | Regression |
| TC-PRF-005 | Visualización de teléfono        | Alta      | Regression |
| TC-PRF-006 | Visualización de CVU             | Alta      | Smoke      |
| TC-PRF-007 | Visualización de Alias           | Alta      | Smoke      |
| TC-PRF-008 | Contraseña oculta (**\*\*\*\***) | Media     | Regression |

### 8.2 Mi Perfil - Edición de Datos Personales

| ID         | Título                                       | Prioridad | Suite      |
| ---------- | -------------------------------------------- | --------- | ---------- |
| TC-PRF-009 | Botón "Editar Datos" muestra formulario      | Alta      | Smoke      |
| TC-PRF-010 | Actualizar nombre exitosamente               | Alta      | Smoke      |
| TC-PRF-011 | Actualizar apellido exitosamente             | Alta      | Smoke      |
| TC-PRF-012 | Actualizar teléfono exitosamente             | Alta      | Smoke      |
| TC-PRF-013 | Validación nombre requerido                  | Alta      | Regression |
| TC-PRF-014 | Validación apellido requerido                | Alta      | Regression |
| TC-PRF-015 | Botón "Cancelar" cancela edición             | Media     | Regression |
| TC-PRF-016 | Botón "Cancelar" restaura valores originales | Media     | Regression |
| TC-PRF-017 | Mensaje de éxito al actualizar datos         | Media     | Regression |
| TC-PRF-018 | Datos actualizados visibles sin refrescar    | Alta      | Regression |
| TC-PRF-019 | Manejo de error al fallar actualización      | Alta      | Regression |

### 8.3 Mi Perfil - Edición de Alias

| ID         | Título                                           | Prioridad | Suite      |
| ---------- | ------------------------------------------------ | --------- | ---------- |
| TC-PRF-020 | Botón "Editar Alias" muestra formulario          | Alta      | Smoke      |
| TC-PRF-021 | Actualizar alias exitosamente                    | Alta      | Smoke      |
| TC-PRF-022 | Validación formato X.X.X (3 palabras con puntos) | Alta      | Regression |
| TC-PRF-023 | Validación alias con menos de 3 partes           | Alta      | Regression |
| TC-PRF-024 | Validación alias sin puntos                      | Alta      | Regression |
| TC-PRF-025 | Mensaje de éxito al actualizar alias             | Media     | Regression |
| TC-PRF-026 | Botón cancelar en edición de alias               | Media     | Regression |

### 8.4 Mi Perfil - Copiar CVU y Alias

| ID         | Título                                    | Prioridad | Suite      |
| ---------- | ----------------------------------------- | --------- | ---------- |
| TC-PRF-027 | Botón copiar CVU funciona correctamente   | Alta      | Smoke      |
| TC-PRF-028 | Botón copiar Alias funciona correctamente | Alta      | Smoke      |
| TC-PRF-029 | Mensaje confirmación al copiar CVU        | Media     | Regression |
| TC-PRF-030 | Mensaje confirmación al copiar Alias      | Media     | Regression |

### 8.5 Gestión de Tarjetas - Listado

| ID         | Título                                          | Prioridad | Suite      |
| ---------- | ----------------------------------------------- | --------- | ---------- |
| TC-CRD-001 | Acceso a página de gestión de tarjetas          | Alta      | Smoke      |
| TC-CRD-002 | Visualización de lista de tarjetas              | Alta      | Smoke      |
| TC-CRD-003 | Mostrar últimos 4 dígitos enmascarados          | Alta      | Smoke      |
| TC-CRD-004 | Visualización de tipo de tarjeta (Visa/MC/AMEX) | Alta      | Regression |
| TC-CRD-005 | Visualización de nombre en tarjeta              | Media     | Regression |
| TC-CRD-006 | Visualización de fecha de vencimiento           | Media     | Regression |
| TC-CRD-007 | Contador de tarjetas (X / 10)                   | Media     | Regression |
| TC-CRD-008 | Mensaje cuando no hay tarjetas                  | Media     | Regression |
| TC-CRD-009 | Botón "Alta de Tarjeta" visible                 | Alta      | Smoke      |

### 8.6 Gestión de Tarjetas - Agregar Tarjeta

| ID         | Título                                          | Prioridad | Suite      |
| ---------- | ----------------------------------------------- | --------- | ---------- |
| TC-CRD-010 | Navegación a página de alta de tarjeta          | Alta      | Smoke      |
| TC-CRD-011 | Agregar tarjeta Visa exitosamente               | Alta      | Smoke      |
| TC-CRD-012 | Agregar tarjeta Mastercard exitosamente         | Alta      | Smoke      |
| TC-CRD-013 | Detección automática tipo Visa (empieza con 4)  | Alta      | Regression |
| TC-CRD-014 | Detección automática tipo Mastercard (51-55)    | Alta      | Regression |
| TC-CRD-015 | Detección automática tipo AMEX (34 o 37)        | Media     | Regression |
| TC-CRD-016 | Validación número de tarjeta requerido          | Alta      | Regression |
| TC-CRD-017 | Validación número debe tener 13-19 dígitos      | Alta      | Regression |
| TC-CRD-018 | Validación solo números en campo de tarjeta     | Alta      | Regression |
| TC-CRD-019 | Validación nombre en tarjeta requerido          | Alta      | Regression |
| TC-CRD-020 | Validación nombre mínimo 3 caracteres           | Alta      | Regression |
| TC-CRD-021 | Validación CVV requerido                        | Alta      | Regression |
| TC-CRD-022 | Validación CVV 3-4 dígitos                      | Alta      | Regression |
| TC-CRD-023 | Validación fecha vencimiento requerida          | Alta      | Regression |
| TC-CRD-024 | Validación formato fecha MM/YYYY                | Alta      | Regression |
| TC-CRD-025 | Validación año debe empezar con 20XX            | Alta      | Regression |
| TC-CRD-026 | Formato automático de fecha (12/2025)           | Media     | Regression |
| TC-CRD-027 | Nombre en tarjeta se convierte a mayúsculas     | Media     | Regression |
| TC-CRD-028 | Botón "Volver" regresa a lista de tarjetas      | Media     | Regression |
| TC-CRD-029 | Botón submit deshabilitado durante envío        | Media     | Regression |
| TC-CRD-030 | Mensaje de éxito al agregar tarjeta             | Media     | Regression |
| TC-CRD-031 | Redirección a lista después de agregar          | Alta      | Regression |
| TC-CRD-032 | Tarjeta agregada visible en lista               | Alta      | Regression |
| TC-CRD-033 | Límite máximo de 10 tarjetas                    | Alta      | Regression |
| TC-CRD-034 | Mensaje de error al intentar agregar tarjeta 11 | Alta      | Regression |

### 8.7 Gestión de Tarjetas - Eliminar Tarjeta

| ID         | Título                                   | Prioridad | Suite      |
| ---------- | ---------------------------------------- | --------- | ---------- |
| TC-CRD-035 | Botón eliminar tarjeta visible           | Alta      | Smoke      |
| TC-CRD-036 | Confirmación antes de eliminar tarjeta   | Alta      | Smoke      |
| TC-CRD-037 | Cancelar eliminación mantiene tarjeta    | Media     | Regression |
| TC-CRD-038 | Eliminar tarjeta exitosamente            | Alta      | Smoke      |
| TC-CRD-039 | Tarjeta eliminada no aparece en lista    | Alta      | Regression |
| TC-CRD-040 | Mensaje de éxito al eliminar tarjeta     | Media     | Regression |
| TC-CRD-041 | Contador actualizado después de eliminar | Media     | Regression |
| TC-CRD-042 | Manejo de error al fallar eliminación    | Alta      | Regression |

### 8.8 Responsividad - Sprint 2

| ID         | Título                                          | Prioridad | Suite      |
| ---------- | ----------------------------------------------- | --------- | ---------- |
| TC-RES-008 | Página de perfil responsiva en mobile           | Media     | Regression |
| TC-RES-009 | Página de tarjetas responsiva en mobile         | Media     | Regression |
| TC-RES-010 | Formulario agregar tarjeta responsivo en mobile | Media     | Regression |
| TC-RES-011 | Formulario editar perfil responsivo en mobile   | Media     | Regression |

---

## 9. Suite de Smoke Test Sprint 2 - Resumen

**Total de casos:** 22  
**Tiempo estimado de ejecución:** 15 minutos

### Épica: Mi Perfil (12 casos)

1. TC-PRF-001: Acceso a perfil
2. TC-PRF-002: Ver nombre
3. TC-PRF-003: Ver email
4. TC-PRF-006: Ver CVU
5. TC-PRF-007: Ver Alias
6. TC-PRF-009: Botón editar datos
7. TC-PRF-010: Actualizar nombre
8. TC-PRF-011: Actualizar apellido
9. TC-PRF-012: Actualizar teléfono
10. TC-PRF-020: Botón editar alias
11. TC-PRF-021: Actualizar alias
12. TC-PRF-027: Copiar CVU

### Épica: Gestión de Tarjetas (10 casos)

13. TC-CRD-001: Acceso a gestión de tarjetas
14. TC-CRD-002: Ver lista de tarjetas
15. TC-CRD-003: Enmascaramiento de número
16. TC-CRD-009: Botón alta de tarjeta
17. TC-CRD-010: Navegación a alta
18. TC-CRD-011: Agregar tarjeta Visa
19. TC-CRD-012: Agregar tarjeta Mastercard
20. TC-CRD-035: Botón eliminar visible
21. TC-CRD-036: Confirmación eliminar
22. TC-CRD-038: Eliminar tarjeta exitosamente

**Criterio de aceptación:**  
✅ Todos los casos deben PASAR para considerar Sprint 2 como completo.

---

## 10. Suite de Regression Test Sprint 2 - Resumen

**Total de casos Sprint 2:** 80  
**Tiempo estimado de ejecución:** 3-4 horas

Incluye:

- 22 casos de Smoke Test Sprint 2
- 30 casos de Mi Perfil (visualización, edición, CVU/Alias)
- 42 casos de Gestión de Tarjetas (listado, agregar, eliminar)
- 4 casos de Responsividad
- 4 casos de Integración

**Criterio de aceptación:**  
✅ Mínimo 95% de casos deben PASAR  
⚠️ Ningún defecto crítico puede estar abierto  
✅ Todos los Smoke Tests deben PASAR

---

**Fecha de creación:** Enero 8, 2026  
**Última actualización:** Enero 9, 2026 (Sprint 2 y 3)  
**Versión:** 3.0  
**Sprint:** 2 y 3  
**Responsable QA:** [Nombre del QA]

---

## 11. Casos de Prueba - Sprint 3

### 11.1 Ingreso de Dinero - Selección de Método

| ID         | Título                                                 | Prioridad | Suite      |
| ---------- | ------------------------------------------------------ | --------- | ---------- |
| TC-DEP-001 | Verificar acceso a página de depósito                  | Alta      | Smoke      |
| TC-DEP-002 | Verificar visualización de tarjetas disponibles        | Alta      | Smoke      |
| TC-DEP-003 | Verificar visualización de opción CVU/Alias            | Alta      | Smoke      |
| TC-DEP-004 | Click en tarjeta redirige a página de monto            | Alta      | Smoke      |
| TC-DEP-005 | Click en CVU redirige a página de datos de cuenta      | Alta      | Smoke      |
| TC-DEP-006 | Mensaje cuando no hay tarjetas registradas             | Media     | Regression |
| TC-DEP-007 | Visualización correcta de últimos 4 dígitos de tarjeta | Media     | Regression |
| TC-DEP-008 | Visualización correcta de tipo de tarjeta (Visa/MC)    | Media     | Regression |

### 11.2 Ingreso de Dinero - Depósito con Tarjeta

| ID         | Título                                            | Prioridad | Suite      |
| ---------- | ------------------------------------------------- | --------- | ---------- |
| TC-DEP-009 | Ingreso de monto válido ($100-$1.000.000)         | Alta      | Smoke      |
| TC-DEP-010 | Visualización de pantalla de confirmación         | Alta      | Smoke      |
| TC-DEP-011 | Confirmación exitosa del depósito                 | Alta      | Smoke      |
| TC-DEP-012 | Redirección a página de éxito                     | Alta      | Smoke      |
| TC-DEP-013 | Validación monto mínimo ($100)                    | Alta      | Regression |
| TC-DEP-014 | Validación monto máximo ($1.000.000)              | Alta      | Regression |
| TC-DEP-015 | Validación monto requerido                        | Alta      | Regression |
| TC-DEP-016 | Validación monto con formato inválido (letras)    | Alta      | Regression |
| TC-DEP-017 | Botón volver desde confirmación cancela operación | Media     | Regression |
| TC-DEP-018 | Deshabilitar botón mientras procesa depósito      | Media     | Regression |
| TC-DEP-019 | Manejo de error cuando depósito falla             | Alta      | Regression |
| TC-DEP-020 | Manejo de error 401 (sesión expirada)             | Alta      | Regression |

### 11.3 Ingreso de Dinero - CVU y Alias

| ID         | Título                                          | Prioridad | Suite      |
| ---------- | ----------------------------------------------- | --------- | ---------- |
| TC-DEP-021 | Visualización correcta de CVU de la cuenta      | Alta      | Smoke      |
| TC-DEP-022 | Visualización correcta de Alias de la cuenta    | Alta      | Smoke      |
| TC-DEP-023 | Funcionalidad copiar CVU al portapapeles        | Alta      | Smoke      |
| TC-DEP-024 | Funcionalidad copiar Alias al portapapeles      | Alta      | Smoke      |
| TC-DEP-025 | Mensaje de confirmación al copiar CVU           | Media     | Regression |
| TC-DEP-026 | Mensaje de confirmación al copiar Alias         | Media     | Regression |
| TC-DEP-027 | Visualización de instrucciones de transferencia | Media     | Regression |

### 11.4 Ingreso de Dinero - Página de Éxito

| ID         | Título                                             | Prioridad | Suite      |
| ---------- | -------------------------------------------------- | --------- | ---------- |
| TC-DEP-028 | Visualización de monto cargado                     | Alta      | Smoke      |
| TC-DEP-029 | Visualización de origen del depósito               | Alta      | Smoke      |
| TC-DEP-030 | Visualización de fecha y hora del depósito         | Media     | Regression |
| TC-DEP-031 | Botón "Ir al inicio" redirige a dashboard          | Alta      | Smoke      |
| TC-DEP-032 | Botón "Nueva carga" redirige a selección de método | Media     | Regression |
| TC-DEP-033 | Actualización automática de saldo en dashboard     | Alta      | Smoke      |

### 11.5 Mi Actividad - Listado y Filtros

| ID         | Título                                                  | Prioridad | Suite      |
| ---------- | ------------------------------------------------------- | --------- | ---------- |
| TC-ACT-001 | Visualización de lista de transacciones                 | Alta      | Smoke      |
| TC-ACT-002 | Filtro por período: Hoy                                 | Alta      | Smoke      |
| TC-ACT-003 | Filtro por período: Ayer                                | Alta      | Regression |
| TC-ACT-004 | Filtro por período: Última semana                       | Alta      | Regression |
| TC-ACT-005 | Filtro por período: Últimos 15 días                     | Media     | Regression |
| TC-ACT-006 | Filtro por período: Último mes                          | Alta      | Regression |
| TC-ACT-007 | Filtro por período: Últimos 3 meses                     | Media     | Regression |
| TC-ACT-008 | Filtro por tipo: Ingresos                               | Alta      | Smoke      |
| TC-ACT-009 | Filtro por tipo: Pagos                                  | Alta      | Regression |
| TC-ACT-010 | Filtro por tipo: Transferencias                         | Alta      | Regression |
| TC-ACT-011 | Filtro por monto: $0 - $1.000                           | Media     | Regression |
| TC-ACT-012 | Filtro por monto: $1.000 - $5.000                       | Media     | Regression |
| TC-ACT-013 | Filtro por monto: $5.000 - $20.000                      | Media     | Regression |
| TC-ACT-014 | Filtro por monto: $20.000 - $100.000                    | Media     | Regression |
| TC-ACT-015 | Filtro por monto: Más de $100.000                       | Media     | Regression |
| TC-ACT-016 | Combinación de múltiples filtros                        | Alta      | Smoke      |
| TC-ACT-017 | Búsqueda por palabra clave en descripción               | Alta      | Regression |
| TC-ACT-018 | Búsqueda por palabra clave en origen                    | Media     | Regression |
| TC-ACT-019 | Búsqueda por palabra clave en destino                   | Media     | Regression |
| TC-ACT-020 | Botón limpiar filtros restaura vista completa           | Alta      | Smoke      |
| TC-ACT-021 | Visualización de contador de transacciones filtradas    | Media     | Regression |
| TC-ACT-022 | Mensaje cuando no hay resultados para filtros aplicados | Media     | Regression |

### 11.6 Mi Actividad - Paginación

| ID         | Título                                          | Prioridad | Suite      |
| ---------- | ----------------------------------------------- | --------- | ---------- |
| TC-ACT-023 | Visualización de 10 transacciones por página    | Alta      | Smoke      |
| TC-ACT-024 | Navegación a página siguiente                   | Alta      | Smoke      |
| TC-ACT-025 | Navegación a página anterior                    | Alta      | Regression |
| TC-ACT-026 | Navegación a página específica                  | Media     | Regression |
| TC-ACT-027 | Deshabilitar botón "Anterior" en primera página | Media     | Regression |
| TC-ACT-028 | Deshabilitar botón "Siguiente" en última página | Media     | Regression |
| TC-ACT-029 | Indicador de página actual visible              | Media     | Regression |
| TC-ACT-030 | Paginación se actualiza al aplicar filtros      | Alta      | Regression |

### 11.7 Mi Actividad - Detalle de Transacción

| ID         | Título                                       | Prioridad | Suite      |
| ---------- | -------------------------------------------- | --------- | ---------- |
| TC-ACT-031 | Click en transacción abre página de detalle  | Alta      | Smoke      |
| TC-ACT-032 | Visualización de número de operación         | Alta      | Smoke      |
| TC-ACT-033 | Visualización de fecha y hora de transacción | Alta      | Smoke      |
| TC-ACT-034 | Visualización de monto con formato correcto  | Alta      | Smoke      |
| TC-ACT-035 | Visualización de descripción de transacción  | Alta      | Regression |
| TC-ACT-036 | Visualización de origen (cuando aplica)      | Media     | Regression |
| TC-ACT-037 | Visualización de destino (cuando aplica)     | Media     | Regression |
| TC-ACT-038 | Color verde para ingresos                    | Media     | Regression |
| TC-ACT-039 | Color naranja para egresos                   | Media     | Regression |
| TC-ACT-040 | Icono correcto según tipo de transacción     | Baja      | Regression |
| TC-ACT-041 | Botón volver regresa a lista de actividad    | Media     | Regression |

### 11.8 Mi Actividad - Comprobantes

| ID         | Título                                           | Prioridad | Suite      |
| ---------- | ------------------------------------------------ | --------- | ---------- |
| TC-ACT-042 | Botón descargar comprobante genera archivo PDF   | Alta      | Smoke      |
| TC-ACT-043 | PDF contiene encabezado con logo y nombre        | Alta      | Smoke      |
| TC-ACT-044 | PDF contiene todos los datos de la transacción   | Alta      | Smoke      |
| TC-ACT-045 | PDF tiene formato y diseño profesional           | Media     | Regression |
| TC-ACT-046 | Nombre del archivo PDF incluye ID de transacción | Media     | Regression |
| TC-ACT-047 | Botón imprimir abre diálogo de impresión         | Media     | Regression |
| TC-ACT-048 | Colores correctos en PDF (verde para ingresos)   | Media     | Regression |
| TC-ACT-049 | Colores correctos en PDF (naranja para egresos)  | Media     | Regression |
| TC-ACT-050 | PDF descarga automáticamente sin errores         | Alta      | Regression |

### 11.9 Actualización de Saldo

| ID         | Título                                             | Prioridad | Suite      |
| ---------- | -------------------------------------------------- | --------- | ---------- |
| TC-SAL-001 | Saldo se actualiza después de depósito exitoso     | Alta      | Smoke      |
| TC-SAL-002 | Saldo actualizado visible en dashboard             | Alta      | Smoke      |
| TC-SAL-003 | Saldo actualizado sin refrescar página manualmente | Alta      | Smoke      |
| TC-SAL-004 | Actualización de saldo desde página de éxito       | Alta      | Regression |
| TC-SAL-005 | Actualización de saldo al navegar al dashboard     | Alta      | Regression |

### 11.10 Manejo de Errores y Token Expirado

| ID         | Título                                              | Prioridad | Suite      |
| ---------- | --------------------------------------------------- | --------- | ---------- |
| TC-ERR-001 | Redirección automática a login cuando token expira  | Alta      | Smoke      |
| TC-ERR-002 | Limpieza de localStorage cuando token expira        | Alta      | Regression |
| TC-ERR-003 | Mensaje claro cuando sesión expira durante depósito | Alta      | Regression |
| TC-ERR-004 | Mensaje claro cuando sesión expira al ver actividad | Alta      | Regression |
| TC-ERR-005 | Warning en consola cuando token expira              | Baja      | Regression |

---

## 12. Suite de Smoke Test Sprint 3 - Resumen

**Total de casos:** 25  
**Tiempo estimado de ejecución:** 20 minutos

### Épica: Ingreso de Dinero (12 casos)

1. TC-DEP-001: Acceso a página de depósito
2. TC-DEP-002: Visualización de tarjetas
3. TC-DEP-003: Visualización de opción CVU
4. TC-DEP-004: Navegación a depósito con tarjeta
5. TC-DEP-005: Navegación a CVU/Alias
6. TC-DEP-009: Ingreso de monto válido
7. TC-DEP-010: Confirmación de depósito
8. TC-DEP-011: Depósito exitoso
9. TC-DEP-012: Redirección a éxito
10. TC-DEP-021: Visualización de CVU
11. TC-DEP-022: Visualización de Alias
12. TC-DEP-023: Copiar CVU

### Épica: Mi Actividad (10 casos)

13. TC-ACT-001: Lista de transacciones
14. TC-ACT-002: Filtro por período (Hoy)
15. TC-ACT-008: Filtro por tipo (Ingresos)
16. TC-ACT-016: Combinación de filtros
17. TC-ACT-020: Limpiar filtros
18. TC-ACT-023: Paginación (10 items)
19. TC-ACT-024: Página siguiente
20. TC-ACT-031: Ver detalle
21. TC-ACT-042: Descargar PDF
22. TC-ACT-043: Contenido del PDF

### Actualización de Saldo (3 casos)

23. TC-SAL-001: Saldo actualizado post-depósito
24. TC-SAL-002: Saldo visible en dashboard
25. TC-ERR-001: Manejo de token expirado

**Criterio de aceptación:**  
✅ Todos los casos deben PASAR para considerar Sprint 3 como completo.

---

## 13. Suite de Regression Test Sprint 3 - Resumen

**Total de casos Sprint 3:** 105  
**Tiempo estimado de ejecución:** 4-5 horas

Incluye:

- 25 casos de Smoke Test Sprint 3
- 8 casos de Selección de método
- 12 casos de Depósito con tarjeta
- 7 casos de CVU/Alias
- 6 casos de Página de éxito
- 22 casos de Filtros de actividad
- 8 casos de Paginación
- 11 casos de Detalle de transacción
- 9 casos de Comprobantes
- 5 casos de Actualización de saldo
- 5 casos de Manejo de errores

**Total acumulado (Sprint 1 + Sprint 2 + Sprint 3):** 252 casos

**Criterio de aceptación:**  
✅ Mínimo 95% de casos deben PASAR  
⚠️ Ningún defecto crítico puede estar abierto  
✅ Todos los Smoke Tests deben PASAR

---

## 14. Resumen General de Testing

### Cobertura por Sprint

| Sprint    | Casos Smoke | Casos Regression | Total   | Tiempo Estimado |
| --------- | ----------- | ---------------- | ------- | --------------- |
| Sprint 1  | 14          | 67               | 67      | 2-3 horas       |
| Sprint 2  | 22          | 80               | 80      | 3-4 horas       |
| Sprint 3  | 25          | 105              | 105     | 4-5 horas       |
| **Total** | **61**      | **252**          | **252** | **9-12 horas**  |

### Distribución por Épica

| Épica                     | Sprint | Casos   | Porcentaje |
| ------------------------- | ------ | ------- | ---------- |
| Landing Page              | 1      | 12      | 4.8%       |
| Registro                  | 1      | 21      | 8.3%       |
| Login                     | 1      | 16      | 6.3%       |
| Logout                    | 1      | 6       | 2.4%       |
| Persistencia y Middleware | 1      | 7       | 2.8%       |
| Responsividad Sprint 1    | 1      | 5       | 2.0%       |
| Mi Perfil                 | 2      | 30      | 11.9%      |
| Gestión de Tarjetas       | 2      | 42      | 16.7%      |
| Responsividad Sprint 2    | 2      | 4       | 1.6%       |
| Ingreso de Dinero         | 3      | 33      | 13.1%      |
| Mi Actividad              | 3      | 50      | 19.8%      |
| Actualización de Saldo    | 3      | 5       | 2.0%       |
| Manejo de Errores         | 3      | 5       | 2.0%       |
| **Total**                 | -      | **252** | **100%**   |

### Pirámide de Testing

```
                   E2E (Manual)
                      252 casos
                  ╱              ╲
              ╱                      ╲
          ╱                              ╲
      ╱          Integration Tests           ╲
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  (Por implementar)

              Unit Tests (Por implementar)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Prioridades

- **Alta:** 189 casos (75%)
- **Media:** 58 casos (23%)
- **Baja:** 5 casos (2%)

---

## 15. Casos de Prueba Detallados - Ejemplos por Sprint

### Ejemplo Sprint 2: TC-PRF-010 - Actualizar nombre exitosamente

**Precondiciones:**

- Usuario logueado
- Usuario en página de perfil (/profile)

**Pasos:**

1. Click en botón "Editar Datos"
2. Modificar campo "Nombre" a "Carlos"
3. Click en botón "Guardar"

**Datos de Entrada:**

- Nombre nuevo: Carlos
- Apellido: [sin cambios]
- Teléfono: [sin cambios]

**Resultado Esperado:**

- Mensaje "Perfil actualizado correctamente"
- Vista vuelve a modo lectura
- Nombre "Carlos" visible en la sección de datos personales
- API actualizada con nuevo nombre

**Prioridad:** Alta  
**Tipo:** Funcional  
**Suite:** Smoke

---

### Ejemplo Sprint 2: TC-CRD-011 - Agregar tarjeta Visa exitosamente

**Precondiciones:**

- Usuario logueado
- Usuario tiene menos de 10 tarjetas
- Usuario en página /cards/add

**Pasos:**

1. Ingresar número: 4111111111111111
2. Ingresar nombre: JUAN PEREZ
3. Ingresar fecha vencimiento: 12/2025
4. Ingresar CVV: 123
5. Click en "Agregar Tarjeta"

**Datos de Entrada:**

- Número: 4111111111111111
- Nombre: JUAN PEREZ
- Vencimiento: 12/2025
- CVV: 123

**Resultado Esperado:**

- Tipo "Visa" detectado automáticamente
- Indicador verde muestra "Tipo de tarjeta detectado: Visa"
- Mensaje "Tarjeta agregada correctamente"
- Redirección a /cards
- Nueva tarjeta visible en lista con •••• 1111

**Prioridad:** Alta  
**Tipo:** Funcional  
**Suite:** Smoke

---

### Ejemplo Sprint 3: TC-DEP-009 - Ingreso de monto válido

**Precondiciones:**

- Usuario logueado
- Usuario tiene al menos una tarjeta registrada
- Usuario en página de depósito con tarjeta seleccionada

**Pasos:**

1. Ingresar monto: 5000
2. Click en botón "Continuar"

**Datos de Entrada:**

- Monto: 5000

**Resultado Esperado:**

- Pantalla de confirmación se muestra
- Monto formateado: $5.000,00
- Tarjeta seleccionada visible
- Botones "Volver" y "Confirmar" habilitados

**Prioridad:** Alta  
**Tipo:** Funcional  
**Suite:** Smoke

---

### TC-ACT-016: Combinación de múltiples filtros

**Precondiciones:**

- Usuario logueado
- Existen transacciones en la cuenta
- Usuario en página de actividad

**Pasos:**

1. Seleccionar filtro período: "Hoy"
2. Seleccionar filtro tipo: "Ingresos"
3. Seleccionar filtro monto: "$5.000 - $20.000"

**Resultado Esperado:**

- Lista muestra solo transacciones que cumplen TODOS los criterios:
  - Fecha de hoy
  - Tipo = Ingreso (Deposit)
  - Monto entre $5.000 y $20.000
- Contador muestra cantidad correcta de resultados
- Botón "Limpiar filtros" visible

**Prioridad:** Alta  
**Tipo:** Funcional  
**Suite:** Smoke

---

### TC-ACT-042: Descargar comprobante en PDF

**Precondiciones:**

- Usuario logueado
- Usuario en página de detalle de transacción

**Pasos:**

1. Click en botón "Descargar comprobante"

**Resultado Esperado:**

- Archivo PDF se descarga automáticamente
- Nombre del archivo: comprobante-{id}.pdf
- PDF contiene:
  - Header verde con "Digital Money House"
  - Título: "Comprobante de [tipo]"
  - Estado: "Aprobada"
  - Monto grande con color correcto
  - Número de operación
  - Fecha y hora
  - Descripción
  - Origen/Destino (cuando aplica)
  - Footer con fecha de generación

**Prioridad:** Alta  
**Tipo:** Funcional  
**Suite:** Smoke

---

### TC-SAL-001: Actualización de saldo post-depósito

**Precondiciones:**

- Usuario logueado
- Saldo inicial conocido: $40.000

**Pasos:**

1. Realizar depósito de $5.000
2. Completar flujo hasta página de éxito
3. Click en "Ir al inicio"
4. Verificar saldo en dashboard

**Datos de Entrada:**

- Saldo inicial: $40.000
- Depósito: $5.000

**Resultado Esperado:**

- Saldo en dashboard muestra: $45.000
- Actualización visible sin refrescar manualmente
- Nueva transacción visible en "Últimos movimientos"

**Prioridad:** Alta  
**Tipo:** Funcional  
**Suite:** Smoke

---

### Ejemplo Sprint 4: TC-PAY-002 - Buscar servicio por nombre

**Precondiciones:**

- Usuario logueado
- Existen servicios disponibles en el sistema
- Usuario en página /pay-services

**Pasos:**

1. Ingresar "Netflix" en el campo de búsqueda
2. Observar resultados filtrados

**Datos de Entrada:**

- Término de búsqueda: Netflix

**Resultado Esperado:**

- Solo se muestran servicios que contienen "Netflix" en el nombre
- Contador muestra cantidad correcta de resultados
- Búsqueda no distingue mayúsculas/minúsculas

**Prioridad:** Alta  
**Tipo:** Funcional  
**Suite:** Smoke

---

### Ejemplo Sprint 4: TC-PAY-011 - Pago exitoso con fondos suficientes

**Precondiciones:**

- Usuario logueado
- Saldo disponible: $50.000
- Servicio seleccionado con monto: $5.000
- Número de cuenta válido ingresado

**Pasos:**

1. Seleccionar "Dinero en cuenta" como medio de pago
2. Verificar resumen en pantalla de confirmación
3. Click en "Confirmar Pago"
4. Esperar procesamiento

**Datos de Entrada:**

- Monto del servicio: $5.000
- Saldo disponible: $50.000
- Método de pago: Dinero en cuenta

**Resultado Esperado:**

- Pantalla de éxito se muestra
- Mensaje "¡Pago Exitoso!" visible
- Monto pagado: $5.000
- Nuevo saldo: $45.000
- Botones "Descargar Comprobante" y "Ir al Inicio" disponibles

**Prioridad:** Alta  
**Tipo:** Funcional  
**Suite:** Smoke

---

## 16. Casos de Prueba - Sprint 4

### 16.1 Pagar Servicios - Lista de Servicios

| ID         | Título                                            | Prioridad | Suite      |
| ---------- | ------------------------------------------------- | --------- | ---------- |
| TC-PAY-001 | Acceso a página de pagar servicios                | Alta      | Smoke      |
| TC-PAY-002 | Búsqueda de servicio por nombre                   | Alta      | Smoke      |
| TC-PAY-003 | Visualización de lista completa sin paginación    | Alta      | Smoke      |
| TC-PAY-004 | Click en servicio redirige a página de cuenta     | Alta      | Smoke      |
| TC-PAY-005 | Búsqueda case-insensitive (mayúsculas/minúsculas) | Alta      | Regression |
| TC-PAY-006 | Búsqueda con texto parcial encuentra servicios    | Media     | Regression |
| TC-PAY-007 | Búsqueda sin resultados muestra mensaje apropiado | Media     | Regression |
| TC-PAY-008 | Limpiar búsqueda restaura lista completa          | Media     | Regression |
| TC-PAY-009 | Contador de servicios encontrados visible         | Baja      | Regression |
| TC-PAY-010 | Visualización de fecha de servicio                | Media     | Regression |
| TC-PAY-011 | Visualización de monto de factura                 | Media     | Regression |
| TC-PAY-012 | Mensaje cuando no hay servicios disponibles       | Media     | Regression |

### 16.2 Pagar Servicios - Número de Cuenta

| ID         | Título                                           | Prioridad | Suite      |
| ---------- | ------------------------------------------------ | --------- | ---------- |
| TC-PAY-013 | Ingreso de número de cuenta válido               | Alta      | Smoke      |
| TC-PAY-014 | Validación número de cuenta requerido            | Alta      | Regression |
| TC-PAY-015 | Validación mínimo 8 caracteres                   | Alta      | Regression |
| TC-PAY-016 | Error al ingresar número sin facturas pendientes | Alta      | Smoke      |
| TC-PAY-017 | Mensaje de error claro para cuenta inválida      | Alta      | Regression |
| TC-PAY-018 | Continuar con cuenta válida avanza a pago        | Alta      | Smoke      |
| TC-PAY-019 | Botón volver regresa a lista de servicios        | Media     | Regression |
| TC-PAY-020 | Visualización de información del servicio        | Media     | Regression |
| TC-PAY-021 | Campo de entrada acepta números y letras         | Media     | Regression |

### 16.3 Pagar Servicios - Selección de Medio de Pago

| ID         | Título                                            | Prioridad | Suite      |
| ---------- | ------------------------------------------------- | --------- | ---------- |
| TC-PAY-022 | Visualización de opción "Dinero en cuenta"        | Alta      | Smoke      |
| TC-PAY-023 | Visualización de saldo disponible                 | Alta      | Smoke      |
| TC-PAY-024 | Visualización de tarjetas registradas             | Alta      | Smoke      |
| TC-PAY-025 | Selección de dinero en cuenta                     | Alta      | Smoke      |
| TC-PAY-026 | Selección de tarjeta de crédito/débito            | Alta      | Regression |
| TC-PAY-027 | Indicador visual de método seleccionado           | Media     | Regression |
| TC-PAY-028 | Botón "Agregar Tarjeta" funcional                 | Alta      | Regression |
| TC-PAY-029 | Continuar sin seleccionar método muestra error    | Alta      | Regression |
| TC-PAY-030 | Advertencia al seleccionar tarjeta (solo cuenta)  | Alta      | Smoke      |
| TC-PAY-031 | Información del servicio visible en esta pantalla | Media     | Regression |

### 16.4 Pagar Servicios - Confirmación y Validación

| ID         | Título                                     | Prioridad | Suite      |
| ---------- | ------------------------------------------ | --------- | ---------- |
| TC-PAY-032 | Visualización de resumen completo del pago | Alta      | Smoke      |
| TC-PAY-033 | Validación de fondos suficientes           | Alta      | Smoke      |
| TC-PAY-034 | Error por fondos insuficientes             | Alta      | Smoke      |
| TC-PAY-035 | Cálculo de saldo restante correcto         | Alta      | Regression |
| TC-PAY-036 | Visualización de fecha y hora actual       | Media     | Regression |
| TC-PAY-037 | Botón confirmar deshabilitado sin fondos   | Alta      | Regression |
| TC-PAY-038 | Mensaje claro de fondos insuficientes      | Alta      | Regression |
| TC-PAY-039 | Cálculo de faltante de dinero correcto     | Media     | Regression |
| TC-PAY-040 | Botón cancelar regresa a selección de pago | Media     | Regression |
| TC-PAY-041 | Deshabilitar botones durante procesamiento | Media     | Regression |

### 16.5 Pagar Servicios - Resultado del Pago

| ID         | Título                                           | Prioridad | Suite      |
| ---------- | ------------------------------------------------ | --------- | ---------- |
| TC-PAY-042 | Pago exitoso con dinero en cuenta                | Alta      | Smoke      |
| TC-PAY-043 | Visualización de pantalla de éxito               | Alta      | Smoke      |
| TC-PAY-044 | Actualización automática de saldo                | Alta      | Smoke      |
| TC-PAY-045 | Visualización de monto pagado                    | Alta      | Smoke      |
| TC-PAY-046 | Visualización de nuevo saldo                     | Alta      | Smoke      |
| TC-PAY-047 | Badge de estado "APROBADA" visible               | Media     | Regression |
| TC-PAY-048 | Botón "Ir al Inicio" redirige a dashboard        | Alta      | Regression |
| TC-PAY-049 | Botón "Nuevo Pago" redirige a lista de servicios | Alta      | Regression |
| TC-PAY-050 | Transacción registrada en actividad              | Alta      | Regression |
| TC-PAY-051 | Fecha y hora del pago correctas                  | Media     | Regression |

### 16.6 Pagar Servicios - Comprobante PDF

| ID         | Título                                      | Prioridad | Suite      |
| ---------- | ------------------------------------------- | --------- | ---------- |
| TC-PAY-052 | Botón "Descargar Comprobante" genera PDF    | Alta      | Smoke      |
| TC-PAY-053 | PDF contiene encabezado Digital Money House | Alta      | Smoke      |
| TC-PAY-054 | PDF contiene todos los datos del pago       | Alta      | Smoke      |
| TC-PAY-055 | PDF muestra estado "APROBADA"               | Alta      | Regression |
| TC-PAY-056 | PDF muestra monto con formato correcto      | Alta      | Regression |
| TC-PAY-057 | PDF incluye servicio pagado                 | Alta      | Regression |
| TC-PAY-058 | PDF incluye número de cuenta del servicio   | Alta      | Regression |
| TC-PAY-059 | PDF incluye medio de pago utilizado         | Alta      | Regression |
| TC-PAY-060 | PDF incluye fecha y hora del pago           | Media     | Regression |
| TC-PAY-061 | PDF incluye CVU del usuario                 | Media     | Regression |
| TC-PAY-062 | Nombre del archivo incluye ID del servicio  | Baja      | Regression |
| TC-PAY-063 | Botón "Imprimir" abre diálogo de impresión  | Media     | Regression |
| TC-PAY-064 | PDF tiene formato profesional y legible     | Media     | Regression |

### 16.7 Pagar Servicios - Manejo de Errores

| ID         | Título                                          | Prioridad | Suite      |
| ---------- | ----------------------------------------------- | --------- | ---------- |
| TC-PAY-065 | Manejo de error al cargar servicios             | Alta      | Regression |
| TC-PAY-066 | Manejo de error al procesar pago                | Alta      | Regression |
| TC-PAY-067 | Redirección automática con token expirado (401) | Alta      | Smoke      |
| TC-PAY-068 | Validación de parámetros faltantes en URL       | Alta      | Regression |
| TC-PAY-069 | Manejo de servicio no encontrado                | Media     | Regression |

### 16.8 Integración con Sprint 3 - Actividad

| ID         | Título                                          | Prioridad | Suite      |
| ---------- | ----------------------------------------------- | --------- | ---------- |
| TC-INT-001 | Pago de servicio aparece en página de actividad | Alta      | Smoke      |
| TC-INT-002 | Tipo de transacción correcto (Payment)          | Alta      | Regression |
| TC-INT-003 | Monto negativo en actividad (egreso)            | Alta      | Regression |
| TC-INT-004 | Descripción incluye nombre del servicio         | Media     | Regression |
| TC-INT-005 | Filtro "Pagos" incluye pagos de servicios       | Alta      | Regression |
| TC-INT-006 | Comprobante descargable desde actividad         | Alta      | Regression |

### 16.9 Responsividad - Sprint 4

| ID         | Título                                          | Prioridad | Suite      |
| ---------- | ----------------------------------------------- | --------- | ---------- |
| TC-RES-012 | Lista de servicios responsiva en mobile         | Media     | Regression |
| TC-RES-013 | Búsqueda de servicios responsiva en mobile      | Media     | Regression |
| TC-RES-014 | Selección de medio de pago responsiva en mobile | Media     | Regression |
| TC-RES-015 | Confirmación de pago responsiva en mobile       | Media     | Regression |
| TC-RES-016 | Página de éxito responsiva en mobile            | Media     | Regression |

---

## 17. Suite de Smoke Test Sprint 4 - Resumen

**Total de casos:** 20  
**Tiempo estimado de ejecución:** 15 minutos

### Épica: Pagar Servicios (20 casos)

1. TC-PAY-001: Acceso a pagar servicios
2. TC-PAY-002: Búsqueda de servicio
3. TC-PAY-003: Lista sin paginación
4. TC-PAY-004: Click en servicio
5. TC-PAY-013: Ingresar cuenta válida
6. TC-PAY-016: Error cuenta sin facturas
7. TC-PAY-018: Continuar con cuenta válida
8. TC-PAY-022: Ver dinero en cuenta
9. TC-PAY-023: Ver saldo disponible
10. TC-PAY-024: Ver tarjetas
11. TC-PAY-025: Seleccionar dinero en cuenta
12. TC-PAY-030: Advertencia pago con tarjeta
13. TC-PAY-032: Ver resumen del pago
14. TC-PAY-033: Validar fondos suficientes
15. TC-PAY-034: Error fondos insuficientes
16. TC-PAY-042: Pago exitoso
17. TC-PAY-043: Pantalla de éxito
18. TC-PAY-052: Descargar comprobante PDF
19. TC-PAY-067: Manejo token expirado
20. TC-INT-001: Pago en actividad

**Criterio de aceptación:**  
✅ Todos los casos deben PASAR para considerar Sprint 4 como completo.

---

## 18. Suite de Regression Test Sprint 4 - Resumen

**Total de casos Sprint 4:** 85  
**Tiempo estimado de ejecución:** 3-4 horas

Incluye:

- 20 casos de Smoke Test Sprint 4
- 12 casos de Lista de servicios
- 9 casos de Número de cuenta
- 10 casos de Selección de medio de pago
- 10 casos de Confirmación y validación
- 10 casos de Resultado del pago
- 13 casos de Comprobante PDF
- 5 casos de Manejo de errores
- 6 casos de Integración con Sprint 3
- 5 casos de Responsividad

**Total acumulado (Sprint 1 + 2 + 3 + 4):** 337 casos

**Criterio de aceptación:**  
✅ Mínimo 95% de casos deben PASAR  
⚠️ Ningún defecto crítico puede estar abierto  
✅ Todos los Smoke Tests deben PASAR

---

## 19. Resumen General de Testing - Actualizado

### Cobertura por Sprint

| Sprint    | Casos Smoke | Casos Regression | Total   | Tiempo Estimado |
| --------- | ----------- | ---------------- | ------- | --------------- |
| Sprint 1  | 14          | 67               | 67      | 2-3 horas       |
| Sprint 2  | 22          | 80               | 80      | 3-4 horas       |
| Sprint 3  | 25          | 105              | 105     | 4-5 horas       |
| Sprint 4  | 20          | 85               | 85      | 3-4 horas       |
| **Total** | **81**      | **337**          | **337** | **12-16 horas** |

### Distribución por Épica - Actualizada

| Épica                     | Sprint | Casos   | Porcentaje |
| ------------------------- | ------ | ------- | ---------- |
| Landing Page              | 1      | 12      | 3.6%       |
| Registro                  | 1      | 21      | 6.2%       |
| Login                     | 1      | 16      | 4.7%       |
| Logout                    | 1      | 6       | 1.8%       |
| Persistencia y Middleware | 1      | 7       | 2.1%       |
| Responsividad Sprint 1    | 1      | 5       | 1.5%       |
| Mi Perfil                 | 2      | 30      | 8.9%       |
| Gestión de Tarjetas       | 2      | 42      | 12.5%      |
| Responsividad Sprint 2    | 2      | 4       | 1.2%       |
| Ingreso de Dinero         | 3      | 33      | 9.8%       |
| Mi Actividad              | 3      | 50      | 14.8%      |
| Actualización de Saldo    | 3      | 5       | 1.5%       |
| Manejo de Errores S3      | 3      | 5       | 1.5%       |
| Pagar Servicios           | 4      | 69      | 20.5%      |
| Integración S4            | 4      | 6       | 1.8%       |
| Responsividad Sprint 4    | 4      | 5       | 1.5%       |
| **Total**                 | -      | **337** | **100%**   |

### Prioridades - Actualizado

- **Alta:** 257 casos (76%)
- **Media:** 75 casos (22%)
- **Baja:** 5 casos (2%)

---

## 20. Defectos Conocidos

### Sprint 2 - Defectos Pendientes

| ID         | Título                                          | Severidad | Estado  |
| ---------- | ----------------------------------------------- | --------- | ------- |
| BUG-S2-001 | Límite de 10 tarjetas no se muestra visualmente | Baja      | Abierto |

### Sprint 3 - Defectos Resueltos

| ID         | Título                                       | Severidad | Estado   |
| ---------- | -------------------------------------------- | --------- | -------- |
| BUG-S3-001 | Saldo no se actualiza al volver al dashboard | Alta      | Resuelto |
| BUG-S3-002 | Filtro de tipo no funciona (case-sensitive)  | Crítica   | Resuelto |
| BUG-S3-003 | Emoji en PDF genera caracteres extraños      | Media     | Resuelto |
| BUG-S3-004 | Click en transacción no abre detalle         | Alta      | Resuelto |

---

## 17. Próximos Pasos

### Sprint 2

- [ ] Ejecutar suite de Smoke Test Sprint 2
- [ ] Documentar resultados en planilla de casos de prueba
- [ ] Reportar defectos encontrados
- [ ] Validar flujos de edición de perfil y alias
- [ ] Validar límite máximo de 10 tarjetas
- [ ] Pruebas de integración perfil-tarjetas

### Sprint 3

- [ ] Ejecutar suite de Smoke Test Sprint 3
- [ ] Documentar resultados en planilla de casos de prueba
- [ ] Reportar defectos encontrados
- [ ] Ejecutar suite de Regression Test completa (Sprint 1 + 2 + 3)
- [ ] Validar que todos los defectos estén resueltos
- [ ] Generar reporte de cobertura de pruebas
- [ ] Pruebas de integración entre depósitos y actividad
- [ ] Pruebas de performance con múltiples transacciones
- [ ] Validar generación de PDFs con datos reales
- [ ] Pruebas de actualización de saldo en tiempo real

### General

- [ ] Crear matriz de trazabilidad de requisitos
- [ ] Implementar tests automatizados (Jest + React Testing Library)
- [ ] Configurar CI/CD con ejecución de tests
- [ ] Implementar tests E2E con Playwright
- [ ] Configurar Sentry para monitoreo de errores en producción
- [ ] Subir planilla actualizada a GitLab

### Sprint 4

- [ ] Ejecutar suite de Smoke Test Sprint 4
- [ ] Documentar resultados en planilla de casos de prueba
- [ ] Reportar defectos encontrados
- [ ] Validar flujo completo de pago de servicios
- [ ] Validar búsqueda y filtrado de servicios
- [ ] Validar validaciones de número de cuenta
- [ ] Pruebas de fondos suficientes e insuficientes
- [ ] Validar generación de comprobantes PDF
- [ ] Pruebas de integración con Sprint 3 (actividad)
- [ ] Testing exploratorio siguiendo tours y escenarios
- [ ] Ejecutar suite de Regression Test completa (Sprint 1 + 2 + 3 + 4)
- [ ] Generar documento de QA Sign Off
- [ ] Configurar Docker Compose
- [ ] Crear imagen Docker para deployment AWS

---

## 22. Testing Exploratorio - Sprint 4

### Objetivos del Testing Exploratorio

Realizar exploración libre y estructurada del flujo de pago de servicios para descubrir defectos no contemplados en casos de prueba formales.

### Sesiones de Testing

#### Sesión 1: Happy Path - Usuario Experimentado

**Duración:** 30 minutos  
**Charter:** Explorar flujo completo de pago con comportamiento ideal del usuario  
**Áreas:**

- Navegación fluida entre pantallas
- Validaciones funcionando correctamente
- Experiencia de usuario positiva

#### Sesión 2: Error Handling - Escenarios Negativos

**Duración:** 45 minutos  
**Charter:** Provocar errores y validar mensajes y recuperación  
**Áreas:**

- Números de cuenta inválidos
- Fondos insuficientes
- Token expirado durante el flujo
- Errores de red

#### Sesión 3: Boundary Testing - Valores Límite

**Duración:** 30 minutos  
**Charter:** Probar con valores límite y extremos  
**Áreas:**

- Saldo exacto igual al monto a pagar
- Números de cuenta muy largos/cortos
- Búsquedas con caracteres especiales
- Servicios con montos $0

#### Sesión 4: Integration Testing - Flujos Cruzados

**Duración:** 45 minutos  
**Charter:** Validar integración con otros módulos  
**Áreas:**

- Pago → Actividad → PDF
- Pago → Actualización de saldo → Dashboard
- Agregar tarjeta → Selección de pago
- Múltiples pagos consecutivos

### Tours Propuestos

#### Tour del Dinero

Seguir el dinero desde el saldo inicial hasta el pago del servicio y verificar consistencia en todas las pantallas.

#### Tour del Error

Intentar romper la aplicación con entradas inválidas, navegación incorrecta, y acciones no esperadas.

#### Tour del Usuario Distraído

Simular usuario que comete errores, usa botón atrás del navegador, abre múltiples tabs.

#### Tour de Performance

Realizar operaciones rápidamente, múltiples clicks, búsquedas muy rápidas.

### Escenarios de Prueba

1. **Usuario paga 5 servicios seguidos**: Validar que el saldo se actualice correctamente en cada operación
2. **Usuario busca servicio inexistente**: Validar mensaje apropiado
3. **Usuario intenta pagar sin seleccionar método**: Validar validación
4. **Usuario con $0 en cuenta intenta pagar**: Validar mensaje de fondos insuficientes
5. **Usuario descarga 3 comprobantes seguidos**: Validar que todos se generen correctamente
6. **Usuario navega con botón atrás del navegador**: Validar que no se pierdan datos
7. **Token expira durante confirmación**: Validar redirección a login
8. **Usuario agrega tarjeta durante flujo de pago**: Validar que aparezca en lista de medios

### Workflows

#### Workflow 1: Pago Exitoso Completo

1. Login → Dashboard
2. Navegar a Pagar Servicios
3. Buscar servicio
4. Seleccionar servicio
5. Ingresar número de cuenta
6. Seleccionar medio de pago
7. Confirmar pago
8. Descargar comprobante
9. Ver en actividad
10. Verificar saldo actualizado

#### Workflow 2: Pago Fallido por Fondos

1. Login con usuario con poco saldo
2. Intentar pagar servicio costoso
3. Observar mensaje de error
4. Navegar a ingresar dinero
5. Depositar fondos
6. Regresar a pagar servicio
7. Completar pago exitosamente

---

## 23. QA Sign Off - Sprint 4

### Métricas de Calidad

| Métrica                           | Objetivo | Real | Estado |
| --------------------------------- | -------- | ---- | ------ |
| Casos de prueba ejecutados        | 85       | -    | ⏳     |
| Casos de prueba pasados           | 81 (95%) | -    | ⏳     |
| Defectos críticos abiertos        | 0        | -    | ⏳     |
| Defectos altos resueltos          | 100%     | -    | ⏳     |
| Cobertura de código               | >70%     | -    | ⏳     |
| Tests automatizados implementados | 25       | -    | ⏳     |

### Criterios de Aceptación

✅ **PASS:** Todos los casos de smoke test ejecutados exitosamente  
✅ **PASS:** Mínimo 95% de casos de regression test pasando  
✅ **PASS:** 0 defectos críticos abiertos  
✅ **PASS:** Flujo completo de pago funcional  
✅ **PASS:** Comprobantes PDF generándose correctamente  
✅ **PASS:** Integración con actividad funcionando  
✅ **PASS:** Responsive design validado en mobile

### Defectos Reportados y Resueltos

| ID  | Severidad | Título | Estado |
| --- | --------- | ------ | ------ |
| -   | -         | -      | -      |

### Recomendaciones

- Implementar tests automatizados para flujo de pago
- Agregar validación de formato para números de cuenta
- Mejorar mensajes de error con sugerencias de acción
- Implementar caché de servicios para mejor performance
- Agregar analytics para trackear uso del módulo

### Aprobación

**QA Lead:** [Nombre]  
**Fecha:** [DD/MM/YYYY]  
**Firma:** ******\_\_\_\_******

**Product Owner:** [Nombre]  
**Fecha:** [DD/MM/YYYY]  
**Firma:** ******\_\_\_\_******

---

## 24. Infraestructura - Sprint 4

### Docker Compose

Se ha generado archivo `docker-compose.yml` para orquestar servicios:

- Aplicación Next.js
- Variables de entorno
- Network configuration
- Volume mounts

### Docker Container

Imagen Docker creada para deployment en AWS:

- Base: Node.js 18 Alpine
- Multi-stage build para optimización
- Health checks configurados
- Secrets management
- Logs configurados

### Deployment AWS

Preparado para deployment en:

- AWS ECS (Elastic Container Service)
- AWS Fargate (serverless containers)
- Application Load Balancer
- CloudWatch para logs y monitoring

---

## 25. Próximos Pasos - Post Sprint 4
