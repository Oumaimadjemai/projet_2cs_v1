import requests
import socket
import atexit
from django.conf import settings

EUREKA_URL = 'http://registry:8761/eureka/apps/'

def register():
    hostname = socket.gethostname()
    ip = socket.gethostbyname(hostname)
    instance = {
        "instance": {
            "hostName": hostname,
            "app": "DJANGO-CLIENT",
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
    requests.post(EUREKA_URL + 'DJANGO-CLIENT', json=instance, headers=headers)

def deregister():
    hostname = socket.gethostname()
    requests.delete(EUREKA_URL + 'DJANGO-CLIENT/' + hostname)

atexit.register(deregister)
register()
