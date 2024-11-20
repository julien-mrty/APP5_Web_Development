package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

// Get all games
func GetAllGames(c *gin.Context) {
	games, err := services.GetAllGames()
	if err != nil {
		services.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, games)
}

// Create a new game
func CreateGame(c *gin.Context) {
	var game models.Game
	if err := c.ShouldBindJSON(&game); err != nil {
		services.HandleError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := services.CreateGame(&game); err != nil {
		services.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusCreated, game)
}

// Get a game by ID
func GetGameByID(c *gin.Context) {
	id := c.Param("id")
	game, err := services.GetGameByID(id)
	if err != nil {
		services.HandleError(c, http.StatusNotFound, "Game not found")
		return
	}
	c.JSON(http.StatusOK, game)
}
