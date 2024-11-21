package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/api"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/database"
	_ "github.com/julien-mrty/Web_app_jump_higher/web_app_backend/docs"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

func main() {

	services.InitLogger()
	services.InitValidator()

	r := gin.Default()

	// Initialisation de la base de données
	database.ConnectDB()

	// Configuration des routes
	api.SetupRoutes(r)

	// Démarrer le serveur
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Error de démarrage du serveur :", err)
	}
}
