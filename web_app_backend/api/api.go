package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/controllers"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/middleware"
	swaggerFiles "github.com/swaggo/files"     // Swagger UI files
	ginSwagger "github.com/swaggo/gin-swagger" // Swagger middleware
)

// SetupRoutes configures the API routes
func SetupRoutes(r *gin.Engine) {
	// Set up the Swagger documentation endpoint
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Home route (protected)
	r.GET("/home", middleware.AuthMiddleware(), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to the HomePage",
		})
	})

	// Define API version 1 group
	v1 := r.Group("/api")
	{
		// User-related routes (protected by AuthMiddleware)
		users := v1.Group("/users").Use(middleware.AuthMiddleware())
		{
			users.GET("", controllers.GetAllUsers)      // Endpoint to get all users
			users.POST("", controllers.CreateUser)      // Endpoint to create a new user
			users.GET(":id", controllers.GetUserByID)   // Endpoint to retrieve a user by their ID
			users.DELETE(":id", controllers.DeleteUser) // Endpoint to delete a user by their ID
			users.PATCH(":id", controllers.UpdateUser)  // Endpoint to update user information by their ID
		}

		// Game-related routes (protected by AuthMiddleware)
		games := v1.Group("/games").Use(middleware.AuthMiddleware())
		{
			games.GET("", controllers.GetAllGames)    // Endpoint to get all games
			games.POST("", controllers.CreateGame)    // Endpoint to create a new game
			games.GET(":id", controllers.GetGameByID) // Endpoint to retrieve a game by its ID
		}

		// Score-related routes (protected by AuthMiddleware)
		scores := v1.Group("/scores").Use(middleware.AuthMiddleware())
		{
			scores.GET("", controllers.GetAllScores)    // Endpoint to get all scores
			scores.POST("", controllers.CreateScore)    // Endpoint to create a new score
			scores.GET(":id", controllers.GetScoreByID) // Endpoint to retrieve a score by its ID
		}

		runningScores := v1.Group("/runningScores").Use(middleware.AuthMiddleware())
		{
			runningScores.POST("", controllers.CreateRunningGameScore) // Save a score for RunningGame
		}

		// Authentication-related routes (not protected)
		auth := v1.Group("/auth")
		{
			auth.POST("/signup", controllers.Signup) // Endpoint for user signup
			auth.POST("/login", controllers.Login)   // Endpoint for user login
		}
	}
}
