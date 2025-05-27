# from django.apps import AppConfig
# import os
# from django.conf import settings
# import py_eureka_client.eureka_client as eureka_client


# class AffectationConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'soutenance'
#     def ready(self):
#         # In DEBUG, ensure we only run in the main process to avoid duplicate registrations
#         if settings.DEBUG and os.environ.get('RUN_MAIN') != 'true':
#             return
        
#         # Initialize Eureka client
#         eureka_client.init(
#           eureka_server=settings.EUREKA_URL,
#           app_name=settings.EUREKA_APP_NAME,
#           instance_port=settings.PORT,
#           instance_host="service6-soutenance",  # Use Docker service name
#           instance_ip="service6-soutenance",    # Use Docker service name
#           data_center_name="MyOwn"
#         )

# import threading
# import asyncio
# from django.apps import AppConfig
# import os
# from django.conf import settings
# import py_eureka_client.eureka_client as eureka_client

# def async_eureka_init():
#     loop = asyncio.new_event_loop()
#     asyncio.set_event_loop(loop)
#     loop.run_until_complete(
#         eureka_client.init(
#             eureka_server=settings.EUREKA_URL,
#             app_name=settings.EUREKA_APP_NAME,
#             instance_port=settings.PORT,
#             instance_host="service6-soutenance",
#             instance_ip="service6-soutenance",
#             data_center_name="MyOwn"
#         )
#     )

# class SoutenanceConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'soutenance'

#     def ready(self):
#         if settings.DEBUG and os.environ.get('RUN_MAIN') != 'true':
#             return

#         # Run async eureka init in background thread
#         threading.Thread(target=async_eureka_init, daemon=True).start()
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
        instance_host="service6-soutenance",  # ou IP réelle
        instance_ip="service6-soutenance",
        data_center_name="MyOwn"
    )

class SoutenanceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'soutenance'

    def ready(self):
        if settings.DEBUG and os.environ.get('RUN_MAIN') != 'true':
            return

        # Lancement dans un thread (non bloquant, mais pas obligatoire)
        threading.Thread(target=eureka_init, daemon=True).start()