package models

import "time"

type Score struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	GameID    uint      `gorm:"not null"`
	Points    int       `gorm:"not null"`
	CreatedAt time.Time `gorm:"not null"`
}
