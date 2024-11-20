package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		services.HandleError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Valider les données de l'utilisateur
	if err := services.ValidateStruct(&user); err != nil {
		services.HandleError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Hacher le mot de passe
	hashedPassword, err := services.HashPassword(user.Password)
	if err != nil {
		services.HandleError(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}
	user.Password = hashedPassword

	// Créer l'utilisateur
	if err := services.CreateUser(&user); err != nil {
		services.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Répondre avec l'utilisateur créé
	c.JSON(http.StatusCreated, user)
}

// Get all users
func GetAllUsers(c *gin.Context) {
	users, err := services.GetAllUsers()
	if err != nil {
		services.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, users)
}

// Get a user by ID
func GetUserByID(c *gin.Context) {
	id := c.Param("id")
	user, err := services.GetUserByID(id)
	if err != nil {
		services.HandleError(c, http.StatusNotFound, "User not found")
		return
	}
	c.JSON(http.StatusOK, user)
}
