package services

import (
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/database"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
)

func CreateRunningGameScore(score *models.RunningGameScore) error {
	return database.DB.Create(score).Error
}

// GetRunningGameScoresByUserID retrieves all running game scores for a specific user
func GetRunningGameScoresByUserID(userID uint) ([]models.RunningGameScore, error) {
	var scores []models.RunningGameScore
	if err := database.DB.Where("user_id = ?", userID).Find(&scores).Error; err != nil {
		return nil, err
	}
	return scores, nil
}
