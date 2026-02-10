from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.utils import timezone
from users.models import User, Materia


def task_attachment_path(instance, filename):
    """Ruta para archivos adjuntos de tareas: media/tareas/{task_id}/{filename}"""
    return f'tareas/{instance.id or "temp"}/{filename}'


def submission_file_path(instance, filename):
    """Ruta para archivos de entregas: media/entregas/{task_id}/{student_id}/{filename}"""
    return f'entregas/{instance.submission.task.id}/{instance.submission.student.id_usuario}/{filename}'


class Task(models.Model):
    """Modelo de Tarea creada por docente"""
    
    ESTADO_CHOICES = [
        ('borrador', 'Borrador'),
        ('activa', 'Activa'),
        ('cerrada', 'Cerrada'),
    ]
    
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, default='')
    
    
    materia = models.ForeignKey(
        Materia,
        on_delete=models.PROTECT,  # No permitir eliminar materia si tiene tareas
        related_name='tareas',
        verbose_name='Materia',
        help_text='Materia a la que pertenece esta tarea'
    )
    
    archivo_adjunto = models.FileField(
        upload_to=task_attachment_path,
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 
                                   'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar', 'txt']
            )
        ]
    )
    url_recurso = models.URLField(max_length=500, blank=True, default='')
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    fecha_entrega = models.DateTimeField()
    
    docente = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='tareas_creadas',
        limit_choices_to={'rol': 'docente'}
    )
    
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='borrador')
    puntos_maximos = models.IntegerField(
        default=10,
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    permite_tardias = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'tareas'
        ordering = ['-fecha_creacion']
        verbose_name = 'Tarea'
        verbose_name_plural = 'Tareas'
        indexes = [
            models.Index(fields=['materia', 'estado']),
            models.Index(fields=['docente', 'estado']),
        ]
    
    def __str__(self):
        return f"{self.titulo} - {self.materia.nombre} ({self.get_estado_display()})"
    
    @property
    def esta_vencida(self):
        """Retorna True si la fecha de entrega ya pasó"""
        return timezone.now() > self.fecha_entrega
    
    @property
    def puede_recibir_entregas(self):
        """Retorna True si la tarea puede recibir entregas"""
        if self.estado != 'activa':
            return False
        if self.esta_vencida and not self.permite_tardias:
            return False
        return True


class Submission(models.Model):
    """Modelo de Entrega de un estudiante para una tarea"""
    
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('entregado', 'Entregado'),
        ('calificado', 'Calificado'),
    ]
    
    task = models.ForeignKey(
        Task, 
        on_delete=models.CASCADE, 
        related_name='submissions'
    )
    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='submissions',
        limit_choices_to={'rol': 'estudiante'}
    )
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='pendiente')
    
    # Calificación
    calificacion = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    comentario_docente = models.TextField(blank=True, default='')
    fecha_calificacion = models.DateTimeField(null=True, blank=True)
    
    # Control de recordatorios
    recordatorio_enviado = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'entregas'
        ordering = ['-fecha_creacion']
        unique_together = ['task', 'student']
        verbose_name = 'Entrega'
        verbose_name_plural = 'Entregas'
    
    def __str__(self):
        return f"{self.student.nombre_completo} - {self.task.titulo} ({self.get_estado_display()})"
    
    @property
    def tiene_entregas(self):
        """Retorna True si el estudiante ha subido al menos un archivo"""
        return self.archivos.exists()
    
    @property
    def ultima_entrega(self):
        """Retorna el archivo más reciente subido"""
        return self.archivos.order_by('-fecha_subida').first()


class SubmissionFile(models.Model):
    """Modelo de Archivo subido en una entrega"""
    
    submission = models.ForeignKey(
        Submission, 
        on_delete=models.CASCADE, 
        related_name='archivos'
    )
    archivo = models.FileField(
        upload_to=submission_file_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
                                   'jpg', 'jpeg', 'png', 'gif', 'zip', 'rar', 'txt',
                                   'py', 'js', 'html', 'css', 'java', 'cpp', 'c']
            )
        ]
    )
    nombre_original = models.CharField(max_length=255)
    fecha_subida = models.DateTimeField(auto_now_add=True)
    es_entrega_tardia = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'archivos_entrega'
        ordering = ['-fecha_subida']
        verbose_name = 'Archivo de Entrega'
        verbose_name_plural = 'Archivos de Entrega'
    
    def __str__(self):
        tardia = " (TARDÍA)" if self.es_entrega_tardia else ""
        return f"{self.nombre_original}{tardia}"
    
    def save(self, *args, **kwargs):
        # Guardar nombre original antes de guardar
        if not self.nombre_original and self.archivo:
            self.nombre_original = self.archivo.name.split('/')[-1]
        
        # Verificar si es entrega tardía
        if self.submission.task.esta_vencida:
            self.es_entrega_tardia = True
        
        super().save(*args, **kwargs)