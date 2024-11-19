package database

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
	var err error
	dsn := "root:@tcp(localhost:3306)/bdd_jump_higher"
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Erreur de connexion à la base de données :", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Erreur de ping à la base de données :", err)
	}
	log.Println("Connexion à la base de données réussie")
}
