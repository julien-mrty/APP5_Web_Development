package services

import (
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/database"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
)

func CreateRunningGameScore(score *models.RunningGameScore) error {
	return database.DB.Create(score).Error
}
