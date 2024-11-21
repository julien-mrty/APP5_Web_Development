package api

import (
	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/controllers"
	swaggerFiles "github.com/swaggo/files"     // Swagger UI files
	ginSwagger "github.com/swaggo/gin-swagger" // Swagger middleware

	_ "github.com/julien-mrty/Web_app_jump_higher/web_app_backend/docs" // Swagger docs
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/middleware"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

// @title Web App Jump Higher API
// @version 1.0
// @description This is the API documentation for the Web App Jump Higher backend.
// @termsOfService http://example.com/terms/

// @contact.name API Support
// @contact.url http://example.com/support
// @contact.email support@example.com

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8080
// @BasePath /
func SetupRoutes(r *gin.Engine) {
	// Swagger endpoint
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Route de test
	// @Summary Ping the server
	// @Description Test route to check if the server is running
	// @Tags Test
	// @Produce json
	// @Success 200 {object} map[string]string
	// @Router /ping [get]
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// Routes pour les utilisateurs
	// @Summary Get all users
	// @Description Retrieve the list of all users
	// @Tags Users
	// @Produce json
	// @Success 200 {array} models.User
	// @Router /users [get]
	r.GET("/users", controllers.GetAllUsers)

	// @Summary Create a new user
	// @Description Add a new user to the database
	// @Tags Users
	// @Accept json
	// @Produce json
	// @Param user body models.User true "User data"
	// @Success 201 {object} models.User
	// @Router /users [post]
	r.POST("/users", controllers.CreateUser)

	// @Summary Get user by ID
	// @Description Retrieve a specific user by their ID
	// @Tags Users
	// @Produce json
	// @Param id path int true "User ID"
	// @Success 200 {object} models.User
	// @Router /users/{id} [get]
	r.GET("/users/:id", controllers.GetUserByID)

	// Routes pour les jeux
	// @Summary Get all games
	// @Description Retrieve the list of all games
	// @Tags Games
	// @Produce json
	// @Success 200 {array} models.Game
	// @Router /games [get]
	r.GET("/games", controllers.GetAllGames)

	// @Summary Create a new game
	// @Description Add a new game to the database
	// @Tags Games
	// @Accept json
	// @Produce json
	// @Param game body models.Game true "Game data"
	// @Success 201 {object} models.Game
	// @Router /games [post]
	r.POST("/games", controllers.CreateGame)

	// @Summary Get game by ID
	// @Description Retrieve a specific game by its ID
	// @Tags Games
	// @Produce json
	// @Param id path int true "Game ID"
	// @Success 200 {object} models.Game
	// @Router /games/{id} [get]
	r.GET("/games/:id", controllers.GetGameByID)

	// Routes pour les scores
	// @Summary Get all scores
	// @Description Retrieve the list of all scores
	// @Tags Scores
	// @Produce json
	// @Success 200 {array} models.Score
	// @Router /scores [get]
	r.GET("/scores", controllers.GetAllScores)

	// @Summary Create a new score
	// @Description Add a new score to the database
	// @Tags Scores
	// @Accept json
	// @Produce json
	// @Param score body models.Score true "Score data"
	// @Success 201 {object} models.Score
	// @Router /scores [post]
	r.POST("/scores", controllers.CreateScore)

	// @Summary Get score by ID
	// @Description Retrieve a specific score by its ID
	// @Tags Scores
	// @Produce json
	// @Param id path int true "Score ID"
	// @Success 200 {object} models.Score
	// @Router /scores/{id} [get]
	r.GET("/scores/:id", controllers.GetScoreByID)

	///////////////////////////////////////////////////////////////////////////////////

	//
	r.GET("/protected", middleware.AuthMiddleware(), func(c *gin.Context) {
		userID, _ := c.Get("userID")
		c.JSON(200, gin.H{
			"message": "You have access to this protected route",
			"userID":  userID,
		})
	})

	r.POST("/generate-token", func(c *gin.Context) {
		var request struct {
			UserID uint `json:"userID"`
		}
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request"})
			return
		}

		token, err := services.GenerateJWT(request.UserID)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(200, gin.H{"token": token})
	})

	///////////////////////////////////////////////////////////////////::

	// @Summary a modifier
	// @Description Retrieve a specific score by its ID
	// @Tags Scores
	// @Produce json
	// @Param id path int true "Score ID"
	// @Success 200 {object} models.Score
	// @Router /scores/{id} [post]
	r.POST("/api/signup", controllers.Signup)

	// @Summary a modifier
	// @Description Retrieve a specific score by its ID
	// @Tags Scores
	// @Produce json
	// @Param id path int true "Score ID"
	// @Success 200 {object} models.Score
	// @Router /scores/{id} [post]
	r.POST("/api/login", controllers.Login)

	// @Summary a modifier
	// @Description Retrieve a specific score by its ID
	// @Tags Scores
	// @Produce json
	// @Param id path int true "Score ID"
	// @Success 200 {object} models.Score
	// @Router /scores/{id} [post]
	r.GET("/api/protected", middleware.AuthMiddleware(), func(c *gin.Context) {
		userID, _ := c.Get("userID")
		c.JSON(200, gin.H{
			"message": "You have access to this protected route",
			"userID":  userID,
		})
	})

}
