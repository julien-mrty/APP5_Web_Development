import Phaser from "phaser";
import gameConfig from "./gameConfig/gameConfig";
import PreloaderScene from "./gameScenes/PreloaderScene";
import MainMenuScene from "./gameScenes/MainMenuScene.js";
import MainScene from "./gameScenes/MainScene";
import ScoreScene from "./gameScenes/ScoreScene.js";
import PauseScene from "./gameScenes/PauseScene.js";
import GameOverScene from './gameScenes/GameOverScene';
import MusicScene from './gameScenes/MusicScene';

const config = {
    ...gameConfig,
    scene: [PreloaderScene, MusicScene, MainMenuScene, ScoreScene, MainScene, PauseScene, GameOverScene], // Add scenes
    audio: {
        disableWebAudio: false,
    }
};

let game;


//Game start function
function startGame() {
    if (game) {
        console.warn("Game instance already exists");
        return game;
    }
    game = new Phaser.Game(config);
    return game;
}

// Function to destroy the game
function destroyGame() {
    if (game) {
        game.destroy(true); // Completely destroys the Phaser instance
        game = null; // Reset reference
    }
}

export { startGame, destroyGame };