# Guía de Despliegue

## Opciones de Hosting Recomendadas

### 1. **Railway.app** (RECOMENDADO - Más Fácil)
✅ Gratis con 500 horas/mes
✅ Fácil de configurar
✅ Soporta Node.js nativamente

**Pasos:**
1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Railway detectará automáticamente tu proyecto Node.js
4. Haz deploy

### 2. **Render.com** (Alternativa Excelente)
✅ Gratis
✅ Auto-deploy desde GitHub
✅ SSL incluido

**Pasos:**
1. Ve a [render.com](https://render.com)
2. Crea un nuevo "Web Service"
3. Conecta tu repositorio
4. Build Command: `npm install`
5. Start Command: `npm start`

### 3. **Vercel** (Para proyectos pequeños)
✅ Gratis
✅ Muy rápido
✅ Excelente para Angular

**Nota:** Requiere configuración adicional para el backend

### 4. **Heroku** (Tradicional)
✅ Conocido
✅ Documentación extensa
⚠️ Ya no tiene plan gratuito

## Instrucciones Generales

### Preparar el proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Construir el proyecto Angular
npm run build

# 3. Probar localmente
npm start
```

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:
```
PORT=3000
NODE_ENV=production
```

### Ejecutar en Local

```bash
# Desarrollo (Angular + Backend separados)
npm run dev

# Producción (todo desde un servidor)
npm start
```

## Configuración Específica por Plataforma

### Railway
1. No requiere configuración adicional
2. Detecta automáticamente `package.json`
3. Ejecuta `npm start`

### Render
```yaml
# render.yaml (opcional)
services:
  - type: web
    name: practica-scrum
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
```

### Configuración de Puerto
El servidor ya está configurado para usar `process.env.PORT`, que es proporcionado automáticamente por la mayoría de plataformas de hosting.

## Problemas Comunes

### Error: Puerto ya en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: Módulos no encontrados
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de compilación Angular
```bash
npm run build -- --verbose
```

## Acceder a tu aplicación

Una vez desplegada, tu aplicación estará disponible en:
- Railway: `https://tu-app.up.railway.app`
- Render: `https://tu-app.onrender.com`
- Vercel: `https://tu-app.vercel.app`

## Monitoreo

Todas las plataformas proporcionan:
- Logs en tiempo real
- Métricas de uso
- Alertas automáticas
