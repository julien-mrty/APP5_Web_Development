import Phaser from 'phaser';

class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
        this.whiteColor = '#ffffff'
        this.redColor = '#ff0000'
    }

    create() {
        //Add a text in the center to indicate that the game is paused
        const { width, height } = this.scale;
        this.add.text(width / 2, height / 14, 'Game Paused', {
            font: '32px Arial',
            fill: this.whiteColor
        }).setOrigin(0.5, 0.5);

        //Button to return to main menu
        const mainMenuButton = this.add.text(width / 2, height / 6, 'Return to Main Menu', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#49b042',
            padding: { x: 10, y: 5 }
        })
        .setOrigin(0.5, 0.5)
        .setInteractive(); //Making text interactive

        //Click event management to go to the menu
        mainMenuButton.on('pointerdown', () => {
            this.returnToMainMenu();
        });

         // Changer l'apparence du bouton au survol
         mainMenuButton.on('pointerover', () => {
            mainMenuButton.setStyle({ fill:  this.redColor });
        });

        mainMenuButton.on('pointerout', () => {
            mainMenuButton.setStyle({ fill:  this.whiteColor });
        });

        //Add a manager to resume the game
        this.input.keyboard.on('keydown-ESC', () => {
            this.resumeGame();
        });
    }

    resumeGame() {
        // Restart the main scene and close the pause scene
        this.scene.stop();
        this.scene.resume('MainScene');
    }

    returnToMainMenu() {
        // Arrêter toutes les scènes et retourner au menu principal
        this.scene.stop('MainScene'); // Arrêter la scène de jeu
        this.scene.stop(); // Arrêter la scène de pause
        this.scene.start('MainMenuScene'); // Retourner à la scène du menu principal
    }

    
}

export default PauseScene;
