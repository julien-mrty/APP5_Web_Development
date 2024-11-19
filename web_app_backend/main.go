package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/api"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/database"
)

func main() {
	r := gin.Default()

	// Initialisation de la base de données
	database.ConnectDB()

	// Configuration des routes
	api.SetupRoutes(r)

	// Démarrer le serveur
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Erreur de démarrage du serveur :", err)
	}
}
