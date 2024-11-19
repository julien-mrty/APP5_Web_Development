package models

type Game struct {
	ID         uint   `gorm:"primaryKey"`
	LevelName  string `gorm:"not null"`
	Difficulty string `gorm:"not null"`
}
