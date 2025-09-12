#!/bin/bash
# build.sh

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Start Gunicorn with correct WSGI path
gunicorn step.wsgi:application --bind 0.0.0.0:$PORT