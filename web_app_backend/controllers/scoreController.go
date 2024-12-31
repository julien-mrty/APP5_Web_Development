package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/helpers"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

// GetAllScores fetches all scores for the authenticated user.
// It expects "id" in the context (set by AuthMiddleware).
// @Summary Get user scores
// @Description Retrieve the list of scores for the authenticated user
// @Tags Scores
// @Produce json
// @Success 200 {array} models.Score
// @Router /api/scores [get]
func GetAllScores(c *gin.Context) {
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

	scores, err := services.GetScoresByUserID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, scores)
}

// Wrapper for services.GetScoreByID to match the expected function signature for HandleGetByID
func getScoreByIDWrapper(id string) (interface{}, error) {
	return services.GetScoreByID(id)
}

// @Summary Create a new score
// @Description Add a new score to the database
// @Tags Scores
// @Accept json
// @Produce json
// @Param score body models.Score true "Score data"
// @Success 201 {object} models.Score
// @Router /api/scores [post]
func CreateScore(c *gin.Context) {
	helpers.HandleCreate(c, services.CreateScore)
}

// Get a score by ID
// @Summary Get a score by ID
// @Description Retrieve a specific score by its ID
// @Tags Scores
// @Produce json
// @Param id path int true "Score ID"
// @Success 200 {object} models.Score
// @Failure 404 {object} map[string]string
// @Router /scores/{id} [get]
func GetScoreByID(c *gin.Context) {
	helpers.HandleGetByID(c, "id", getScoreByIDWrapper)
}