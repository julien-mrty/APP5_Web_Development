package services

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte("your_secret_key")

// GenerateJWT generates a new JWT token with the provided payload.
// Make sure the payload includes "id", "username", and "avatar_url"
// corresponding to the authenticated user.
func GenerateJWT(payload map[string]interface{}) (string, error) {
	claims := jwt.MapClaims{}

	// Copy the payload to claims
	for key, value := range payload {
		claims[key] = value
	}

	// Add an expiration time claim
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	// Create the token with the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

// ValidateJWT validates the token and returns the user's id and claims.
// The token should contain an "id" field.
func ValidateJWT(tokenString string) (uint, jwt.MapClaims, error) {
	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is as expected
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return jwtKey, nil
	})

	if err != nil {
		return 0, nil, err
	}

	// Extract the claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return 0, nil, errors.New("invalid token claims")
	}

	// Check expiration time
	expClaim, ok := claims["exp"].(float64)
	if !ok {
		return 0, nil, errors.New("missing or invalid expiration claim")
	}
	if time.Now().Unix() > int64(expClaim) {
		return 0, nil, errors.New("token has expired")
	}

	// Extract userID
	idFloat, idOk := claims["id"].(float64)
	if !idOk {
		return 0, nil, errors.New("invalid or missing userID in token")
	}

	return uint(idFloat), claims, nil
}
