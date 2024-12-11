# Web Application Setup
## This repository contains a three-tier web application composed of:

Frontend: Vue.js application served by Nginx.
Backend: A Go-based REST API using GORM and MySQL.
MySQL Database: Stores user accounts, scores, and game data.
All components are orchestrated via Docker Compose, making it easy to get up and running quickly.

### About the Application
Our web application is an endless game where players aim to achieve the highest possible score. To play, users must:<br />
- Create an account using the sign-up form.<br />
- Log in to access the game.<br />
- View their scores: Scores are saved automatically and can be consulted from a dedicated scores page.<br />
This application provides user-friendly functionality for account management and score tracking.<br />

### Linting and Quality Assurance
We use linters to ensure code quality and maintainability:<br />
- Frontend (Vue.js): ESLint<br />
- Backend (Golang): golangci-lint<br />
GitHub Actions runs these linters automatically for every push and pull request, ensuring consistent code standards.<br />

### Prerequisites<br />
Git installed on your machine. <br />
Git : `https://git-scm.com/downloads` <br />
Docker and Docker Compose installed. <br />
You can follow these links to install <br />
Docker : `https://docs.docker.com/engine/install/`<br />
Docker Compose : `https://docs.docker.com/compose/install/`<br />

### Getting Started

1) **Clone the Repository:**<br />
`git clone https://github.com/julien-mrty/Web_app_jump_higher.git`<br />
`cd Web_app_jump_higher`<br />

2) **Build and Start the Containers:**<br />
From the project root directory (where docker-compose.yml is located), run:<br />
`docker-compose build --no-cache`<br />
`docker-compose up`<br />
This will:<br />
Build the frontend, backend, and database images.<br />
Start the services and link them together using Docker’s internal network.<br />

3) **Accessing the Application:**<br />
Once the containers are up, the application will be available at:<br />
Frontend: `http://localhost:8080` <br />
The frontend will communicate with the backend through the configured proxy. The backend runs internally on port 8081, and MySQL on 3306, but you only need to interact with the frontend URL above.

4) **Accessing Swagger Documentation:**<br />
The backend provides Swagger documentation for the API. You can access it at:<br />
Swagger Documentation: `http://localhost:8081/swagger/index.html`<br />
This documentation provides an interactive interface to test API endpoints.<br />

5) **Stopping the Application:**<br />
To stop the containers, press Ctrl+C in the terminal where docker-compose up is running. To remove containers and associated networks, run:<br />
`docker-compose down`<br />

### Notes
- **Database Persistence:**<br />
A Docker volume is used for MySQL data persistence. This ensures data is not lost when you stop and remove the containers. If you want a fresh start, you can remove the volume:<br />
`docker-compose down -v`<br />
This will remove all volumes and thus delete the database data.<br />

- **Rebuilding After Changes:**<br />
If you make changes to the code, run:<br />
`docker-compose build`<br />
`docker-compose up`<br />
again to rebuild and restart the updated services.<br />

### Troubleshooting
- Database Initialization Errors: If you encounter issues like::<br />
`Failed to initialize the database: error creating the database`<br />
Try stopping the containers and removing the volume using -v option:<br />
`docker-compose down -v`<br />
This will remove the volume, thus clean the database.<br />
Then restart with `docker-compose up`. This gives you a clean database.<br />
- If the frontend or backend container fails to start or you run into database connection issues, ensure that Docker is running and that no other process on your host is occupying the same ports.<br />
- The backend includes retry logic for database connection and will wait for MySQL to be ready.<br />
- If you modify environment variables or .env files, rebuild the images or restart the containers to apply changes.<br />
For further customizations, refer to the Docker Compose file and the service Dockerfiles. Feel free to open issues or submit pull requests if you encounter problems or want to contribute.<br />