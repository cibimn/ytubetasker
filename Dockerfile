# Use an official Python runtime as a base image
FROM python:3.8-slim-buster

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app/

# Install any needed packages specified in requirements.txt
RUN apt-get update && apt-get install -y gcc build-essential
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run Django development server when the container launches
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
