from django.apps import AppConfig


class TareasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tareas'
    verbose_name = 'Gestión de Tareas'
    
    def ready(self):
        # Importar señales cuando la app esté lista
        import tareas.signals
