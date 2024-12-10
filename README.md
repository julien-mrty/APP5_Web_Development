Web Application Setup
This repository contains a three-tier web application composed of:

Frontend: Vue.js application served by Nginx.
Backend: A Go-based REST API using GORM and MySQL.
MySQL Database: Stores user accounts, scores, and game data.
All components are orchestrated via Docker Compose, making it easy to get up and running quickly.

Prerequisites
Git installed on your machine.
Docker and Docker Compose installed.

Getting Started

1) Clone the Repository
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

2) Build and Start the Containers
From the project root directory (where docker-compose.yml is located), run:
docker-compose build
docker-compose up

This will:
Build the frontend, backend, and database images.
Start the services and link them together using Docker’s internal network.

3) Accessing the Application
Once the containers are up, the application will be available at:
Frontend: http://localhost:8080
The frontend will communicate with the backend through the configured proxy. The backend runs internally on port 8081, and MySQL on 3306, but you only need to interact with the frontend URL above.

4) Stopping the Application
To stop the containers, press Ctrl+C in the terminal where docker-compose up is running. To remove containers and associated networks, run:
docker-compose down

Notes
Database Persistence:
A Docker volume is used for MySQL data persistence. This ensures data is not lost when you stop and remove the containers. If you want a fresh start, you can remove the volume:
docker-compose down -v
This will remove all volumes and thus delete the database data.

Rebuilding After Changes:
If you make changes to the code, run:
docker-compose build
docker-compose up
again to rebuild and restart the updated services.

Troubleshooting
If the frontend or backend container fails to start or you run into database connection issues, ensure that Docker is running and that no other process on your host is occupying the same ports.
The backend includes retry logic for database connection and will wait for MySQL to be ready.
If you modify environment variables or .env files, rebuild the images or restart the containers to apply changes.
For further customizations, refer to the Docker Compose file and the service Dockerfiles. Feel free to open issues or submit pull requests if you encounter problems or want to contribute.