import logging
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from django.core.management.base import BaseCommand
from django_apscheduler.jobstores import DjangoJobStore
from django.core.management import call_command
from django.conf import settings

logger = logging.getLogger(__name__)

def run_all_jobs():
    logger.info("Avvio ciclo periodico (Fetch -> Process AI -> Daily Briefing)...")
    try:
        call_command('fetch_news')
        call_command('process_ai')
        call_command('generate_briefing')
        logger.info("Ciclo periodico completato con successo.")
    except Exception as e:
        logger.error(f"Errore nel ciclo periodico: {e}")

class Command(BaseCommand):
    help = "Avvia in background il demone APScheduler per i lavori automatici"

    def handle(self, *args, **options):
        scheduler = BlockingScheduler(timezone=settings.TIME_ZONE)
        scheduler.add_jobstore(DjangoJobStore(), "default")
        
        # Eseguiamo tutto il flusso completo ogni ora (o configurabilmente alle 08:00 ecc)
        scheduler.add_job(
            run_all_jobs,
            trigger=CronTrigger(minute="0"),  # Scatta all'inizio di ogni ora esatta
            id="master_news_automation",
            max_instances=1,
            replace_existing=True,
        )
        
        self.stdout.write(self.style.SUCCESS("🤖 Pilota Automatico attivato: in attesa dell'orario schedulato... (Premi CTRL+C per fermare)"))
        try:
            scheduler.start()
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING("Pilota Automatico fermato."))
            scheduler.shutdown()
