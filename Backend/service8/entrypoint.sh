#!/bin/bash

# Démarrer le serveur Django en arrière-plan
python manage.py runserver 0.0.0.0:8005 &

# Lancer Celery worker
celery -A service8 worker --loglevel=info --pool=solo &

# Lancer Celery beat
celery -A service8 beat --loglevel=info

# Attendre tous les processus
wait
