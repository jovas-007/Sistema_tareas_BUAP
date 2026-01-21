import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inicio-container">
      <header class="header">
        <h1>Sistema de Gestión de Tareas Escolares</h1>
        <div class="user-info">
          <span>👤 {{ userName }}</span>
          <button class="btn-logout" (click)="logout()">Cerrar Sesión</button>
        </div>
      </header>

      <div class="welcome-section">
        <h2>¡Bienvenido, {{ userName }}!</h2>
        <p>Selecciona una opción para continuar:</p>
      </div>

      <div class="menu-grid">
        <div class="menu-card" (click)="goToTasks()">
          <div class="menu-icon">📋</div>
          <h3>Mis Tareas</h3>
          <p>Ver y gestionar tus tareas asignadas</p>
        </div>

        <div class="menu-card">
          <div class="menu-icon">📚</div>
          <h3>Materias</h3>
          <p>Ver tus materias y horarios</p>
          <span class="badge-soon">Próximamente</span>
        </div>

        <div class="menu-card">
          <div class="menu-icon">📊</div>
          <h3>Estadísticas</h3>
          <p>Revisa tu progreso académico</p>
          <span class="badge-soon">Próximamente</span>
        </div>

        <div class="menu-card">
          <div class="menu-icon">👥</div>
          <h3>Perfil</h3>
          <p>Actualiza tu información personal</p>
          <span class="badge-soon">Próximamente</span>
        </div>
      </div>

      <div class="info-box">
        <h4>📢 Información del Sistema</h4>
        <ul>
          <li>✅ Recibirás recordatorios automáticos por email 24 horas antes de cada entrega</li>
          <li>✅ Los recordatorios se envían diariamente a las 9:00 AM</li>
          <li>✅ Puedes probar el envío manual desde la sección de Tareas</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .inicio-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .header {
      background: white;
      padding: 20px 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .header h1 {
      margin: 0;
      color: #2c3e50;
      font-size: 24px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-info span {
      color: #34495e;
      font-weight: 500;
    }

    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-logout:hover {
      background: #c0392b;
    }

    .welcome-section {
      background: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .welcome-section h2 {
      color: #2c3e50;
      margin: 0 0 10px 0;
    }

    .welcome-section p {
      color: #7f8c8d;
      margin: 0;
      font-size: 16px;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto 30px;
    }

    .menu-card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      position: relative;
    }

    .menu-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 8px 15px rgba(0,0,0,0.2);
    }

    .menu-card:first-child {
      border: 2px solid #3498db;
    }

    .menu-card:first-child:hover {
      background: #ebf5fb;
    }

    .menu-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .menu-card h3 {
      color: #2c3e50;
      margin: 0 0 10px 0;
    }

    .menu-card p {
      color: #7f8c8d;
      margin: 0;
      font-size: 14px;
    }

    .badge-soon {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #95a5a6;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 11px;
      font-weight: bold;
    }

    .info-box {
      background: white;
      padding: 25px;
      border-radius: 10px;
      max-width: 800px;
      margin: 0 auto;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .info-box h4 {
      margin-top: 0;
      color: #2c3e50;
      font-size: 18px;
    }

    .info-box ul {
      margin: 15px 0 0 0;
      padding-left: 20px;
    }

    .info-box li {
      color: #34495e;
      margin: 10px 0;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .menu-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InicioComponent implements OnInit {
  userName = '';
  showTasks = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nombre_completo;
    }
  }

  goToTasks() {
    window.dispatchEvent(new Event('navigate-to-tasks'));
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
