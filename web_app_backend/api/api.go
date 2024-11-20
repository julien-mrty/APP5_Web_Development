package api

import (
	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/controllers"
)

func SetupRoutes(r *gin.Engine) {
	// Route de test
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// Routes pour les utilisateurs
	r.GET("/users", controllers.GetAllUsers)
	r.POST("/users", controllers.CreateUser)
	r.GET("/users/:id", controllers.GetUserByID)

	// Routes pour les jeux
	r.GET("/games", controllers.GetAllGames)
	r.POST("/games", controllers.CreateGame)
	r.GET("/games/:id", controllers.GetGameByID)

	// Routes pour les scores
	r.GET("/scores", controllers.GetAllScores)
	r.POST("/scores", controllers.CreateScore)
	r.GET("/scores/:id", controllers.GetScoreByID)
}
