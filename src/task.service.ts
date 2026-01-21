import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id_tarea: string;
  nombre_tarea: string;
  materia: string;
  fecha_entrega: string;
  usuarios_asignados: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Obtener todas las tareas
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);
  }

  // Obtener tareas de un usuario
  getUserTasks(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/user/${userId}`);
  }

  // Crear nueva tarea
  createTask(task: Omit<Task, 'id_tarea'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks`, task);
  }

  // Actualizar tarea
  updateTask(id: string, task: Partial<Task>): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}`, task);
  }

  // Eliminar tarea
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`);
  }

  // Probar recordatorios
  testReminders(): Observable<any> {
    return this.http.post(`${this.apiUrl}/test-reminders`, {});
  }
}
