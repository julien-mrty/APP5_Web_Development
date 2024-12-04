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
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return 0, errors.New("invalid token claims")
	}

	// Ensure the expiration claim is valid
	expClaim, ok := claims["exp"].(float64)
	if !ok {
		return 0, errors.New("invalid or missing expiration claim")
	}
	expiration := int64(expClaim)
	if time.Now().Unix() > expiration {
		return 0, errors.New("token has expired")
	}

	// Ensure the userID claim is valid
	userIDFloat, userIDOk := claims["userID"].(float64)
	if !userIDOk {
		return 0, errors.New("invalid or missing userID in token")
	}

	return uint(userIDFloat), nil
}
