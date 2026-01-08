# Instrucciones de Login y Registro

## 🔐 Sistema de Autenticación

La aplicación se conecta a la API de Digital House en:
`https://digitalmoney.digitalhouse.com`

**NO hay base de datos local** - todo se maneja en el backend de Digital House.

## 📝 Para Registrar una Nueva Cuenta

1. Ve a http://localhost:3000/register
2. Completa el formulario con:

   - **Email**: Usa un email único (ej: `tunombre.unico@test.com`)
   - **Contraseña**: Mínimo 8 caracteres, 1 mayúscula, 1 número
   - **Nombre y Apellido**
   - **DNI**: 7-8 dígitos
   - **Teléfono**: 10 dígitos

3. Si recibes error 409: **El email ya existe**
   - Usa otro email diferente
   - O inicia sesión con ese email si es tuyo

## 🔑 Para Iniciar Sesión

1. Ve a http://localhost:3000/login
2. Ingresa tu email
3. Ingresa tu contraseña

### Credenciales de Prueba (si necesitas)

Puedes crear una cuenta nueva con estos datos:

```
Email: test.usuario.digital.2026@gmail.com
Contraseña: Test1234
Nombre: Usuario
Apellido: Prueba
DNI: 12345678
Teléfono: 1234567890
```

## ⚠️ Errores Comunes

### Error 409 en Registro

- **Causa**: El email ya existe
- **Solución**: Usa otro email o inicia sesión

### Error 401 en Login

- **Causa**: Email o contraseña incorrectos
- **Solución**: Verifica tus credenciales

### Error al cargar datos del usuario

- **Causa**: Token no válido o expirado
- **Solución**: Cierra sesión y vuelve a iniciar sesión

## 🔄 Flujo Completo

1. **Registro** → `/api/users` (POST)
2. **Login** → `/api/login` (POST) → Obtiene token
3. **Cargar cuenta** → `/api/account` (GET) con token
4. **Cargar usuario** → `/api/users/{id}` (GET) con token
5. **Redirigir a Dashboard**

## 🛠️ Troubleshooting

Si tienes problemas:

1. Limpia localStorage:

   ```javascript
   localStorage.clear();
   ```

2. Reinicia el servidor:

   ```bash
   npm run dev
   ```

3. Verifica que la API esté funcionando:
   ```
   https://digitalmoney.digitalhouse.com/ping
   ```
