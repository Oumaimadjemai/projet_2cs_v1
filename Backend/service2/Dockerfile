FROM python:3.12.10

# Avoid Python writing .pyc files to disk
ENV PYTHONDONTWRITEBYTECODE 1
# Show logs in real-time
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt --default-timeout=8001

# Copy project
COPY . /code/

#  create media folder
RUN mkdir -p /code/media

# Expose the default Django port
EXPOSE 8001

# Run Django
ENTRYPOINT ["python", "manage.py", "runserver", "0.0.0.0:8001"]
