# Instrucciones de Prueba - Sistema de Materias

## ✅ Implementación Completada

Se ha implementado exitosamente el sistema de carreras y materias con las siguientes características:

### Cambios en el Backend (Django)

1. **Modelo Materia** (`users/models.py`)
   - Tabla independiente con: código, nombre, NRC, carreras permitidas
   - 4 materias iniciales:
     - MDW (ITI)
     - SO1, SO2, IS (LCC/ICC compartidas)

2. **Modelo User** modificado
   - Campo `carrera` ahora usa choices: ICC, LCC, ITI
   - Campo `materias_estudiante` (ManyToMany)
   - Campo `materias_docente` (ManyToMany)

3. **Nuevos Endpoints**
   - `GET /api/materias?carrera=X` - Listar materias por carrera
   - `PATCH /api/users/materias` - Actualizar materias de usuario

4. **Validaciones**
   - Carrera obligatoria (estudiantes y docentes)
   - ITI: solo 1 materia (MDW)
   - LCC/ICC: 1 o más materias (SO1, SO2, IS)
   - Validación de materias según carrera

### Cambios en el Frontend

1. **Formulario de Registro** (`src/login.html`)
   - Campo carrera: combobox con 3 opciones
   - Campo materias: dinámico según carrera seleccionada
   - ITI: radio buttons (solo 1 opción)
   - LCC/ICC: checkboxes (múltiples opciones)
   - Carga dinámica de materias desde API

## 🚀 Pasos para Probar

### 1. Aplicar Migraciones en MySQL

```powershell
cd sistema_backend
python manage.py migrate
```

Esto creará:
- Tabla `materias` con 4 registros
- Campos `materias_estudiante` y `materias_docente`
- Modificará campo `carrera` a choices

### 2. Iniciar el Servidor Django

```powershell
cd sistema_backend
python manage.py runserver 3000
```

El servidor estará disponible en: `http://127.0.0.1:3000`

### 3. Probar con el Test HTML

Abre en tu navegador:
```
file:///C:/Users/jovas/Music/practica_scrum/test_frontend.html
```

Este archivo de prueba automatiza:
- ✅ Verificación de conexión con API
- ✅ Obtener materias por carrera
- ✅ Registro de estudiante ITI con MDW
- ✅ Registro de estudiante LCC con múltiples materias
- ✅ Registro de docente con múltiples materias
- ✅ Validación de restricciones carrera-materia

### 4. Probar el Formulario Real

Abre en tu navegador:
```
file:///C:/Users/jovas/Music/practica_scrum/src/login.html
```

**Flujo de registro:**

1. Click en "Registrarse"
2. Seleccionar tipo de usuario (Estudiante/Docente)
3. Completar datos personales
4. Seleccionar carrera del combobox
5. Automáticamente se cargan las materias disponibles
6. Seleccionar materias (1 para ITI, 1+ para LCC/ICC)
7. Click en "Crear Cuenta"

## 📋 Ejemplos de Prueba

### Estudiante ITI
- Carrera: Ingeniería en Tecnologías de la Información
- Materias disponibles: Modelos de Desarrollo Web — NRC: 49067
- Selección: 1 materia (obligatorio)

### Estudiante LCC
- Carrera: Licenciatura en Cs. de la Computación
- Materias disponibles:
  - Sistemas Operativos I — NRC: 50153
  - Sistemas Operativos II — NRC: 50165
  - Ingeniería de Software — NRC: 48189
- Selección: 1 o más materias

### Estudiante ICC
- Carrera: Ingeniería en Cs. de la Computación
- Materias disponibles: (iguales a LCC)
  - Sistemas Operativos I — NRC: 50153
  - Sistemas Operativos II — NRC: 50165
  - Ingeniería de Software — NRC: 48189
- Selección: 1 o más materias

### Docente
- Aplican las mismas reglas que estudiantes
- Debe seleccionar carrera
- Solo puede impartir materias de su carrera

## 🔍 Verificación en Base de Datos

Después de registrar usuarios, verifica en MySQL:

```sql
-- Ver materias creadas
SELECT * FROM materias;

-- Ver usuarios con sus carreras
SELECT id_usuario, nombre_completo, carrera, rol FROM users;

-- Ver materias de un estudiante
SELECT u.nombre_completo, m.nombre as materia, m.nrc
FROM users u
JOIN users_materias_estudiante ume ON u.id_usuario = ume.user_id
JOIN materias m ON ume.materia_id = m.id
WHERE u.rol = 'estudiante';

-- Ver materias de un docente
SELECT u.nombre_completo, m.nombre as materia, m.nrc
FROM users u
JOIN users_materias_docente umd ON u.id_usuario = umd.user_id
JOIN materias m ON umd.materia_id = m.id
WHERE u.rol = 'docente';
```

## ⚠️ Notas Importantes

1. **Migraciones**: Asegúrate de ejecutar `python manage.py migrate` antes de probar
2. **MySQL**: Debe estar ejecutándose (XAMPP activo)
3. **Puerto**: El backend debe estar en puerto 3000
4. **Datos existentes**: Los usuarios anteriores no tendrán materias asignadas (campo NULL/vacío) - pueden actualizarse con el endpoint PATCH

## 🛠️ Solución de Problemas

### Error: "No se puede conectar al servidor"
- Verifica que el servidor Django esté ejecutándose
- Confirma el puerto con `python manage.py runserver 3000`

### Error: "Materias no disponibles"
- Ejecuta las migraciones: `python manage.py migrate`
- Verifica que existan registros en tabla `materias`

### Error: "Las materias seleccionadas no corresponden..."
- Esto es esperado - la validación está funcionando
- Asegúrate de seleccionar materias correctas para cada carrera

## 📝 API Endpoints Disponibles

```
POST   /api/register          - Registro de usuarios (incluye materias)
POST   /api/login             - Login de usuarios
GET    /api/materias          - Listar todas las materias
GET    /api/materias?carrera=X - Filtrar materias por carrera (ITI/LCC/ICC)
PATCH  /api/users/materias    - Actualizar materias de usuario existente
```

## 🎯 Siguiente Paso

Una vez verificado que todo funciona correctamente en local, los cambios están listos para:
- Deployar a Railway/producción
- Integrar con el dashboard de estudiantes/docentes
- Vincular las tareas con las materias impartidas por el docente

¡Todo listo para probar! 🚀
