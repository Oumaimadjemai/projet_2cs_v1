# api/apps.py
import os
import atexit
import socket
import requests
from django.apps import AppConfig
from django.conf import settings

class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        # Dans DEBUG, s’assurer de n’exécuter que dans le vrai process
        if settings.DEBUG and os.environ.get('RUN_MAIN') != 'true':
            return
        register()
        atexit.register(deregister)

def register():
    hostname = socket.gethostname()
    ip = socket.gethostbyname(hostname)
    instance = {
        "instance": {
            "hostName": hostname,
            "app": settings.EUREKA_APP_NAME,        # variable unique par service
            "ipAddr": ip,
            "status": "UP",
            "port": {"$": settings.PORT, "@enabled": "true"},
            "dataCenterInfo": {
                "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                "name": "MyOwn"
            }
        }
    }
    headers = {'Content-Type': 'application/json'}
    requests.post(settings.EUREKA_URL + settings.EUREKA_APP_NAME, json=instance, headers=headers)

def deregister():
    hostname = socket.gethostname()
    requests.delete(settings.EUREKA_URL + settings.EUREKA_APP_NAME + '/' + hostname)
