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
// @Summary Get all games
// @Description Retrieve the list of all games
// @Tags Games
// @Produce json
// @Success 200 {array} models.Game
// @Router /api/games [get]
func GetAllGames(c *gin.Context) {
	helpers.HandleGetAll(c, getAllGamesWrapper)
}

// Wrapper for services.GetGameByID to match the expected function signature for HandleGetByID
func getGameByIDWrapper(id string) (interface{}, error) {
	return services.GetGameByID(id)
}

// @Summary Create a new game
// @Description Add a new game to the database
// @Tags Games
// @Accept json
// @Produce json
// @Param game body models.Game true "Game data"
// @Success 201 {object} models.Game
// @Router /api/games [post]
func CreateGame(c *gin.Context) {
	helpers.HandleCreate(c, services.CreateGame)
}

// @Summary Get a game by ID
// @Description Retrieve a specific game by its ID
// @Tags Games
// @Produce json
// @Param id path int true "Game ID"
// @Success 200 {object} models.Game
// @Failure 404 {object} map[string]string
// @Router /api/games/{id} [get]
func GetGameByID(c *gin.Context) {
	helpers.HandleGetByID(c, "id", getGameByIDWrapper)
}
