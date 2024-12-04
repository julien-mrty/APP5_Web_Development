#!/bin/bash
set -e  # Exit on any error

# Step 1: Create a new user
echo "Creating a new user..."
curl -X POST http://localhost:8081/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpass"}'

# Step 2: Log in to get the token
echo "Logging in..."
TOKEN=$(curl -X POST http://localhost:8081/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpass"}' \
     | jq -r '.token')  # Extract token using jq

# Step 3: Access the home page
echo "Accessing the home page..."
curl -X GET http://localhost:8081/api/home \
     -H "Authorization: Bearer $TOKEN"
