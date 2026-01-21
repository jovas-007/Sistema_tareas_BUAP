# Sistema de Gestión de Tareas Escolares - Configuración de Email

## 📧 Configuración del Servicio de Email

Para que los recordatorios por email funcionen correctamente, debes configurar tus credenciales de email en el archivo `email.service.js`.

### Pasos para configurar:

1. Abre el archivo `email.service.js`

2. Busca estas líneas (aproximadamente línea 10-14):

```javascript
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'tu_email@hotmail.com', // Cambiar por tu email
    pass: 'tu_contraseña' // Cambiar por tu contraseña
  }
});
```

3. Reemplaza `tu_email@hotmail.com` con tu email real (puede ser Hotmail, Gmail, Outlook, etc.)

4. Reemplaza `tu_contraseña` con tu contraseña

### Opciones de servicio de email:

- **Gmail**: `service: 'gmail'`
- **Hotmail/Outlook**: `service: 'hotmail'` o `service: 'outlook'`
- **Yahoo**: `service: 'yahoo'`

### ⚠️ IMPORTANTE - Seguridad Gmail:

Si usas Gmail, necesitas crear una **Contraseña de Aplicación** (App Password):

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en 2 pasos (actívala si no lo está)
3. Busca "Contraseñas de aplicaciones"
4. Genera una nueva contraseña para "Correo"
5. Usa esa contraseña de 16 caracteres en el código

### Usuarios de Prueba

El sistema incluye estos usuarios con sus correos:

1. **Usuario 1:**
   - ID: `201912345`
   - Contraseña: `admin123`
   - Correo: `admin@buap.mx`

2. **Usuario 2:**
   - ID: `202268439`
   - Contraseña: `samd`
   - Correo: `jovany.solis@alumno.buap.mx`

3. **Usuario 3 (NUEVO):**
   - ID: `202300001`
   - Contraseña: `sersh123`
   - Correo: `sershdiaz@hotmail.com`

### Tareas de Ejemplo

El archivo `tasks.json` incluye 3 tareas de ejemplo:

1. **TAREA001**: Implementar sistema de login
   - Materia: Metodologías de Desarrollo Web
   - Entrega: 25 de enero de 2026
   - Asignada a: 201912345, 202268439

2. **TAREA002**: Diseño de base de datos
   - Materia: Base de Datos Avanzadas
   - Entrega: 22 de enero de 2026
   - Asignada a: 202268439, 202300001

3. **TAREA003**: Práctica SCRUM - Sprint 1
   - Materia: Metodologías de Desarrollo Web
   - Entrega: 21 de enero de 2026 (¡MAÑANA!)
   - Asignada a: 202300001

### 🔔 Cómo Funcionan los Recordatorios

1. **Automáticos**: El sistema envía emails automáticamente cada día a las 9:00 AM para tareas que vencen al día siguiente.

2. **Manual**: Puedes probar los recordatorios inmediatamente haciendo clic en el botón "🔔 Probar Recordatorios" en la interfaz de tareas.

3. El email incluye:
   - Nombre de la tarea
   - Materia
   - Fecha y hora de entrega
   - Tiempo restante

### Nuevos Endpoints del API

El backend ahora incluye estos endpoints adicionales:

- `GET /api/tasks` - Obtener todas las tareas
- `GET /api/tasks/user/:id` - Obtener tareas de un usuario
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `POST /api/test-reminders` - Probar envío de recordatorios

### Ejecución

1. Configura tus credenciales de email en `email.service.js`
2. Ejecuta el servidor:
   ```bash
   npm run dev
   ```
3. Inicia sesión con el usuario 202300001 (sershdiaz@hotmail.com)
4. Verás tus tareas asignadas
5. Haz clic en "Probar Recordatorios" para enviar un email de prueba

El servidor mostrará en la consola cuando envíe los emails.
