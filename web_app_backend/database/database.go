package database

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/julien-mrty/Web_app_jump_higher/web_app_backend/models"
)

var DB *gorm.DB

func ConnectDB() {
	var err error

	// Configuration de la chaîne de connexion
	dsn := "root:@tcp(localhost:3306)/bdd_jump_higher?charset=utf8mb4&parseTime=True&loc=Local"
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Erreur de connexion à la base de données :", err)
	}

	// Appelle la fonction pour migrer les tables
	migrateTables()
}

func migrateTables() {
	// Migrer les modèles pour créer les tables dans la base de données
	err := DB.AutoMigrate(&models.User{}, &models.Game{}, &models.Score{})
	if err != nil {
		log.Fatal("Erreur de migration des tables :", err)
	}
	fmt.Println("Migration des tables réussie")
}
