# from django.apps import AppConfig


# class ArchivageConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'archivage'

import os
import socket
from django.apps import AppConfig
from django.conf import settings
import py_eureka_client.eureka_client as eureka_client

class ArchivageConfig(AppConfig):
    name = 'archivage'

    def ready(self):
        # In DEBUG, ensure we only run in the main process to avoid duplicate registrations
        if settings.DEBUG and os.environ.get('RUN_MAIN') != 'true':
            return
        
        # Initialize Eureka client
        eureka_client.init(
          eureka_server=settings.EUREKA_URL,
          app_name=settings.EUREKA_APP_NAME,
          instance_port=settings.PORT,
          instance_host="service8-archive",  # Use Docker service name
          instance_ip="service8-archive",    # Use Docker service name
          data_center_name="MyOwn"
        )
