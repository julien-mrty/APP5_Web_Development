import Phaser from 'phaser';

class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
        this.redColor = '#ff0000';
        this.width = 0; // Dimension initialization
        this.height = 0;
    }

    init(data) {
        this.finalScore = data.score || 0; // Recevoir le score final depuis MainScene
    }

    create() {
        //Add a text in the center to indicate that the game is paused
        this.width = this.scale.width;
        this.height = this.scale.height;

        // Add text “Game Over"
        this.add.text(this.width / 2, this.height / 3, 'Game Over', {
            font: '48px Arial',
            fill: '#ff0000' //red
        }).setOrigin(0.5);

        // Display final score
        this.add.text(this.width / 2, this.height / 2, `Final Score: ${Math.floor(this.finalScore)} m`, {
            font: '32px Arial',
            fill: '#ffffff' //white
        }).setOrigin(0.5);

        this.buttonRestartGame(); // Add restart button
        this.buttonReturToMenu(); // Add button to return to the menu

    }

    buttonRestartGame() {
        //Button to restart the game
        const restartButton = this.add.text(this.width / 2, this.height / 1.5, 'Restart Game', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#49b042',
            padding: { x: 10, y: 5 },
        })
            .setOrigin(0.5)
            .setInteractive();

        // Click event to restart the game
        restartButton.on('pointerdown', () => {
            this.scene.stop('MainScene'); // Stop the current game
            this.scene.stop(); // Stop the game over scene
            this.scene.start('MainScene'); // Restart the main game scene
        });

        // Change button appearance on hover
        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#e9ec34' });
        });

        // Change button appearance when not hover
        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#ffffff' });
        });
    }

    // Button to return to main menu
    buttonReturToMenu(){
        
        const mainMenuButton = this.add.text(this.width / 2, this.height / 1.3, 'Return to Main Menu', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#49b042',
            padding: { x: 10, y: 5 }
        })
            .setOrigin(0.5)
            .setInteractive();

        //Button event management
        mainMenuButton.on('pointerdown', () => {
            this.scene.stop('MainScene'); // Stop the game scene
            this.scene.stop(); // Stop GameOverScene
            this.scene.start('MainMenuScene'); // Back to main menu
        });

        mainMenuButton.on('pointerover', () => {
            mainMenuButton.setStyle({ fill: '#ff0000' });
        });

        mainMenuButton.on('pointerout', () => {
            mainMenuButton.setStyle({ fill: '#ffffff' });
        });
    }
}

export default GameOverScene;
