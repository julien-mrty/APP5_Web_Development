package services

import (
	"errors"

	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/database"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
)

// Get all games
func GetAllGames() ([]models.Game, error) {
	var games []models.Game
	result := database.DB.Find(&games)
	if result.Error != nil {
		return nil, result.Error
	}
	return games, nil
}

// Create a new game
func CreateGame(game *models.Game) error {
	result := database.DB.Create(game)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// Get a game by ID
func GetGameByID(id string) (*models.Game, error) {
	var game models.Game
	result := database.DB.First(&game, id)
	if result.Error != nil {
		return nil, errors.New("game not found")
	}
	return &game, nil
}
