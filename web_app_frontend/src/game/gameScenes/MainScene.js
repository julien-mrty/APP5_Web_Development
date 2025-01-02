import Phaser from "phaser";
import Hero from "./../gameEntities/Hero.js";
import Enemy from "./../gameEntities/Enemy.js";
import UserInputHandler from "./../gameUtils/UserInputHandler.js";
import EnemyDetector from "./../gameUtils/EnemyDetector.js";

//Class representing the game itself
class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");

        //General
        this.hero = null; //The hero (the character the player control)
        this.enemies = null; //Enemy group
        this.minEnemySpawnDelay = 1000; //Minimum delay in milliseconds before spawning an enemy
        this.maxEnemySpawnDelay = 3000; //Maximum delay in milliseconds before spawning an enemy

        //Environment
        this.treeeZeroSpeed = -25; //Tree speed in the background
        this.grounds = []; //Ground the hero is running on 
        this.decorations = []; //To store decorative sprites (trees or other background elements)

        //Inputs
        this.userInputHandler = null; //User input handler
        this.playerInput = ""; //Stores player input
       
        //Game
        this.score = 0; //Player score
        this.scoreText = null; //Text displaying the score
        this.isGameOver = false; //Indicates when the game is over
        this.distanceTreshold = 100; //Distance in metres from which the number of characters increases by 1
        this.previousScoreCheckpoint = 0; // Track the last score checkpoint for max sequence adjustment

        //Detecion zone position that indicate when to activate the attack animation
        this.detectedEnemies = []; //List of enemies currently in the attack animation 
        this.attackZonePositionX = 200;
        this.attackZonePositionY = 444;
        this.attackZoneWidth = 150;
        this.attackZoneHeight = 50;
    }

    preload() {
        //Assets will already be loaded by PreloaderScene
    }

    
    create() {
        this.resetVariables(); //Reset important variables
        this.createPauseControls(); //Add user controls for pause menu
        this.createEnvironment(); //Create the world environment (Fog, Ground and trees)
        this.createEnemyGroup(); //Initialize enemy group. Must be called before hero or the collision with it won't work
        this.createHero(); //Create the hero
        this.createEnemyDetectionZone(false); //Zone to activate animation
        this.createLivesDisplay(); //Display the hero's life
        this.createAttackPointsDisplay(); //Display the hero's attack points
        this.createScoreDisplay(); //Initialize score display
        this.startEnemySpawner(); //Start generating enemies
        this.createSoundAttack(); //Create the sound of the hero's attack
        this.createMusic();

        //Initialize user input management to detect keys
        this.userInputHandler = new UserInputHandler(this); //Turning the current scene into a manager
        this.userInputHandler.init();

        //this.setHitBoxes(); //For debugging
    }

    //Method called every frames
    update(time, delta) {
        if (this.isGameOver) {
            if (!this.scoreSaved) {
                this.saveScore(); //Save score once only and send it to the database
                this.scoreSaved = true; //Mark score as saved
            }
            return; //Prevent from updating the game if it's over
        }


        this.updateEnvironment(); //Make the environement move
        this.hero.moveHeroToRight(); //Move the hero
        this.destroyOffscreenEnemiesContainer();  //Destroy enemies outside of the screen on the left
        this.checkPlayerInputForEnemies(); //Check if the input can destroy an enemy
        this.updateScore(delta); //Score update
        this.enemyDetector.processEnemyDetection(this.hero); //Check if an enemy can be attacked

        //For debugging collision
        //this.floorHitbox();
        //this.characterHitBoxes();
        //this.enemyHitbox();
        
    }

    //Reset variables to avoid incoherent behavious where the hero doesn't nor have animation not hitboxes 
    resetVariables(){
        this.isGameOver = false; //Reset end-of-game status
        this.hero = null; //Reset hero
        this.score = 0; //Reset score
        this.scoreSaved = false; // Reset score saved flag
        this.previousScoreCheckpoint = 0; // Resets the last control point
    }

    //------------------------------------------------HERO------------------------------------------------
    //Create the character controlled by the player
    createHero() {
        this.hero = new Hero(this, this.scale.width * 0.5, 630);

        //Collision between the character and all the instances of ground
        this.grounds.forEach(ground => {
            this.physics.add.collider(this.hero.sprite, ground);
        });

        //Detect collisions between the heroe and the enemies
        this.heroEnemyCollider = this.physics.add.overlap(
            this.hero.getSprite(), 
            this.enemies, 
            (heroSprite, enemyContainer) => {
                const enemy = enemyContainer.enemyInstance;
                if (enemy) {
                    if (this.hero.useAttackPoint()) { //If an attack point is used, kill the enemy
                        enemy.destroy();
                    }
                    else { //Otherwise, the hero loses a life
                        this.hero.takeDamage();
                    }
                }
            },
            null,
            this
        );
        
    }

    //Initializes the heart chart representing the player's life 
    createLivesDisplay() {
        this.hearts = []; //Array for storing hearts sprites
        this.updateLivesDisplay(); //Initializes hearts according to lives
    }

    //Updates the number of hearts displayed on screen according to the number of life points
    updateLivesDisplay() {
        //Deletes all displayed hearts
        this.hearts.forEach(heart => heart.destroy());
        this.hearts = []; //Reset the table
    
        //Display a heart for each remaining life
        for (let i = 0; i < this.hero.lives; i++) {
            const heart = this.add.image(20 + i * 30, 20, 'heartSprite'); //Offset each heart by 30px
            heart.setScrollFactor(0); //Fixes hearts on screen (not affected by camera movement)
            this.hearts.push(heart);
        }
    }

    //Initialize the sword sprite representing player's attack points
    createAttackPointsDisplay(){
        //Add sword icon
        this.swordIcon = this.add.image(20, 47, 'swordSprite'); //Position below the hearts
        this.swordIcon.setScrollFactor(0); //Fixes icon on screen
        this.swordIcon.setScale(1.5); //Enlarge image to 150% of its original size

        //Position the text indicating the number of attack points
        this.attackPointsText = this.add.text(
            50, 40, 
            `${this.hero.attackPoints}`, //Initial text
            { font: "20px Arial", fill: "#ffffff" }
        ).setScrollFactor(0);
    }

    //Updates the number of player's attack points
    updateAttackPointsDisplay() {
        this.attackPointsText.setText(`${this.hero.attackPoints}`);
    }

    //Create the zone in which once an enemy enters it activate the attack animation
    createEnemyDetectionZone(visible = false){
        this.enemyDetector = new EnemyDetector(this, {
            x: this.attackZonePositionX,
            y: this.attackZonePositionY,
            width: this.attackZoneWidth,
            height: this.attackZoneHeight,
            showHitbox: visible, //Activates hitbox display
        });
    }

    //Create the sound of the hero's attack
    createSoundAttack(){
        this.attackSound = this.sound.add('attackSound', {
            volume: 0.5, //Adjust volume
            loop: false, //No loop for an attacking sound
        });
    }



    
    //------------------------------------------------ENEMIES------------------------------------------------
    //Create an enemy group containing all the generated enemies and add collision to them
    createEnemyGroup(){
        this.enemies = this.physics.add.group(); //Create a group for enemies
        this.physics.add.collider(this.enemies, this.grounds);
    }

    //Create an enemy 
    spawnEnemy() {
        const sequence = this.userInputHandler.generateRandomSequence(); //Generate a sequence for the enemy
        const enemy = new Enemy(this, this.scale.width + 100, 445, sequence, this.grounds); //Create a new enemy
        this.enemies.add(enemy.container); //Add the container to the group
        enemy.hasTriggered = false; //Ajoute la propriété pour suivre l'état du déclenchement
        enemy.moveEnemyToLeft(); //Make the enemy move and play its animation

        //Ground collision management
        this.grounds.forEach(ground => {
            this.physics.add.collider(enemy.container, ground);
        });

        //console.log(`Enemy spawned with sequence: ${sequence}`);
    }

    //Make enemies appear intermittently
    startEnemySpawner() {
        //Setting up a repeated event to call spawnEnemy
        this.time.addEvent({
            delay: Phaser.Math.Between(this.minEnemySpawnDelay, this.maxEnemySpawnDelay), //Random delay
            callback: () => {
                this.spawnEnemy(); //Call spawnEnemy
                this.startEnemySpawner(); //Relaunch the spawner for the next intervals
            },
            loop: false, //Prevent from looping automatically
        });
    }

    //Destroys an enemy if it is outside the screen limits on the left
    destroyOffscreenEnemiesContainer() {
        this.enemies.getChildren().forEach(enemy => {
            const enemyInstance = enemy.enemyInstance; //Recovers Enemy instance
            if (enemyInstance && enemyInstance.isOutOfBounds()) { //Checks if off-screen
                enemyInstance.destroy(); //Destroys the enemy
                console.log("Enemy destroyed offscreen.");
                this.detectedEnemies = this.detectedEnemies.filter(e => e !== enemyInstance); //Removes from the list of detected enemies
            }
        });
    }

    //Checks whether the player's inputs match the letter sequence associated
    // with one of the enemies and destroyd it accordingly
    checkPlayerInputForEnemies(playerInput) {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.sequence === playerInput) {
                //console.log("Correct input! Enemy destroyed:", enemy.sequence);
                this.hero.addAttackPoint(); //Adds one attack point to the hero
            }
        });
    }
    



    //------------------------------------------------SCORE------------------------------------------------
    //Create the text to display the score
    createScoreDisplay() {
        this.scoreText = this.add.text(5, 70, `Score: 0 m`, {
            font: "20px Arial",
            fill: "#ffffff"
        }).setScrollFactor(0); //Set score display on screen
    }

    //Updates score based on elapsed time
    //Increase  the number of characters based on the distance travelled
    updateScore(delta) {
        if (this.isGameOver) {
            return; //Prevent from updating score if the game is over
        }
        const speed = 200; //Speed in pixels per second
        const pixelsToMeters = 0.02; //Pixel -> meter conversion

        this.score += speed * pixelsToMeters * (delta / 1000); //Convert delta (ms) to seconds
        this.scoreText.setText(`Score: ${Math.floor(this.score)} m`); //Update display

        // Check if the score is a multiple of this.distanceTreshold (100) and adjust max sequence length
        if (
            Math.floor(this.score) % this.distanceTreshold === 0 && 
            Math.floor(this.score) !== this.previousScoreCheckpoint &&
            this.userInputHandler.maxSequence < this.userInputHandler.MAX_SEQUENCE_LIMIT &&//Ensure it is below the limit
            this.score != 0 //Sometime the message is displayed from the start
            )
         {
            this.previousScoreCheckpoint = Math.floor(this.score); //Update the last checkpoint
            this.userInputHandler.increaseMaxSequence(); //Increase max sequence

            // Display the milestone message
            this.showMilestoneMessage(this.previousScoreCheckpoint, this.userInputHandler.maxSequence);
        }
    }

    //Message indicating the number of meters traveled and the increase 
    //in the number of characters in a string as a function of this distance.
    showMilestoneMessage(distance, maxSequence) {
        const message = `${distance} metres travelled ! Switch to ${maxSequence} letters !`;
    
        //Create the text at the center-top of the screen
        const milestoneText = this.add.text(
            this.scale.width / 1.9, 
            130, 
            message, 
            { font: "32px Arial", fill: "#11ad2c", align: "center" }
        ).setOrigin(0.5, 0.5);
    
        // Make the text flash
        this.tweens.add({
            targets: milestoneText,
            alpha: 0, // Fade out to invisible
            ease: 'Cubic.easeInOut',
            duration: 500, // Time in ms for each fade
            repeat: 5, // Number of fade cycles (5 flashes)
            yoyo: true // Make it fade back in
        });
    
        // Destroy the text after the animation is done
        this.time.delayedCall(3000, () => {
            milestoneText.destroy();
        });
    }




    //------------------------------------------------PAUSE------------------------------------------------
    //Pause the game
    pauseGame() {
        this.scene.pause(); //Pause the current scene
        this.scene.launch('PauseScene'); //Start a pause scene to display the menu or information
    }

    //Allows “Escape” button to create pause state
    createPauseControls(){
        //To activate pause menu
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.escapeKey.on('down', () => {
            this.pauseGame(); //Calls up the pause function
        });
    }




    //------------------------------------------------ENVIRONMENT------------------------------------------------
    //Create the background (Fog, ground and trees)
    //Import order is important
    createEnvironment() {
        this.createFog();
        this.treeSeven = this.createEnvironmentObjects("tree7", 536);
        this.treeSix = this.createEnvironmentObjects("tree6", 536); 
        this.lightThree = this.createEnvironmentObjects("light3", 536); 
        this.treesFour = this.createEnvironmentObjects("tree4", 536); 
        this.treesThree = this.createEnvironmentObjects("tree3", 536); 
        this.lightTwo = this.createEnvironmentObjects("light2", 536); //Light creation 
        this.treesOne = this.createEnvironmentObjects("tree1", 536); //Trees creation
        this.treesZero = this.createEnvironmentObjects("tree0", 550); //Trees leaves creation  
        this.createGround(); //Create physic ground
        this.groundDecoration = this.createEnvironmentObjects("groundDecoration", 540); //Create decoration ground
    }

    //Make the background move and loop on itself
    updateEnvironment(){
        this.updateGround();
        this.updateEnvironmentObjects(this.groundDecoration, -70);
        this.updateEnvironmentObjects(this.treesZero, this.treeeZeroSpeed);
        this.updateEnvironmentObjects(this.treesOne, this.treeeZeroSpeed);
        this.updateEnvironmentObjects(this.lightTwo, -20);
        this.updateEnvironmentObjects(this.treesThree, -15);
        this.updateEnvironmentObjects(this.treesFour, -10);
        this.updateEnvironmentObjects(this.lightThree, -7);
        this.updateEnvironmentObjects(this.treeSix, -5);
        this.updateEnvironmentObjects(this.treeSeven, -3);
    }

    //Function to import a sprite 
    createEnvironmentObjects(imageKey, yPosition) {
        const decorations = [];
        const decorationWidth = this.textures.get(imageKey).getSourceImage().width; //Recovers actual image width

        //Calculate the number of decorations needed to cover the screen, plus a margin.
        const numDecorations = Math.ceil(this.scale.width / decorationWidth) + 2;

        //Add decorations
        for (let i = 0; i < numDecorations; i++) {
            const decoration = this.add.sprite(i * decorationWidth, yPosition, imageKey);
            decoration.setOrigin(0, 1); //Position origin at bottom left
            decorations.push(decoration);
        }

        return decorations;
    }

    //Function making environments sprites move to the left and loop it
    updateEnvironmentObjects(backgroundSprite, speed) {
        if (this.isGameOver) {
            return; //Prevent from updating decorations if the game is over
        }
        backgroundSprite.forEach((decoration) => {
            //Move each decoration to the left
            decoration.x += speed * (1 / 60); //Motion based on 60 FPS

            //If the image leaves the screen on the left
            if (decoration.x + decoration.displayWidth <= 0) {
                //Find the decoration furthest to the right
                const rightmostDecoration = backgroundSprite.reduce((rightmost, current) => {
                    return current.x > rightmost.x ? current : rightmost;
                });

                //Reposition this image after the last visible one
                decoration.x = rightmostDecoration.x + rightmostDecoration.displayWidth;
            }
        });
    }

    //Create the gray fog in the background
    createFog() {
        //Load fog image to cover entire screen
        this.fog = this.add.image(0, 0, "Fog"); //Add image at position (0,0)
        this.fog.setOrigin(0, 0); //Origin top left
        this.fog.setDisplaySize(this.scale.width, this.scale.height); //Resize to cover screen
    }

    //Create the ground the run on and move it to the left
    createGround(){
        this.grounds = []; //Table for storing all ground instances
        const groundWidth = 700; //Floor width (corresponds to the image)
        const screenWidth = this.scale.width; //Screen width
        const numTiles = Math.ceil(screenWidth / groundWidth) + 1; //Calculate how many floor tiles are needed to cover the screen

        for (let i = 0; i < numTiles; i++) {
            const ground = this.physics.add.sprite(i * groundWidth, 500, "groundSprite");
            ground.body.setImmovable(true); //The floor remains fixed (does not move under other forces)
            ground.body.allowGravity = false; //Disable gravity
            ground.body.setVelocityX(-200); //Scroll left
            ground.body.setOffset(0, 7); //Shift the hitbox slightly downwards
            this.grounds.push(ground); //Adjust to table
        }
    }

    //Loop the ground texture
    updateGround() {
        //Reset floor pieces that leave the screen
        const groundWidth = 700; //Width of a piece of floor
        this.grounds.forEach(ground => {
            if (ground.x + groundWidth / 2 < 0) {
                ground.x += groundWidth * this.grounds.length; //Reposition this piece at the end
            }
        });
    }




    //------------------------------------------------BACKEND------------------------------------------------
    //Save the player score and send it to the database
    saveScore() {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("User not authenticated");
            return;
        }
    
        const apiUrl = import.meta.env.VITE_APP_API_URL;
        const payload = {
            UserID: this.getUserIdFromToken(token), //Extract user from token
            Points: Math.floor(this.score), //Round off the score before sending it off
        };
    
        fetch(`${apiUrl}/api/runningScores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.message || "Failed to save score");
                });
            }
            console.log("Running game score saved successfully");
        })
        .catch((error) => {
            console.error("Error saving running game score:", error);
        });
    }
    
    //Enables token authentication
    getUserIdFromToken(token) {
        try {
            const payloadBase64Url = token.split(".")[1];
            const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return decodedPayload.userID || decodedPayload.id;
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    }




    //------------------------------------------------MUSIC------------------------------------------------
    //Create the music of the current scene
    createMusic() {
        if (!this.mainSceneMusic) {
            this.mainSceneMusic = this.sound.add('runningGameMusic', {
                volume: 0.5,
                loop: true,
            });
        }
    
        if (!this.mainSceneMusic.isPlaying) {
            this.mainSceneMusic.play();
        }
    }

    //Stop the music of the current scene
    stopMusic() {
        if (this.mainSceneMusic && this.mainSceneMusic.isPlaying) {
            this.mainSceneMusic.stop();
        }
    }

    //Check if the music is currently playin
    isMusicPlaying() {
        return this.mainSceneMusic && this.mainSceneMusic.isPlaying;
    }




    //------------------------------------------------HITBOXES (Debugging)------------------------------------------------
    //Initialiez hitboxes
    setHitBoxes() {
        this.hitboxDebug = this.add.graphics();
        this.hitboxDebug.lineStyle(2, 0xff0000); //Set a 2px red border
    }

    //Display hero and enemies hitboxes
    characterHitBoxes(){
        this.hitboxDebug.clear();
        this.hitboxDebug.lineStyle(2, 0xff0000);
        
        //Hero
        const heroBody = this.hero.getSprite().body;
        this.hitboxDebug.strokeRect(heroBody.x, heroBody.y, heroBody.width, heroBody.height);
        
        //Ennemies
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.body) {
                this.hitboxDebug.strokeRect(enemy.body.x, enemy.body.y, enemy.body.width, enemy.body.height);
            }
        });
    }
   
    //Create the hitbox of the floor
    floorHitbox() {
       //View the floor hitbox
       this.hitboxDebug.clear(); //Delete old rectangle
       this.hitboxDebug.lineStyle(2, 0xff0000); //Red, 2px thick
       this.grounds.forEach(ground => {
           const { x, y, width, height } = ground.body; //Reposition the floor when it leaves the screen
           //Draw a rectangle around the hitbox
           this.hitboxDebug.strokeRect(x, y, width, height);
       });
    }

    //Create the hitbox of enemies
    enemyHitbox() {
        this.hitboxDebug.clear(); //Delete old rectangles
        this.hitboxDebug.lineStyle(2, 0xff0000); //Red, 2px thick
    
        //Browse every enemy in the group
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.body) { //Check that the body exists to avoid errors
                const { x, y, width, height } = enemy.body; //Retrieve body dimensions
                this.hitboxDebug.strokeRect(
                    x-5, //Offset to center hitbox
                    y,
                    width,
                    height
                );
            }
        });
    }

}

export default MainScene;