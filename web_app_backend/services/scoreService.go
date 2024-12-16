package services

import (
	"errors"

	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/database"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
)

// Get all scores
func GetAllScores() ([]models.Score, error) {
	var scores []models.Score
	result := database.DB.Find(&scores)
	if result.Error != nil {
		return nil, result.Error
	}
	return scores, nil
}

// Create a new score
func CreateScore(score *models.Score) error {
	result := database.DB.Create(score)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// Get a score by ID
func GetScoreByID(id string) (*models.Score, error) {
	var score models.Score
	result := database.DB.First(&score, id)
	if result.Error != nil {
		return nil, errors.New("score not found")
	}
	return &score, nil
}

// GetScoresByUserID retrieves all scores associated with a specific user.
func GetScoresByUserID(userID uint) ([]models.Score, error) {
	var scores []models.Score
	result := database.DB.Where("user_id = ?", userID).Find(&scores)
	if result.Error != nil {
		return nil, errors.New("score not found")
	}
	return scores, nil
}
