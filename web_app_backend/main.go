package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/api"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/database"
	_ "github.com/julien-mrty/Web_app_jump_higher/web_app_backend/docs"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/middleware"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

func main() {

	services.InitLogger()
	services.InitValidator()

	r := gin.Default()

	// Apply CORS middleware globally
	r.Use(middleware.CORSMiddleware())

	// Attempt to connect to the database and handle any errors
	if err := database.ConnectDB(); err != nil {
		log.Fatalf("failed to initialize the database: %v", err)
	}

	// Configuration des routes
	api.SetupRoutes(r)

	// Démarrer le serveur
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Error de démarrage du serveur :", err)
	}
}
