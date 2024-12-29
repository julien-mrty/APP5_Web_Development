import Phaser from "phaser";
import gameConfig from "./gameConfig/gameConfig";
import PreloaderScene from "./gameScenes/PreloaderScene";
import MainMenuScene from "./gameScenes/MainMenuScene.js";
import MainScene from "./gameScenes/MainScene";
import ScoreScene from "./gameScenes/ScoreScene.js";
import PauseScene from "./gameScenes/PauseScene.js";

const config = {
    ...gameConfig,
    scene: [PreloaderScene, MainMenuScene, ScoreScene, MainScene, PauseScene], // Add scenes
};

let game;

// Fonction pour démarrer le jeu
function startGame() {
    if (!game) {
        game = new Phaser.Game(config);
    }
}

export default startGame;