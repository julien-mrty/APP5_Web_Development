package models

import "time"

type RunningGameScore struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	Points    int       `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
