# Migración de datos para corregir valores NULL en materia_id

from django.db import migrations


def fix_null_materias(apps, schema_editor):
    """Asigna materia_id=1 a todas las tareas que tengan materia=NULL"""
    Task = apps.get_model('tareas', 'Task')
    Materia = apps.get_model('users', 'Materia')
    
    # Contar cuántas tareas tienen materia=NULL
    null_count = Task.objects.filter(materia__isnull=True).count()
    if null_count == 0:
        return  # No hay nada que arreglar
    
    # Verificar si existe la materia con id=1
    if Materia.objects.filter(id=1).exists():
        # Actualizar todas las tareas con materia=NULL
        Task.objects.filter(materia__isnull=True).update(materia_id=1)
        print(f"✓ Asignadas {null_count} tareas a materia_id=1")
    else:
        # Si no existe materia con id=1, usar la primera disponible
        first_materia = Materia.objects.first()
        if first_materia:
            Task.objects.filter(materia__isnull=True).update(materia_id=first_materia.id)
            print(f"✓ Asignadas {null_count} tareas a materia_id={first_materia.id}")
        else:
            print("⚠ No hay materias disponibles. Por favor cree al menos una materia.")


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_rename_email_logs_fecha_e_idx_email_logs_fecha_e_dcc5da_idx_and_more'),
        ('tareas', '0002_task_materia_task_tareas_materia_21acec_idx_and_more'),
    ]

    operations = [
        migrations.RunPython(fix_null_materias, reverse_code=migrations.RunPython.noop),
    ]
