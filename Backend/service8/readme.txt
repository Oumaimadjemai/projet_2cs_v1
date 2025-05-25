lancer celery
celery -A service8 worker --loglevel=info --pool=solo
celery -A service8  beat --loglevel=info

install:
pip install django-celery-results

#tester dans django-shell:
In [1]: >>> from archivage.tasks import archiver_soutenances_task
   ...: >>> archiver_soutenances_task()          # test synchrone
   ...: >>> task_result = archiver_soutenances_task.delay()  # test asynchrone
   ...: >>> task_result.status
   ...: >>> task_result.get()
