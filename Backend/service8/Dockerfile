FROM python:3.12.10

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt --default-timeout=8005

COPY . /code/

RUN mkdir -p /code/media

# Rendre le script exécutable
RUN chmod +x /code/entrypoint.sh

EXPOSE 8005

# Entrypoint personnalisé
ENTRYPOINT ["/code/entrypoint.sh"]
