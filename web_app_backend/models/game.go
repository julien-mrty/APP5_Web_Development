package models

type Game struct {
	ID         int    `json:"id"`
	LevelName  string `json:"level_name"`
	Difficulty string `json:"difficulty"`
}
