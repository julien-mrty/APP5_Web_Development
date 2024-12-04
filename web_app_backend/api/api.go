package api

import (
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
	v1 := r.Group("/api/v1")
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
	}

	// Protected route example
	r.GET("/api/protected", middleware.AuthMiddleware(), func(c *gin.Context) {
		userID, _ := c.Get("userID")
		c.JSON(200, gin.H{
			"message": "You have access to this protected route",
			"userID":  userID,
		})
	})
}
