# 📧 Configuración de Email con Hotmail/Outlook

## ✅ Estado Actual
Ya configuraste tus credenciales de Hotmail en el archivo `email.service.js`. La configuración básica está lista para funcionar.

## 🔐 ¿Necesito configurar algo más en Outlook?

### **Opción 1: Probar primero (RECOMENDADO)**
En la mayoría de los casos, **NO necesitas configurar nada más**. Simplemente:

1. Inicia sesión en la aplicación con el usuario `202300001`
2. Ve a la pantalla de Tareas
3. Haz clic en "🔔 Probar Recordatorios"
4. Revisa tu bandeja de entrada (y spam) en `sershdiaz@hotmail.com`

### **Opción 2: Si obtienes errores de autenticación**

Si ves errores como "Invalid login" o "Authentication failed", entonces SÍ necesitas configurar:

#### Paso 1: Permitir aplicaciones menos seguras
1. Inicia sesión en https://account.microsoft.com
2. Ve a **Seguridad** > **Opciones avanzadas de seguridad**
3. Busca **"Seguridad de aplicaciones"**
4. Activa **"Permitir aplicaciones menos seguras"** (si está disponible)

#### Paso 2: Usar contraseña de aplicación (MÁS SEGURO)
1. Ve a https://account.microsoft.com/security
2. Activa la **verificación en dos pasos** si no lo está
3. Busca **"Contraseñas de aplicaciones"** o **"App passwords"**
4. Genera una nueva contraseña para "Correo"
5. Copia la contraseña generada (será algo como: `abcd efgh ijkl mnop`)
6. Reemplaza en `email.service.js`:
   ```javascript
   auth: {
     user: 'sershdiaz77@hotmail.com',
     pass: 'abcd efgh ijkl mnop' // ← Tu contraseña de aplicación
   }
   ```

## 🚀 Cómo Probar

1. **Reinicia el servidor** si está corriendo:
   - Detén el servidor (Ctrl+C en la terminal)
   - Ejecuta: `npm run dev`

2. **Inicia sesión**:
   - ID: `202300001`
   - Contraseña: `sersh123`

3. **Navega a Tareas**:
   - Haz clic en el botón "📋 Mis Tareas" en la pantalla de inicio
   - Verás la tarea que vence mañana asignada a ti

4. **Prueba los recordatorios**:
   - Haz clic en "🔔 Probar Recordatorios"
   - Revisa la terminal del servidor - verá los mensajes de envío
   - Revisa tu email en `sershdiaz@hotmail.com`

## 📝 Mensajes en la Consola

Cuando funcione correctamente verás:
```
✅ Email enviado a sershdiaz@hotmail.com para la tarea: Práctica SCRUM - Sprint 1
```

Si hay error verás:
```
❌ Error al enviar email a sershdiaz@hotmail.com: <descripción del error>
```

## ⚠️ Solución de Problemas Comunes

### Error: "Invalid login"
- Verifica que el correo y contraseña sean correctos
- Intenta usar una contraseña de aplicación (ver Opción 2 arriba)

### Error: "self signed certificate"
- Agrega esta opción en el transporter:
  ```javascript
  tls: {
    rejectUnauthorized: false
  }
  ```

### No llegan los emails
- Revisa la carpeta de **Spam/Correo no deseado**
- Verifica que el email esté correcto en `users.json`
- Revisa los logs en la terminal del servidor

## 📱 Nueva Navegación

La aplicación ahora tiene dos pantallas separadas:

1. **Pantalla de Inicio**: Menú principal con opciones
2. **Pantalla de Tareas**: Gestión de tareas y recordatorios

Puedes navegar entre ellas usando los botones:
- "📋 Mis Tareas" → Va a la pantalla de tareas
- "← Volver" → Regresa a la pantalla de inicio
