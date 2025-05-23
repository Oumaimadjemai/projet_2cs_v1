from django.apps import AppConfig
import os
from django.conf import settings
import py_eureka_client.eureka_client as eureka_client


class AffectationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'soutenance'
    def ready(self):
        # In DEBUG, ensure we only run in the main process to avoid duplicate registrations
        if settings.DEBUG and os.environ.get('RUN_MAIN') != 'true':
            return
        
        # Initialize Eureka client
        eureka_client.init(
            eureka_server=settings.EUREKA_URL,           # e.g., "http://localhost:8761/eureka/"
            app_name=settings.EUREKA_APP_NAME,          # e.g., "DJANGO-CLIENT"
            instance_port=settings.PORT,                # e.g., 8000
            instance_host="localhost",         # Use local hostname
            instance_ip="127.0.0.1",  # Use local IP
            data_center_name="MyOwn"                   # Match your previous dataCenterInfo
        )

