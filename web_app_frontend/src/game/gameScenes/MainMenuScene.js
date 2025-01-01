import Phaser from "phaser";

//Background Menu 
import MenuBackground from "/src/gameAssets/gameUI/mainMenuImage.png"

//Buttons
import PlayButton from "/src/gameAssets/gameUI/playButton.png"
import ScoreButton from "/src/gameAssets/gameUI/scoreButton.png"
import GameTitle from "/src/gameAssets/gameUI/gameTitle.png"

//Menu class from which to launch a game
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

        this.load.audio('mainMenuMusic', MenuBackground);
    }

    create() {
        this.add.image(0, 0, "menuBackground").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height); //Add the background        
        this.add.image(340, 50, "gameTitle").setScale(0.1);  //Add the title

        //Plays music using MusicScene
        const musicScene = this.scene.get("MusicScene");
        if (!musicScene.isPlaying("mainMenuMusic")) {
            musicScene.playMusic("mainMenuMusic", { volume: 0.5, loop: true });
        }


        //Add the play button
        const playButton = this.add.image(200, this.pictureYPosition, "playButton")
            .setInteractive()
            .setScale(0.15); 
        playButton.on("pointerdown", () => {
            musicScene.stopMusic(); //Stops music when leaving main menu
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
