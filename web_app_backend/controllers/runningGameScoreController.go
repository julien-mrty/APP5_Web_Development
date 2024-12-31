package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/helpers"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

func CreateRunningGameScore(c *gin.Context) {
    helpers.HandleCreate(c, services.CreateRunningGameScore)
}