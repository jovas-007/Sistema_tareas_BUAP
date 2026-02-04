from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Task, Submission
from users.models import User


@receiver(pre_save, sender=Task)
def task_state_change(sender, instance, **kwargs):
    """
    Detectar cuando una tarea cambia de estado a 'activa'
    para crear submissions para todos los estudiantes
    """
    if instance.pk:  # Solo si ya existe (es una actualización)
        try:
            old_instance = Task.objects.get(pk=instance.pk)
            instance._old_estado = old_instance.estado
        except Task.DoesNotExist:
            instance._old_estado = None
    else:
        instance._old_estado = None


@receiver(post_save, sender=Task)
def create_submissions_on_activate(sender, instance, created, **kwargs):
    """
    Cuando una tarea se activa, crear una Submission para cada estudiante
    """
    old_estado = getattr(instance, '_old_estado', None)
    
    # Solo crear submissions si:
    # 1. La tarea cambió de cualquier estado a 'activa'
    # 2. O si se creó directamente como 'activa'
    should_create = False
    
    if created and instance.estado == 'activa':
        should_create = True
    elif not created and old_estado != 'activa' and instance.estado == 'activa':
        should_create = True
    
    if should_create:
        # Obtener todos los estudiantes activos
        estudiantes = User.objects.filter(rol='estudiante', is_active=True)
        
        # Crear submission para cada estudiante que no tenga una
        submissions_to_create = []
        for estudiante in estudiantes:
            if not Submission.objects.filter(task=instance, student=estudiante).exists():
                submissions_to_create.append(
                    Submission(task=instance, student=estudiante)
                )
        
        if submissions_to_create:
            Submission.objects.bulk_create(submissions_to_create)
            print(f"✅ Creadas {len(submissions_to_create)} entregas para la tarea '{instance.titulo}'")
