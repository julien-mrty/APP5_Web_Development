package services

import (
	"errors"

	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/database"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
	"gorm.io/gorm"
)

// Get all users
func GetAllUsers() ([]models.User, error) {
	var users []models.User
	result := database.DB.Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}

// CreateUser creates a new user and returns an error if the username already exists
func CreateUser(user *models.User) error {
	// Check if the username already exists
	var existingUser models.User
	result := database.DB.Where("username = ?", user.Username).First(&existingUser)
	if result.Error == nil {
		// Username already exists
		return errors.New("username already exists")
	}

	// If the error is not "record not found", return the error
	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return result.Error
	}

	// Create the new user
	result = database.DB.Create(user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// Get a user by ID
func GetUserByID(id string) (*models.User, error) {
	var user models.User
	result := database.DB.First(&user, id)
	if result.Error != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

// Get a user by username
func GetUserByUserName(username string) (*models.User, error) {
	var user models.User
	result := database.DB.Where("username = ?", username).First(&user)
	if result.Error != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

// Delete a user by ID
func DeleteUserByID(id string) error {
	var user models.User
	// Check if user exists
	result := database.DB.First(&user, id)
	if result.Error != nil {
		return errors.New("user not found")
	}

	// Delete the user
	result = database.DB.Delete(&user)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

// Update a user by ID
func UpdateUserByID(id string, updatedData *models.User) (*models.User, error) {
	var user models.User

	// Check if user exists
	result := database.DB.First(&user, id)
	if result.Error != nil {
		return nil, errors.New("user not found")
	}

	// Update the user with new data
	result = database.DB.Model(&user).Updates(updatedData)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}
