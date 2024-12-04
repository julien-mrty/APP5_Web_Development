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
// @Summary Get all scores
// @Description Retrieve the list of all scores
// @Tags scores
// @Produce json
// @Success 200 {array} models.Score
// @Router /scores [get]
func GetAllScores(c *gin.Context) {
	helpers.HandleGetAll(c, getAllScoresWrapper)
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
// @Router /scores [post]
func CreateScore(c *gin.Context) {
	helpers.HandleCreate(c, services.CreateScore)
}

// Get a score by ID
// @Summary Get a score by ID
// @Description Retrieve a specific score by its ID
// @Tags scores
// @Produce json
// @Param id path int true "Score ID"
// @Success 200 {object} models.Score
// @Failure 404 {object} map[string]string
// @Router /scores/{id} [get]
func GetScoreByID(c *gin.Context) {
	helpers.HandleGetByID(c, "id", getScoreByIDWrapper)
}
