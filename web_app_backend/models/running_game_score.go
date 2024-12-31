package models

import "time"

type RunningGameScore struct {
    ID        uint      `gorm:"primaryKey"`       // Unique identifier
    UserID    uint      `gorm:"not null"`         // User ID
    Points    int       `gorm:"not null"`         // Game score
    CreatedAt time.Time `gorm:"autoCreateTime"`   // Creation timestamp
}
