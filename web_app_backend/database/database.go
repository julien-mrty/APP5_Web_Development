package database

import (
	"database/sql"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
)

var DB *gorm.DB

// ConnectDB connects to the database and creates a new one if it doesn't exist
func ConnectDB() {
	var err error

	// Configuration for connecting to MySQL without specifying a database
	dsnWithoutDB := "root:@tcp(localhost:3306)/?charset=utf8mb4&parseTime=True&loc=Local"

	// Open a basic SQL connection to create the database
	sqlDB, err := sql.Open("mysql", dsnWithoutDB)
	if err != nil {
		log.Fatal("Error connecting to MySQL:", err)
	}
	defer sqlDB.Close() // Ensure the connection is closed after the operation

	// Create the database if it doesn't exist
	dbName := "bdd_jump_higher"
	_, err = sqlDB.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s", dbName))
	if err != nil {
		log.Fatal("Error creating the database:", err)
	}
	fmt.Println("Database successfully verified or created")

	// Reconfigure the connection string to include the newly created database
	dsnWithDB := fmt.Sprintf("root:@tcp(localhost:3306)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbName)

	// Connect to the database using GORM and the new connection string
	DB, err = gorm.Open(mysql.Open(dsnWithDB), &gorm.Config{})
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}

	// Call the function to migrate the tables
	migrateTables()
}

func migrateTables() {
	// Migrate the models to create the tables in the database
	err := DB.AutoMigrate(&models.User{}, &models.Game{}, &models.Score{})
	if err != nil {
		log.Fatal("Error migrating tables:", err)
	}
	fmt.Println("Table migration successful")
}
