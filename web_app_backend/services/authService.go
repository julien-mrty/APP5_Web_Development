package services

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte("your_secret_key")

func GenerateJWT(userID uint) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"exp":    time.Now().Add(24 * time.Hour).Unix(),
	})
	return token.SignedString(jwtKey)
}

// ValidateJWT parses and validates a JWT token
func ValidateJWT(tokenString string) (uint, error) {
	// Parse the JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is as expected
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtKey, nil
	})

	if err != nil {
		return 0, err // Return error if token parsing fails
	}

	// Validate token claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Ensure the token is not expired
		expiration := int64(claims["exp"].(float64))
		if time.Now().Unix() > expiration {
			return 0, errors.New("token has expired")
		}

		// Extract user ID
		userIDFloat, ok := claims["userID"].(float64)
		if !ok {
			return 0, errors.New("invalid userID in token")
		}
		return uint(userIDFloat), nil
	}

	return 0, errors.New("invalid token")
}
