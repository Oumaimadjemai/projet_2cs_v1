# import os
# import atexit
# import socket
# import requests
# from django.apps import AppConfig
# from django.conf import settings

# class ApiConfig(AppConfig):
#     name = 'creationTheme'

#     def ready(self):
#         # Dans DEBUG, s’assurer de n’exécuter que dans le vrai process
#         if settings.DEBUG and os.environ.get('RUN_MAIN') != 'true':
#             return
#         register()
#         atexit.register(deregister)

# def register():
#     hostname = socket.gethostname()
#     ip = socket.gethostbyname(hostname)
#     instance = {
#         "instance": {
#             "hostName": hostname,
#             "app": settings.EUREKA_APP_NAME,        # variable unique par service
#             "ipAddr": ip,
#             "status": "UP",
#             "port": {"$": settings.PORT, "@enabled": "true"},
#             "dataCenterInfo": {
#                 "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
#                 "name": "MyOwn"
#             }
#         }
#     }
#     headers = {'Content-Type': 'application/json'}
#     requests.post(settings.EUREKA_URL + settings.EUREKA_APP_NAME, json=instance, headers=headers)

# def deregister():
#     hostname = socket.gethostname()
#     requests.delete(settings.EUREKA_URL + settings.EUREKA_APP_NAME + '/' + hostname)

# import os
# import socket
# from django.apps import AppConfig
# from django.conf import settings
# import py_eureka_client.eureka_client as eureka_client

# class ApiConfig(AppConfig):
#     name = 'creationTheme'

#     def ready(self):
#         # In DEBUG, ensure we only run in the main process to avoid duplicate registrations
#         if settings.DEBUG and os.environ.get('RUN_MAIN') != 'true':
#             return
        
#         # Initialize Eureka client
#         eureka_client.init(
#           eureka_server=settings.EUREKA_URL,
#           app_name=settings.EUREKA_APP_NAME,
#           instance_port=settings.PORT,
#           instance_host="service2-depot",  # Use Docker service name
#           instance_ip="service2-depot",    # Use Docker service name
#           data_center_name="MyOwn"
#         )

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
        instance_host="service2-depot",  # ou IP réelle
        instance_ip="service2-depot",
        data_center_name="MyOwn"
    )

class CreationThemeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'creationTheme'

    def ready(self):
        if settings.DEBUG and os.environ.get('RUN_MAIN') != 'true':
            return

        # Lancement dans un thread (non bloquant, mais pas obligatoire)
        threading.Thread(target=eureka_init, daemon=True).start()