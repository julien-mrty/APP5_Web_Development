package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

func CreateUser(c *gin.Context) {
	var user models.User
	var err error

	// Liaison des données JSON à l'objet `user`
	if err = c.ShouldBindJSON(&user); err != nil {
		services.HandleError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Validation des données de l'utilisateur
	if err = services.ValidateStruct(&user); err != nil {
		services.HandleError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Hachage du mot de passe
	var hashedPassword string
	hashedPassword, err = services.HashPassword(user.Password)
	if err != nil {
		services.HandleError(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}
	user.Password = hashedPassword

	// Création de l'utilisateur
	err = services.CreateUser(&user)
	if err != nil {
		services.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Réponse avec l'utilisateur créé
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

func Signup(c *gin.Context) {
	var user models.User
	var err error

	// Liaison des données JSON à l'objet `user`
	if err = c.ShouldBindJSON(&user); err != nil {
		services.HandleError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Validation des données de l'utilisateur
	if err = services.ValidateStruct(&user); err != nil {
		services.HandleError(c, http.StatusBadRequest, err.Error())
		return
	}

	// Hachage du mot de passe
	var hashedPassword string
	hashedPassword, err = services.HashPassword(user.Password)
	if err != nil {
		services.HandleError(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}
	user.Password = hashedPassword

	// Création de l'utilisateur
	err = services.CreateUser(&user)
	if err != nil {
		services.HandleError(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Réponse avec l'utilisateur créé
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func Login(c *gin.Context) {
	var request struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	// Liaison des données JSON à l'objet `request`
	if err := c.ShouldBindJSON(&request); err != nil {
		services.HandleError(c, http.StatusBadRequest, "Invalid request")
		return
	}

	// Rechercher l'utilisateur par email
	user, err := services.GetUserByEmail(request.Email)
	if err != nil {
		services.HandleError(c, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// Vérifier si le mot de passe est correct
	isValid := services.CheckPasswordHash(request.Password, user.Password)
	if !isValid {
		services.HandleError(c, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	// Générer un token JWT
	token, err := services.GenerateJWT(user.ID)
	if err != nil {
		services.HandleError(c, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	// Réponse avec le token
	c.JSON(http.StatusOK, gin.H{"token": token})
}
