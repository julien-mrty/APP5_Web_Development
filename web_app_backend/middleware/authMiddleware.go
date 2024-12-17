package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/services"
)

// AuthMiddleware checks for a valid JWT token in the Authorization header.
// It expects a "Bearer <token>" format. If valid, it sets "id", "username",
// and "avatar_url" in the Gin context.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Extract token from "Bearer" prefix
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		// Validate the JWT token and extract claims
		id, claims, err := services.ValidateJWT(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token", "details": err.Error()})
			c.Abort()
			return
		}

		// Add user info to context
		c.Set("id", id)
		if username, ok := claims["username"]; ok {
			c.Set("username", username)
		}
		if avatarURL, ok := claims["avatar_url"]; ok {
			c.Set("avatar_url", avatarURL)
		}
		// Call the next handler
		c.Next()
	}
}

// RefreshToken handles token regeneration
func RefreshToken(c *gin.Context) {
	// Extract Authorization header
	authHeader := c.GetHeader("Authorization")
	token := strings.TrimPrefix(authHeader, "Bearer ")

	// Validate the old token
	id, claims, err := services.ValidateJWT(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token", "details": err.Error()})
		return
	}

	// Generate a new token with claims
	payload := map[string]interface{}{
		"id":         id,
		"username":   claims["username"],
		"avatar_url": claims["avatar_url"],
	}

	newToken, err := services.GenerateJWT(payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate a new token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": newToken})
}
