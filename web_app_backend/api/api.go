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
	// Swagger endpoint
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// API version 1 group
	v1 := r.Group("/api")
	{
		// Users routes
		users := v1.Group("/users")
		{
			users.GET("", controllers.GetAllUsers)      // Get all users
			users.POST("", controllers.CreateUser)      // Create a new user
			users.GET(":id", controllers.GetUserByID)   // Get user by ID
			users.DELETE(":id", controllers.DeleteUser) // Delete user by ID
			users.PATCH(":id", controllers.UpdateUser)  // Update user by ID
		}

		// Games routes
		games := v1.Group("/games")
		{
			games.GET("", controllers.GetAllGames)    // Get all games
			games.POST("", controllers.CreateGame)    // Create a new game
			games.GET(":id", controllers.GetGameByID) // Get game by ID
		}

		// Scores routes
		scores := v1.Group("/scores")
		{
			scores.GET("", controllers.GetAllScores)    // Get all scores
			scores.POST("", controllers.CreateScore)    // Create a new score
			scores.GET(":id", controllers.GetScoreByID) // Get score by ID
		}

		// Authentication routes
		auth := v1.Group("/auth")
		{
			auth.POST("/signup", controllers.Signup) // User signup
			auth.POST("/login", controllers.Login)   // User login
		}
	}

	// Protected route example
	r.GET("/api/v1/protected", middleware.AuthMiddleware(), func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unable to retrieve userID"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Access granted",
			"userID":  userID,
		})
	})
}
