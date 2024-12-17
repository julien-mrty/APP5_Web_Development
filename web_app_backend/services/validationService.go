package services

import (
	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func InitValidator() {
	validate = validator.New()
}

func ValidateStruct(data interface{}) error {
	if validate == nil {
		InitValidator() // Ensure the validator is initialized
	}
	return validate.Struct(data)
}
