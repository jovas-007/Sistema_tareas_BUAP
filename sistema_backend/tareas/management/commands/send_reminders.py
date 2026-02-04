"""
Comando para enviar recordatorios de tareas que vencen en 24 horas.
Debe ejecutarse periódicamente (cada hora recomendado) mediante:
- Task Scheduler (Windows)
- cron (Linux/Mac)

Uso manual:
    python manage.py send_reminders

Para programar en Windows Task Scheduler:
    1. Abrir "Programador de tareas"
    2. Crear tarea básica
    3. Nombre: "Recordatorios Tareas Sistema"
    4. Desencadenador: Diario, repetir cada 1 hora
    5. Acción: Iniciar programa
       - Programa: C:\\Users\\jovas\\Music\\practica_scrum\\sistema_backend\\venv\\Scripts\\python.exe
       - Argumentos: manage.py send_reminders
       - Iniciar en: C:\\Users\\jovas\\Music\\practica_scrum\\sistema_backend
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from tareas.models import Task, Submission
from users.email_service import send_task_reminder_email


class Command(BaseCommand):
    help = 'Envía recordatorios por email de tareas que vencen en las próximas 24 horas'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Simular envío sin enviar emails realmente',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Enviar incluso si ya se envió recordatorio',
        )
    
    def handle(self, *args, **options):
        dry_run = options['dry_run']
        force = options['force']
        
        self.stdout.write(self.style.NOTICE('='*60))
        self.stdout.write(self.style.NOTICE('📧 SISTEMA DE RECORDATORIOS DE TAREAS'))
        self.stdout.write(self.style.NOTICE(f'   Fecha/Hora: {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}'))
        self.stdout.write(self.style.NOTICE('='*60))
        
        if dry_run:
            self.stdout.write(self.style.WARNING('⚠️  MODO SIMULACIÓN - No se enviarán emails'))
        
        # Buscar tareas activas que venzan entre ahora y las próximas 25 horas
        # (ventana de 23-25 horas para no perder ninguna por timing)
        ahora = timezone.now()
        limite_inferior = ahora + timedelta(hours=23)
        limite_superior = ahora + timedelta(hours=25)
        
        tareas_proximas = Task.objects.filter(
            estado='activa',
            fecha_entrega__gte=limite_inferior,
            fecha_entrega__lte=limite_superior
        )
        
        self.stdout.write(f'\n📋 Tareas que vencen en ~24 horas: {tareas_proximas.count()}')
        
        if not tareas_proximas.exists():
            self.stdout.write(self.style.SUCCESS('\n✅ No hay tareas próximas a vencer.'))
            return
        
        emails_enviados = 0
        emails_omitidos = 0
        emails_fallidos = 0
        
        for tarea in tareas_proximas:
            self.stdout.write(f'\n📝 Tarea: {tarea.titulo}')
            self.stdout.write(f'   Vence: {tarea.fecha_entrega.strftime("%Y-%m-%d %H:%M")}')
            
            # Obtener submissions pendientes (no entregadas)
            submissions_pendientes = Submission.objects.filter(
                task=tarea,
                estado='pendiente'
            ).select_related('student')
            
            if not force:
                submissions_pendientes = submissions_pendientes.filter(
                    recordatorio_enviado=False
                )
            
            self.stdout.write(f'   Estudiantes pendientes: {submissions_pendientes.count()}')
            
            for submission in submissions_pendientes:
                estudiante = submission.student
                
                # Formatear fecha para el email
                fecha_formateada = tarea.fecha_entrega.strftime('%d/%m/%Y a las %H:%M')
                
                if dry_run:
                    self.stdout.write(f'   📧 [SIMULADO] {estudiante.correo}')
                    emails_enviados += 1
                else:
                    try:
                        enviado = send_task_reminder_email(
                            nombre_completo=estudiante.nombre_completo,
                            correo=estudiante.correo,
                            titulo_tarea=tarea.titulo,
                            fecha_entrega=fecha_formateada
                        )
                        
                        if enviado:
                            # Marcar como enviado
                            submission.recordatorio_enviado = True
                            submission.save()
                            
                            self.stdout.write(
                                self.style.SUCCESS(f'   ✅ Enviado a {estudiante.correo}')
                            )
                            emails_enviados += 1
                        else:
                            self.stdout.write(
                                self.style.ERROR(f'   ❌ Falló envío a {estudiante.correo}')
                            )
                            emails_fallidos += 1
                            
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(f'   ❌ Error: {str(e)}')
                        )
                        emails_fallidos += 1
        
        # Resumen
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.NOTICE('📊 RESUMEN'))
        self.stdout.write(f'   Emails enviados: {emails_enviados}')
        self.stdout.write(f'   Emails omitidos: {emails_omitidos}')
        self.stdout.write(f'   Emails fallidos: {emails_fallidos}')
        self.stdout.write('='*60 + '\n')
        
        if emails_fallidos > 0:
            self.stdout.write(
                self.style.WARNING('⚠️  Hubo errores en algunos envíos. Revisa los logs.')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS('✅ Proceso completado exitosamente.')
            )
