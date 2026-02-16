from django.urls import path
from . import views

urlpatterns = [
    # ==================== ENDPOINTS DOCENTE ====================
    # Tareas
    path('tasks/', views.task_list_create, name='task-list-create'),
    path('tasks/<int:task_id>/', views.task_detail, name='task-detail'),
    path('tasks/<int:task_id>/activate/', views.task_activate, name='task-activate'),
    path('tasks/<int:task_id>/close/', views.task_close, name='task-close'),
    path('tasks/<int:task_id>/submissions/', views.task_submissions, name='task-submissions'),
    
    # Calificaciones
    path('submissions/<int:submission_id>/grade/', views.grade_submission, name='grade-submission'),
    path('reports/grades/', views.grades_report, name='grades-report'),
    
    # Estudiantes
    path('students/', views.students_list, name='students-list'),

    # Materias del docente
    path('docente/materias/', views.docente_materias, name='docente-materias'),
    
    # ==================== ENDPOINTS ESTUDIANTE ====================
    path('my-tasks/', views.my_tasks, name='my-tasks'),
    path('my-tasks/<int:task_id>/', views.my_task_detail, name='my-task-detail'),
    path('my-tasks/<int:task_id>/submit/', views.submit_task, name='submit-task'),
    path('my-submissions/', views.my_submissions, name='my-submissions'),
]
