import Phaser from "phaser";


//Background Menu 
import MenuBackground from "/src/gameAssets/gameBackgrounds/mainMenuImage.png"

//Buttons
import PlayButton from "/src/gameAssets/gameBackgrounds/playButton.png"
import ScoreButton from "/src/gameAssets/gameBackgrounds/scoreButton.png"
import GameTitle from "/src/gameAssets/gameBackgrounds/gameTitle.png"

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super("MainMenuScene");
        this.pictureYPosition = 350; 
    }

    preload() {
        // Load the assets required for the menu
        this.load.image("menuBackground", MenuBackground);
        this.load.image("playButton", PlayButton);
        this.load.image("scoreButton", ScoreButton);
        this.load.image("gameTitle", GameTitle);
    }

    create() {
        this.add.image(0, 0, "menuBackground").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height); //Add the background        
        this.add.image(340, 50, "gameTitle").setScale(0.1);  //Add the title

        //Add the play button
        const playButton = this.add.image(200, this.pictureYPosition, "playButton")
            .setInteractive()
            .setScale(0.15); 
        playButton.on("pointerdown", () => {
            this.scene.start("MainScene");
        });

        //Add the scoreboard button
        const scoreButton = this.add.image(500, this.pictureYPosition, "scoreButton")
            .setInteractive()
            .setScale(0.15); ;
        scoreButton.on("pointerdown", () => {
            this.scene.start("ScoreScene");
        });
    }
}

export default MainMenuScene;
