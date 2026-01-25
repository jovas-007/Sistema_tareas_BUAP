# Estructura del Proyecto - Sistema de Gestión de Tareas

## 📁 Estructura Completa

```
practica_scrum/
│
├── 📂 database/                         # ✨ NUEVO - Base de datos
│   ├── users.json                       # Usuarios con campo 'rol'
│   └── tasks.json                       # Tareas del sistema
│
├── 📂 src/
│   │
│   ├── 📂 screens/                      # ✨ NUEVO - Pantallas organizadas
│   │   ├── login.component.ts          # ✨ ACTUALIZADO - Con selector de roles
│   │   ├── student-dashboard.html      # ✨ NUEVO - Dashboard estudiante
│   │   ├── admin-dashboard.html        # ✨ NUEVO - Dashboard administrador
│   │   └── tareas.html                 # Movido desde /src
│   │
│   ├── 📂 services/                     # ✨ NUEVO - Servicios organizados
│   │   └── auth.service.ts             # ✨ ACTUALIZADO - Con manejo de roles
│   │
│   ├── 📂 assets/                       # ✨ NUEVO - Recursos estáticos
│   │   └── diseños.css                 # CSS del sistema
│   │
│   ├── app.component.ts                # ✨ ACTUALIZADO - Importa desde /screens
│   ├── main.ts                         # Sin cambios
│   ├── index-angular.html              # Sin cambios
│   ├── styles.css                      # Sin cambios
│   │
│   └── [archivos antiguos]             # Mantener por compatibilidad
│       ├── login.component.ts          # Original (deprecado)
│       ├── auth.service.ts             # Original (deprecado)
│       ├── pantalla_inicio.html        # Original
│       ├── pruebas.js                  # Original
│       └── diseños.css                 # Original
│
├── server.js                           # ✨ ACTUALIZADO - Rutas a /database
├── email.service.js                    # Sin cambios
├── package.json                        # Sin cambios
├── angular.json                        # Sin cambios
├── tsconfig.json                       # Sin cambios
│
├── student-dashboard.html              # ✨ NUEVO - Acceso directo
├── admin-dashboard.html                # ✨ NUEVO - Acceso directo
│
├── README.md                           # Original
├── CAMBIOS_ROLES.md                    # ✨ NUEVO - Documentación
└── ESTRUCTURA.md                       # ✨ NUEVO - Este archivo
```

## 🎯 Archivos Clave Modificados

### 1. `/database/users.json`
- ✨ Agregado campo `rol` a todos los usuarios
- Tipos: "administrador" | "estudiante"

### 2. `/src/screens/login.component.ts`
- ✨ Selector de tipo de usuario
- ✨ Formulario dinámico según rol
- ✨ Validaciones específicas por rol
- ✨ Redirección según rol

### 3. `/src/services/auth.service.ts`
- ✨ Métodos `isAdmin()` y `isStudent()`
- ✨ Almacenamiento de rol en localStorage
- ✨ Validación de rol en login

### 4. `/server.js`
- ✨ Rutas actualizadas: `./database/users.json`
- ✨ Validación de rol en registro
- ✨ Campo rol obligatorio

### 5. `/src/app.component.ts`
- ✨ Import actualizado: `./screens/login.component`

## 🆕 Archivos Nuevos

1. **Dashboard Estudiante**
   - `src/screens/student-dashboard.html`
   - Muestra: tareas, información académica, matrícula

2. **Dashboard Administrador**
   - `src/screens/admin-dashboard.html`
   - Muestra: estadísticas, opciones de gestión

3. **Documentación**
   - `CAMBIOS_ROLES.md` - Detalle de cambios
   - `ESTRUCTURA.md` - Este archivo

## 🔄 Flujo de Navegación

```
Login (index-angular.html)
    │
    ├─→ Estudiante Login
    │       │
    │       └─→ student-dashboard.html
    │               └─→ tareas.html (mis tareas)
    │
    └─→ Administrador Login
            │
            └─→ admin-dashboard.html
                    ├─→ Crear tareas (preparado)
                    ├─→ Ver tareas (preparado)
                    ├─→ Gestionar estudiantes (preparado)
                    └─→ Más opciones...
```

## ⚙️ Configuración Recomendada

### Para Desarrollo
```bash
# Terminal 1 - Servidor backend
node server.js

# Terminal 2 - Angular (si usas)
ng serve
```

### URLs de Acceso
- **Login**: http://localhost:3000/src/index-angular.html
- **Dashboard Estudiante**: http://localhost:3000/src/screens/student-dashboard.html
- **Dashboard Admin**: http://localhost:3000/src/screens/admin-dashboard.html
- **Tareas**: http://localhost:3000/src/screens/tareas.html

## 📝 Notas Importantes

1. Los archivos antiguos en `/src` se mantienen por compatibilidad
2. La nueva estructura está en `/src/screens` y `/src/services`
3. Los archivos de base de datos están en `/database`
4. El sistema redirige automáticamente según el rol del usuario
5. Las funcionalidades de administrador están preparadas pero no completamente implementadas

## 🎨 Diseño del Selector de Roles

El selector muestra:
```
TIPO DE USUARIO
⭕ Administrador    ⭕ Estudiante
```

Al seleccionar, aparece:
```
Registrando como: [Administrador/Estudiante] [Cambiar]
[Formulario adaptado al rol]
```

---
Última actualización: 23 de enero de 2026
