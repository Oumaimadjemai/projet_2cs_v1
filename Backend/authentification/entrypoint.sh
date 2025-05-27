#!/bin/bash

# Démarrer le serveur Django en arrière-plan
python manage.py runserver 0.0.0.0:8000 &

# Lancer Celery worker
celery -A authentification worker --loglevel=info --pool=solo &

# Lancer Celery beat
celery -A authentification beat --loglevel=info

# Attendre tous les processus
wait
