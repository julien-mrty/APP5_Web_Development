package middleware

import (
	"os"

	"github.com/gin-gonic/gin"
)

// CORSMiddleware sets CORS headers based on the environment.
// In production, it will allow only the origin specified by CORS_ALLOWED_ORIGIN.
// In development, it will allow localhost or all origins for convenience.
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		appEnv := os.Getenv("APP_ENV")
		allowedOrigin := ""

		if appEnv == "production" {
			// In production, we must restrict to a specific allowed origin
			allowedOrigin = os.Getenv("CORS_ALLOWED_ORIGIN")
			if allowedOrigin == "" {
				// If not set, fallback to a safe default or return an error.
				// Here we fallback to none, meaning no origin is allowed.
				allowedOrigin = "https://myproductiondomain.com"
			}
		} else {
			// In development, we can allow localhost (frontend dev server)
			// or if you prefer, use "*" for testing.
			// For better security, let's allow only the front dev origin:
			allowedOrigin = "http://localhost:5173"
		}

		c.Writer.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		c.Writer.Header().Set("Vary", "Origin") // Good practice to vary on origin
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		// If you need credentials in production (like cookies), set this to "true"
		// and ensure your allowed origin is not "*"
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
