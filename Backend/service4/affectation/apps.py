# # apps.py
from django.apps import AppConfig
import os
import threading
from django.conf import settings
import py_eureka_client.eureka_client as eureka_client

def eureka_init():
    eureka_client.init(
        eureka_server=settings.EUREKA_URL,
        app_name=settings.EUREKA_APP_NAME,
        instance_port=settings.PORT,
        instance_host="service4-affectation",  # ou IP réelle
        instance_ip="service4-affectation",
        data_center_name="MyOwn"
    )

class AffectationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'affectation'

    def ready(self):
        if settings.DEBUG and os.environ.get('RUN_MAIN') != 'true':
            return

        # Lancement dans un thread (non bloquant, mais pas obligatoire)
        threading.Thread(target=eureka_init, daemon=True).start()
