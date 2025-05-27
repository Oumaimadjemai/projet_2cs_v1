FROM python:3.12.10

# Avoid Python writing .pyc files to disk
ENV PYTHONDONTWRITEBYTECODE 1
# Show logs in real-time
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install dependencies
COPY ../requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt --default-timeout=8000

# Copy project
COPY . /code/

#  create media folder
RUN mkdir -p /code/media

# Rendre le script exécutable
RUN chmod +x /code/entrypoint.sh

# Expose the default Django port
EXPOSE 8000

# Run Django
ENTRYPOINT ["python", "manage.py", "runserver", "0.0.0.0:8000"]
