package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

// Get all scores
func GetAllScores(c *gin.Context) {
	scores, err := services.GetAllScores()
	if err != nil {
		services.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, scores)
}

// Create a new score
func CreateScore(c *gin.Context) {
	var score models.Score
	if err := c.ShouldBindJSON(&score); err != nil {
		services.HandleError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := services.CreateScore(&score); err != nil {
		services.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusCreated, score)
}

// Get a score by ID
func GetScoreByID(c *gin.Context) {
	id := c.Param("id")
	score, err := services.GetScoreByID(id)
	if err != nil {
		services.HandleError(c, http.StatusNotFound, "Score not found")
		return
	}
	c.JSON(http.StatusOK, score)
}
