import Phaser from "phaser";
import MenuBackground from "/src/gameAssets/gameUI/mainMenuImage.png";

class ScoreScene extends Phaser.Scene {
    constructor() {
        super("ScoreScene");
    }

    preload() {
        //Load assets as needed
        this.load.image("menuBackground", MenuBackground);
    }

    async create() {
        this.add.image(0, 0, "menuBackground")
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);

        // Add a button to return to the main menu
        const backButton = this.add.text(this.scale.width / 2, this.scale.height - 50, "Back", {
            font: "32px Arial",
            fill: "#ff2d00",
        }).setOrigin(0.5).setInteractive();

        backButton.on("pointerdown", () => {
            this.scene.start("MainMenuScene");
        });

        //Play menu music
        const musicScene = this.scene.get("MusicScene");
        if (!musicScene.isPlaying("mainMenuMusic")) {
            musicScene.playMusic("mainMenuMusic", { volume: 0.5, loop: true });
        }

        //Add a title for the scoreboard
        this.add.text(this.scale.width / 2, 50, "Top Seven", {
            font: "48px Arial",
            fill: "#10cd30",
        }).setOrigin(0.5);


        // Fetch top scores
        const scores = await this.fetchTopScores();

        if (!Array.isArray(scores) || scores.length === 0) {
            this.add.text(this.scale.width / 2, this.scale.height / 2, "No scores available", {
                font: "32px Arial",
                fill: "#ffffff",
            }).setOrigin(0.5);
            return;
        }

        //Draw a table-like display for scores
        const startX = this.scale.width / 2 - 150; // Starting X position for the table
        const startY = 80; // Starting Y position for the table
        const rowHeight = 50; // Height of each row
        const rowWidth = 300; // Width of the row

        scores.forEach((score, index) => {
            const rowY = startY + index * rowHeight;

            // Draw the background rectangle for the row
            const graphics = this.add.graphics();
            graphics.fillStyle(0x000000, 0.8); // Black background with 80% opacity
            graphics.fillRect(startX, rowY, rowWidth, rowHeight);

            // Add the text for the player's name
            this.add.text(startX + 20, rowY + 10, `${index + 1}. ${score.username || "Anonymous"}`, {
                font: "24px Arial",
                fill: "#ffffff",
            });

            this.add.text(startX + rowWidth - 80, rowY + 10, `${score.Points} pts`, {
                font: "24px Arial",
                fill: "#ffffff",
            });
        });

        
    }

    // Fetch top scores from the backend
    async fetchTopScores() {
        const apiUrl = import.meta.env.VITE_APP_API_URL;
        const token = localStorage.getItem("authToken");

        if (!token) {
            console.error("User not authenticated");
            return [];
        }

        try {
            const response = await fetch(`${apiUrl}/api/runningScores/topSeven`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return Array.isArray(data) ? data : []; // Return the list of top scores
            } else {
                console.error("Failed to fetch top scores:", await response.text());
                return [];
            }
        } catch (error) {
            console.error("Error fetching scores:", error);
            return [];
        }
    }
}

export default ScoreScene;
