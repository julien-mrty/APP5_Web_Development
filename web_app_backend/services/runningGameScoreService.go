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

func GetTopRunningGameScores(limit int) ([]map[string]interface{}, error) {
	var scores []models.RunningGameScore

	// Query to get the top scores, preloading the User relation
	err := database.DB.
		Order("points DESC").
		Limit(limit).
		Preload("User").
		Find(&scores).Error
	if err != nil {
		return nil, err
	}

	// Transform the result to include usernames
	var result []map[string]interface{}
	for _, score := range scores {
		result = append(result, map[string]interface{}{
			"Points":    score.Points,
			"CreatedAt": score.CreatedAt,
			"username":  score.User.Username, // Include username
		})
	}

	return result, nil
}
