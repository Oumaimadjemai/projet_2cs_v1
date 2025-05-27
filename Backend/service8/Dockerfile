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
FROM python:3.12.10

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

# First copy only requirements to cache pip install
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt --default-timeout=8005

# Then copy everything else
COPY . .

# Create media directory
RUN mkdir -p /code/media

# Convert line endings and make executable
RUN sed -i 's/\r$//' /code/entrypoint.sh && \
    chmod +x /code/entrypoint.sh

EXPOSE 8005

# Use exec form for proper signal handling
ENTRYPOINT ["/code/entrypoint.sh"]
# Entrypoint personnalisé
ENTRYPOINT ["/code/entrypoint.sh"]
