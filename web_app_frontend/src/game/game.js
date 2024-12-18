import Phaser from "phaser";
import gameConfig from "./gameConfig/gameConfig";
import MainScene from "./gameScenes/MainScene";
import PreloaderScene from "./gameScenes/PreloaderScene";

const config = {
    ...gameConfig,
    scene: [PreloaderScene, MainScene], // Ajouter des scènes
};

let game;

// Fonction pour démarrer le jeu
function startGame() {
    if (!game) {
        game = new Phaser.Game(config);
    }
}

export default startGame;