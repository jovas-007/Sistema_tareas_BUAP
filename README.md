# Sistema de Autenticación - Práctica SCRUM

Este es un proyecto de sistema de autenticación desarrollado con Angular y Node.js/Express.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) (se instala automáticamente con Node.js)

## 🚀 Instalación

1. **Clona o descarga el proyecto**

2. **Instala las dependencias**

   Abre una terminal en la carpeta del proyecto y ejecuta:

   ```bash
   npm install
   ```

   Esto instalará todas las dependencias necesarias tanto para Angular como para el servidor backend.

## ▶️ Cómo Ejecutar el Proyecto

Tienes tres opciones para ejecutar el proyecto:

### Opción 1: Ejecutar Frontend y Backend simultáneamente (Recomendado)

```bash
npm run dev
```

Este comando ejecuta tanto el servidor backend como el frontend de Angular al mismo tiempo.

- **Backend**: Se ejecutará en `http://localhost:3000`
- **Frontend**: Se ejecutará en `http://localhost:4200`

### Opción 2: Ejecutar solo el Frontend

```bash
npm start
```

El frontend estará disponible en `http://localhost:4200`

### Opción 3: Ejecutar solo el Backend

```bash
npm run server
```

El servidor backend estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
practica_scrum/
├── src/                      # Código fuente de Angular
│   ├── app.component.ts      # Componente principal
│   ├── auth.service.ts       # Servicio de autenticación
│   ├── login.component.ts    # Componente de login
│   ├── main.ts              # Punto de entrada de Angular
│   └── ...
├── server.js                # Servidor backend Express
├── users.json              # Base de datos de usuarios (JSON)
├── package.json            # Dependencias del proyecto
├── angular.json            # Configuración de Angular
└── tsconfig.json           # Configuración de TypeScript
```

## 🔑 Usuarios Predeterminados

El sistema incluye usuarios predeterminados para pruebas:

- **Usuario 1:**
  - ID: `201912345`
  - Contraseña: `admin123`
  - Correo: `admin@buap.mx`

- **Usuario 2:**
  - ID: `202268439`
  - Contraseña: `samd`
  - Correo: `jovany.solis@alumno.buap.mx`

- **Usuario 3:**
  - ID: `202300001`
  - Contraseña: `sersh123`
  - Correo: `sershdiaz@hotmail.com`

## 🛠️ Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo de Angular
- `npm run server` - Inicia el servidor backend
- `npm run dev` - Inicia frontend y backend simultáneamente
- `npm run build` - Compila el proyecto Angular para producción

## 📝 Endpoints del API

El servidor backend expone los siguientes endpoints:

### Usuarios
- `POST /api/login` - Autenticación de usuarios
- `POST /api/register` - Registro de nuevos usuarios
- `GET /api/users` - Obtener lista de usuarios
- `PUT /api/users/:id` - Actualizar información de usuario

### Tareas
- `GET /api/tasks` - Obtener todas las tareas
- `GET /api/tasks/user/:id` - Obtener tareas de un usuario específico
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea existente
- `DELETE /api/tasks/:id` - Eliminar tarea

### Recordatorios
- `POST /api/test-reminders` - Probar envío manual de recordatorios por email

## 🔔 Sistema de Recordatorios

El sistema incluye recordatorios automáticos por email:

- **Automático**: Envía emails diariamente a las 9:00 AM para tareas que vencen al día siguiente
- **Manual**: Botón "Probar Recordatorios" en la pantalla de tareas
- **Configuración**: Ver archivo `HOTMAIL_CONFIG.md` para configuración de email

## 🖥️ Pantallas de la Aplicación

1. **Login/Registro**: Autenticación de usuarios
2. **Pantalla de Inicio**: Menú principal con acceso a todas las funcionalidades
3. **Pantalla de Tareas**: Gestión de tareas y recordatorios

## ⚙️ Configuración Adicional

Para configurar el servicio de email, consulta:
- `CONFIGURACION_EMAIL.md` - Guía general de configuración de email
- `HOTMAIL_CONFIG.md` - Instrucciones específicas para Hotmail/Outlook
- `DELETE /api/users/:id` - Eliminar usuario

## 🐛 Solución de Problemas

### Error: Puerto en uso

Si recibes un error indicando que el puerto está en uso:

- Para el frontend (puerto 4200): Cierra otras instancias de Angular o cambia el puerto en `angular.json`
- Para el backend (puerto 3000): Cierra otras aplicaciones usando el puerto 3000 o modifica `PORT` en `server.js`

### Error: Módulos no encontrados

Ejecuta nuevamente:

```bash
npm install
```

### Error de CORS

El servidor ya está configurado con CORS habilitado. Si aún tienes problemas, verifica que el servidor backend esté ejecutándose correctamente.

## 📞 Soporte

Si encuentras algún problema, verifica:

1. Que Node.js esté correctamente instalado: `node --version`
2. Que npm esté instalado: `npm --version`
3. Que todas las dependencias estén instaladas: `npm install`
4. Que los puertos 3000 y 4200 estén disponibles

## 📄 Licencia

Este proyecto es parte de una práctica académica.
