package models

import "time"

type RunningGameScore struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	User      User      `gorm:"foreignKey:UserID"`
	Points    int       `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
