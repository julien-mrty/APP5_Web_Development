package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
)

var DB *gorm.DB

// ConnectDB connects to the database and creates a new one if it doesn't exist
func ConnectDB() error {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	// Configuration for connecting to MySQL without specifying a database
	//dsnWithoutDB := "root:@tcp(localhost:3306)/?charset=utf8mb4&parseTime=True&loc=Local"
	dsnWithoutDB := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort)

	// Open a basic SQL connection to create the database
	sqlDB, err := sql.Open("mysql", dsnWithoutDB)
	if err != nil {
		return fmt.Errorf("error connecting to MySQL: %w", err)
	}
	defer func() {
		if closeErr := sqlDB.Close(); closeErr != nil {
			log.Printf("warning: failed to close sqlDB: %v", closeErr)
		}
	}()

	// Create the database if it doesn't exist
	_, err = sqlDB.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s", dbName))
	if err != nil {
		return fmt.Errorf("error creating the database: %w", err)
	}
	fmt.Println("Database successfully verified or created")

	// Reconfigure the connection string to include the newly created database
	//dsnWithDB := fmt.Sprintf("root:@tcp(localhost:3306)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbName)
	dsnWithDB := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort, dbName)

	// Connect to the database using GORM and the new connection string
	DB, err = gorm.Open(mysql.Open(dsnWithDB), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("error connecting to the database: %w", err)
	}

	// Call the function to migrate the tables
	err = migrateTables()
	if err != nil {
		return fmt.Errorf("error migrating tables: %w", err)
	}
	// Ensure the `CreatedAt` column in the `scores` table is configured properly
	err = ensureCreatedAtColumn()
	if err != nil {
		return fmt.Errorf("error ensuring CreatedAt column: %w", err)
	}
	return nil

}

func migrateTables() error {
	// Migrate the models to create the tables in the database
	err := DB.AutoMigrate(&models.User{}, &models.Game{}, &models.Score{})
	if err != nil {
		return err
	}
	fmt.Println("Table migration successful")
	return nil
}

// Function to ensure the `CreatedAt` column in the `scores` table is configured properly
func ensureCreatedAtColumn() error {
	sqlStatement := `
        ALTER TABLE scores 
        MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;
    `
	rawDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("error getting raw DB connection: %w", err)
	}

	_, err = rawDB.Exec(sqlStatement)
	if err != nil {
		return fmt.Errorf("error modifying CreatedAt column: %w", err)
	}

	fmt.Println("CreatedAt column ensured successfully")
	return nil
}
