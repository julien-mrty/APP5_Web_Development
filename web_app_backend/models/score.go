package models

type Score struct {
	ID     int `json:"id"`
	UserID int `json:"user_id"`
	GameID int `json:"game_id"`
	Points int `json:"points"`
}
