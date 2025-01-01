import Phaser from 'phaser';

class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
        this.width = 0; //Dimension initialization
        this.height = 0;
    }

    create() {
        //Add a text in the center to indicate that the game is paused
        this.width = this.scale.width;
        this.height = this.scale.height;

        this.add.text(this.width / 2, this.height / 14, 'Game Paused', {
            font: '32px Arial',
            fill: '#ffffff',
            backgroundColor: '#d646e7'
        }).setOrigin(0.5, 0.5);

        
        this.buttonRestartGame(); //Call the button to restart the game
        this.buttonReturnToMenu(); //Call the button to return to the game

        //Add a manager to resume the game
        this.input.keyboard.on('keydown-ESC', () => {
            //Restart the main scene and close the pause scene
            this.scene.stop();
            this.scene.resume('MainScene');
        });
    }

    
    buttonRestartGame() {
        //Button to restart the game
        const restartButton = this.add.text(this.width / 2, this.height / 6, 'Restart Game', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#49b042',
            padding: { x: 10, y: 5 },
        })
            .setOrigin(0.5, 0.5)
            .setInteractive();

        //Click event to restart the game
        restartButton.on('pointerdown', () => {
            const mainScene = this.scene.get('MainScene');
            if (mainScene && !mainScene.isMusicPlaying()) {
                mainScene.mainSceneMusic.play(); //Restarts music only if not already in progress
            }
            this.scene.stop('MainScene'); //Stop the current game
            this.scene.stop(); //Stop the pause scene
            this.scene.start('MainScene'); //Restart the main game scene
        });

        //Change button appearance on hover
        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: "#e9ec34" });
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#ffffff' });
        });
    }

    buttonReturnToMenu(){
        //Button to return to main menu
        const mainMenuButton = this.add.text(this.width / 2, this.height / 4, 'Return to Main Menu', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#f04d4d',
            padding: { x: 10, y: 5 }
        })
        .setOrigin(0.5, 0.5)
        .setInteractive(); //Making text interactive

        //Click event management to go to the menu
        mainMenuButton.on('pointerdown', () => {
            const mainScene = this.scene.get('MainScene');
            if (mainScene) {
                mainScene.stopMusic(); //Call method to stop music
            }
            //Stop all scenes and return to main menu
            this.scene.stop('MainScene'); //Stop the game scene
            this.scene.stop(); //Stop pause scene
            this.scene.start('MainMenuScene'); //Return to main menu scene
        });

         //Change hover button appearance
         mainMenuButton.on('pointerover', () => {
            mainMenuButton.setStyle({ fill:  '#e9ec34' });
        });

        mainMenuButton.on('pointerout', () => {
            mainMenuButton.setStyle({ fill:  '#ffffff' });
        });
    }

    
}

export default PauseScene;
