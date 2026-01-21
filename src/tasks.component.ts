import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from './task.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tasks-container">
      <div class="header">
        <div class="header-left">
          <button class="btn-back" (click)="goBack()">← Volver</button>
          <h2>📋 Mis Tareas</h2>
        </div>
        <button class="btn-test" (click)="testReminders()">🔔 Probar Recordatorios</button>
      </div>

      <div *ngIf="message" [ngClass]="'message ' + messageType">
        {{ message }}
      </div>

      <div class="tasks-list">
        <div *ngIf="tasks.length === 0" class="no-tasks">
          <p>No tienes tareas asignadas 📚</p>
        </div>

        <div *ngFor="let task of tasks" class="task-card" [class.urgent]="isUrgent(task)">
          <div class="task-header">
            <h3>{{ task.nombre_tarea }}</h3>
            <span class="task-id">{{ task.id_tarea }}</span>
          </div>
          
          <div class="task-details">
            <p><strong>📖 Materia:</strong> {{ task.materia }}</p>
            <p><strong>📅 Entrega:</strong> {{ formatDate(task.fecha_entrega) }}</p>
            <p><strong>⏰ Tiempo restante:</strong> {{ getTimeRemaining(task.fecha_entrega) }}</p>
          </div>

          <div class="task-footer">
            <span class="badge" [class.badge-urgent]="isUrgent(task)">
              {{ isUrgent(task) ? '⚠️ Urgente' : '✅ Normal' }}
            </span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>📧 Recordatorios Automáticos</h3>
        <p>Recibirás un email de recordatorio un día antes de cada fecha de entrega a las 9:00 AM.</p>
        <p>Correo registrado: <strong>{{ userEmail }}</strong></p>
      </div>
    </div>
  `,
  styles: [`
    .tasks-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .header h2 {
      color: #2c3e50;
      margin: 0;
    }

    .btn-back {
      background: #95a5a6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.3s;
    }

    .btn-back:hover {
      background: #7f8c8d;
    }

    .btn-test {
      background: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    }

    .btn-test:hover {
      background: #2980b9;
    }

    .message {
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
      font-weight: 500;
      background: white;
    }

    .message.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .message.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .tasks-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .no-tasks {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px;
      color: #2c3e50;
      font-size: 18px;
      background: white;
      border-radius: 10px;
    }

    .task-card {
      background: white;
      border: 2px solid #ecf0f1;
      border-radius: 10px;
      padding: 20px;
      transition: all 0.3s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .task-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .task-card.urgent {
      border-color: #e74c3c;
      background: #fff5f5;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 2px solid #ecf0f1;
    }

    .task-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 18px;
      flex: 1;
    }

    .task-id {
      background: #3498db;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      font-weight: bold;
    }

    .task-details p {
      margin: 10px 0;
      color: #34495e;
      font-size: 14px;
    }

    .task-footer {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #ecf0f1;
    }

    .badge {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      background: #2ecc71;
      color: white;
    }

    .badge.badge-urgent {
      background: #e74c3c;
    }

    .info-section {
      background: white;
      border-left: 4px solid #3498db;
      padding: 20px;
      border-radius: 5px;
      margin-top: 30px;
    }

    .info-section h3 {
      margin-top: 0;
      color: #2c3e50;
    }

    .info-section p {
      color: #34495e;
      margin: 10px 0;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
      }

      .header-left {
        width: 100%;
        justify-content: space-between;
      }

      .btn-test {
        width: 100%;
      }
    }
  `]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  message = '';
  messageType: 'success' | 'error' = 'success';
  userEmail = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserTasks();
  }

  loadUserTasks() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userEmail = currentUser.correo || '';
      this.taskService.getUserTasks(currentUser.id_usuario).subscribe({
        next: (tasks) => {
          this.tasks = tasks.sort((a, b) => 
            new Date(a.fecha_entrega).getTime() - new Date(b.fecha_entrega).getTime()
          );
        },
        error: (err) => {
          this.showMessage('Error al cargar tareas', 'error');
          console.error(err);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeRemaining(dateString: string): string {
    const now = new Date();
    const deadline = new Date(dateString);
    const diff = deadline.getTime() - now.getTime();

    if (diff < 0) {
      return '❌ Vencida';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days === 0) {
      return `⏰ ${hours} horas`;
    } else if (days === 1) {
      return `⚠️ ¡Mañana!`;
    } else {
      return `📅 ${days} días`;
    }
  }

  isUrgent(task: Task): boolean {
    const now = new Date();
    const deadline = new Date(task.fecha_entrega);
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    return days <= 1 && diff > 0;
  }

  testReminders() {
    this.taskService.testReminders().subscribe({
      next: (response) => {
        this.showMessage('✅ Recordatorios de prueba enviados. Revisa tu correo.', 'success');
      },
      error: (err) => {
        this.showMessage('❌ Error al enviar recordatorios', 'error');
        console.error(err);
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.message = '', 5000);
  }

  goBack() {
    window.dispatchEvent(new Event('navigate-to-inicio'));
  }
}
