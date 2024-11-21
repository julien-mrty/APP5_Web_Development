package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/helpers"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

// Wrapper for services.GetAllScores to match the expected function signature for HandleGetAll
func getAllScoresWrapper() (interface{}, error) {
	return services.GetAllScores()
}

// Get all scores
func GetAllScores(c *gin.Context) {
	helpers.HandleGetAll(c, getAllScoresWrapper)
}

// Wrapper for services.GetScoreByID to match the expected function signature for HandleGetByID
func getScoreByIDWrapper(id string) (interface{}, error) {
	return services.GetScoreByID(id)
}

// Create a new score
func CreateScore(c *gin.Context) {
	helpers.HandleCreate(c, services.CreateScore)
}

// Get a score by ID
func GetScoreByID(c *gin.Context) {
	helpers.HandleGetByID(c, "id", getScoreByIDWrapper)
}
