import Phaser from "phaser";

//Background Menu 
import MenuBackground from "/src/gameAssets/gameBackgrounds/mainMenuImage.png"

class ScoreScene extends Phaser.Scene {
    constructor() {
        super("ScoreScene");
    }

    preload() {
        // Load assets as needed
        this.load.image("menuBackground", MenuBackground);
    }

    create() {
        this.add.image(0, 0, "menuBackground").setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height); //Add the background  

        
        // Add a title for the scoreboard
        this.add.text(this.scale.width / 2, 50, "Scoreboard", {
            font: "48px Arial",
            fill: "#ff2d00",
        }).setOrigin(0.5);

        // Score simulation for display
        const scores = [
            { name: "Player1", score: 100 },
            { name: "Player2", score: 80 },
            { name: "Player3", score: 60 },
        ];

        // Draw a table-like display for scores
        const startX = this.scale.width / 2 - 150; // Starting X position for the table
        const startY = 120; // Starting Y position for the table
        const rowHeight = 50; // Height of each row
        const rowWidth = 300; // Width of the row

        scores.forEach((score, index) => {
            const rowY = startY + index * rowHeight;

            // Draw the background rectangle for the row
            const graphics = this.add.graphics();
            graphics.fillStyle(0x000000, 0.8); // Black background with 80% opacity
            graphics.fillRect(startX, rowY, rowWidth, rowHeight);

            // Add the text for the player's name
            this.add.text(startX + 20, rowY + 10, `${index + 1}. ${score.name}`, {
                font: "24px Arial",
                fill: "#ffffff",
            });

            // Add the text for the player's score
            this.add.text(startX + rowWidth - 80, rowY + 10, `${score.score} pts`, {
                font: "24px Arial",
                fill: "#ffffff",
            });
        });

        // Add a button to return to the main menu
        const backButton = this.add.text(this.scale.width / 2, this.scale.height - 50, "Back", {
            font: "32px Arial",
            fill: "#ff2d00",
        }).setOrigin(0.5).setInteractive();

        backButton.on("pointerdown", () => {
            this.scene.start("MainMenuScene");
        });
    }
}

export default ScoreScene;
