# Sistema de Gestión de Tareas - BUAP
# Script de inicio rápido

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sistema de Gestion de Tareas - BUAP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Iniciando servidor..." -ForegroundColor Yellow
Write-Host ""
Write-Host "URLs de acceso:" -ForegroundColor Green
Write-Host "  - Login: http://localhost:3000/src/index-angular.html" -ForegroundColor White
Write-Host "  - Dashboard Estudiante: http://localhost:3000/src/screens/student-dashboard.html" -ForegroundColor White
Write-Host "  - Dashboard Admin: http://localhost:3000/src/screens/admin-dashboard.html" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

node server.js
