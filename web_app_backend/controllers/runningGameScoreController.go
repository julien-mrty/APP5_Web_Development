package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/helpers"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

func CreateRunningGameScore(c *gin.Context) {
	helpers.HandleCreate(c, services.CreateRunningGameScore)
}

// GetAllRunningGameScores fetches all running game scores for the authenticated user.
func GetAllRunningGameScores(c *gin.Context) {
	idValue, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Explicit type assertion with error handling
	id, ok := idValue.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse id"})
		return
	}

	scores, err := services.GetRunningGameScoresByUserID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, scores)
}

func GetTopRunningGameScores(c *gin.Context) {
	// Define the limit for the top scores
	const limit = 7

	// Call the service to get the top scores
	scores, err := services.GetTopRunningGameScores(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve scores"})
		return
	}

	c.JSON(http.StatusOK, scores)
}
