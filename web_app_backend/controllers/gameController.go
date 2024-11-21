package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/helpers"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

// Wrapper for services.GetAllGames to match the expected function signature for HandleGetAll
func getAllGamesWrapper() (interface{}, error) {
	return services.GetAllGames()
}

// Get all games
func GetAllGames(c *gin.Context) {
	helpers.HandleGetAll(c, getAllGamesWrapper)
}

// Wrapper for services.GetGameByID to match the expected function signature for HandleGetByID
func getGameByIDWrapper(id string) (interface{}, error) {
	return services.GetGameByID(id)
}

// Create a new game
func CreateGame(c *gin.Context) {
	helpers.HandleCreate(c, services.CreateGame)
}

// Get a game by ID
func GetGameByID(c *gin.Context) {
	helpers.HandleGetByID(c, "id", getGameByIDWrapper)
}
