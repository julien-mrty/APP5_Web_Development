import Phaser from "phaser";
import Hero from "./../gameEntities/Hero.js";
import Enemy from "./../gameEntities/Enemy.js";
import UserInputHandler from "./UserInputHandler.js";



class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");

        this.hero = null; // The hero
        this.enemies = null; // Enemy group
        this.grounds = []; // Grounds (static elements)
        this.decorations = []; // To store decorative sprites (trees or other background elements
        this.userInputHandler = null; // User input handler
        this.playerInput = ""; // Stores player input
        this.minEnemySpawnDelay = 1000; // Minimum delay in milliseconds
        this.maxEnemySpawnDelay = 3000; // Maximum delay in milliseconds

        this.score = 0; //Player score
        this.scoreText = null; //Text displaying the score
        this.isGameOver = false; //Indicates when the game is over

        //Environment
        this.treeeZeroSpeed = -25; //Tree speed in the foreground
    }

    preload() {
        // Assets will already be loaded by PreloaderScene
    }

    

    create() {
        this.resetVariables();

        this.createControls(); // Add user controls
        this.createPauseControls(); // Add user controls for pause menu
        this.createEnvironment(); //Create the world environment (Fog, Ground and trees)
        this.createEnemyGroup(); //Initialize enemy group. Must be called before hero or the collision with it won't work
        this.createHero(); //Create the hero
        this.createLivesDisplay(); //Display lives
        this.createAttackPointsDisplay();
        this.createScoreDisplay(); //Initialize score display

        // Initialize user input management
        this.userInputHandler = new UserInputHandler(this); //Turning the current scene into a manager
        this.userInputHandler.init();

        this.startEnemySpawner(); //Start generating enemies


        //this.setHitBoxes();
        
    }


    update(time, delta) {
        this.updateEnvironment();
        this.hero.moveHeroToRight(); //Move the hero
        this.destroyOffscreenEnemiesContainer();  // Destroy enemies outside the screen
        this.checkPlayerInputForEnemies();
        this.updateScore(delta); //Score update

        //this.updateEnemyTextPositions();
        //Can't display hitboxes of different entities at the same time
        //this.floorHitbox();
        //this.heroHitbox();
        //this.enemyHitbox();
        
        //this.characterHitBoxes();
        // Stopper les mises à jour inutiles  
    }

    //Reset variables to avoid incoherent behavious where the hero doesn't nor have animation not hitboxes 
    resetVariables(){
        this.isGameOver = false; // Reset end-of-game status
        this.hero = null; // Reset hero
        this.score = 0; // Reset score
    }

    // ---------------- SCORE ----------------
    //Create the text to display the score
    createScoreDisplay() {
        this.scoreText = this.add.text(5, 70, `Score: 0 m`, {
            font: "20px Arial",
            fill: "#ffffff"
        }).setScrollFactor(0); // Set score display on screen
    }

    //Updates score based on elapsed time
    updateScore(delta) {
        if (this.isGameOver) {
            return; // Don't update the score if the game is over
        }
        const speed = 200; //Speed in pixels per second
        const pixelsToMeters = 0.01; // Pixel -> meter conversion

        this.score += speed * pixelsToMeters * (delta / 1000); // Convert delta (ms) to seconds
        this.scoreText.setText(`Score: ${Math.floor(this.score)} m`); // Update display
    }

    // ---------------- CONTROLS ----------------
    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

       
    }

    // ---------------- PAUSE ----------------
    pauseGame() {
        this.scene.pause(); //Pause the current scene
        this.scene.launch('PauseScene'); // Start a pause scene to display the menu or information
    }

    createPauseControls(){
        //To activate pause menu
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.escapeKey.on('down', () => {
            this.pauseGame(); //Calls up the pause function
        });
    }


    //------------PLAYER----------------
    //Create the character controlled by the player
    createHero() {
        this.hero = new Hero(this, this.scale.width * 0.5, 630);

        //Collision between the character and all the instances of ground
        this.grounds.forEach(ground => {
            this.physics.add.collider(this.hero.sprite, ground);
            //console.log(this.hero.sprite.body)
        });

        // Detect collisions between heroes and enemies.
        this.heroEnemyCollider = this.physics.add.overlap(
            this.hero.getSprite(), 
            this.enemies, 
            (heroSprite, enemyContainer) => {
                const enemy = enemyContainer.enemyInstance;
                if (enemy) {
                    if (this.hero.useAttackPoint()) {
                        // If an attack point is used, kill the enemy
                        console.log("Enemy killed with an attack point!");
                        enemy.destroy();
                    }
                    else { //Otherwise, the hero loses a life
                        this.hero.takeDamage();
                        enemy.destroy(); //Remove enemy after collision
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
        console.log(`Mise à jour des cœurs : ${this.hero.lives} restants`);
        // Deletes all displayed hearts
        this.hearts.forEach(heart => heart.destroy());
        this.hearts = []; // Reset the table
    
        // Display a heart for each remaining life
        for (let i = 0; i < this.hero.lives; i++) {
            const heart = this.add.image(20 + i * 30, 20, 'heartSprite'); // Offset each heart by 30px
            heart.setScrollFactor(0); // Fixes hearts on screen (not affected by camera movement)
            this.hearts.push(heart);
        }
    }

    //Initialize the sword sprite representing player's attack points
    createAttackPointsDisplay(){
        //Add sword icon
        this.swordIcon = this.add.image(20, 47, 'swordSprite'); // Position below the hearts
        this.swordIcon.setScrollFactor(0); // Fixes icon on screen
        this.swordIcon.setScale(1.5); // Enlarge image to 150% of its original size

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



    //------------ENEMIES----------------
    //Create an enemy group containing all the generated enemies and add collision to them
    createEnemyGroup(){
        this.enemies = this.physics.add.group(); //Create a group for enemies
        this.physics.add.collider(this.enemies, this.grounds);
    }

    //Create an enemy 
    spawnEnemy() {
        const sequence = this.userInputHandler.generateRandomSequence(); // Generate a sequence for the enemy
        const enemy = new Enemy(this, this.scale.width + 15, 445, sequence, this.grounds); // Create a new enemy
        this.enemies.add(enemy.container); // Add the container to the group

        enemy.moveEnemyToLeft(); // Make the enemy move and play its animation

        //Ground collision management
        this.grounds.forEach(ground => {
            this.physics.add.collider(enemy.container, ground);
        });

        console.log(`Enemy spawned with sequence: ${sequence}`);
    }

    //Make enemies appear intermittently
    startEnemySpawner() {
        // Setting up a repeated event to call spawnEnemy
        this.time.addEvent({
            delay: Phaser.Math.Between(this.minEnemySpawnDelay, this.maxEnemySpawnDelay), // Random delay
            callback: () => {
                this.spawnEnemy(); // Call spawnEnemy
                this.startEnemySpawner(); // Relaunch the spawner for the next intervals
            },
            loop: false,  // Do not loop automatically
        });
    }

    //Destroy an enemy when off screen to improve performances
    destroyOffscreenEnemiesContainer() {
        this.enemies.getChildren().forEach(enemy => {
            const enemyInstance = enemy.enemyInstance; // Recover the Enemy instance
            if (enemyInstance && enemyInstance.isOutOfBounds()) { // Check if off-screen
                enemyInstance.destroy(); // Destroy the enemy
                console.log("Enemy destroyed with sequence:", enemyInstance.sequence);
            }
        });
    }

    //Checks whether the player's inputs match the letter sequence associated with one of the enemies
    //Destroy it if it does
    checkPlayerInputForEnemies(playerInput) {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.sequence === playerInput) {
                console.log("Correct input! Enemy destroyed:", enemy.sequence);

                // Ajoute un point d'attaque au héros
                this.hero.addAttackPoint();
    
                //Think to update score or trigger some feedback here
            }
        });
    }

    //When the hero dies, change the speed of the enemies to give the illusion of a fast race.
   /* changeEnemySpeed(newSpeed) {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.body) {
                enemy.body.setVelocityX(newSpeed); // Appliquer la nouvelle vitesse
                console.log(`Updated enemy speed to: ${newSpeed}`);
            } else {
                console.warn("Enemy does not have a body:", enemy);
            }
        });
    }*/


    //------------ENVIRONMENT----------------
    //Create the background (Fog, ground and trees)
    createEnvironment() {
        this.createFog();
        this.treeSeven = this.createEnvironmentObjects("tree7", 536);
        this.treeSix = this.createEnvironmentObjects("tree6", 536); 
        this.lightThree = this.createEnvironmentObjects("light3", 536); 
        this.treesFour = this.createEnvironmentObjects("tree4", 536); 
        this.treesThree = this.createEnvironmentObjects("tree3", 536); 
        this.lightTwo = this.createEnvironmentObjects("light2", 536); //Light creation 
        this.treesZero = this.createEnvironmentObjects("tree0", 550); //Trees creation  
        this.treesOne = this.createEnvironmentObjects("tree1", 536); //Trees leaves creation
        
        this.createGrounds(); //Create physic ground
        this.foregroundGround = this.createEnvironmentObjects("foregroundGround", 540); //Create decoration ground
    }

    //Make the background move and loop on itself
    updateEnvironment(){
        this.updateGrounds();  //Manage looping ground
        this.updateEnvironmentObjects(this.treesZero, this.treeeZeroSpeed);
        this.updateEnvironmentObjects(this.treesOne, this.treeeZeroSpeed);
        this.updateEnvironmentObjects(this.lightTwo, -15);
        this.updateEnvironmentObjects(this.treesThree, -15);
        this.updateEnvironmentObjects(this.treesFour, -10);
        this.updateEnvironmentObjects(this.lightThree, -5);
        this.updateEnvironmentObjects(this.treeSix, -5);
        this.updateEnvironmentObjects(this.treeSeven, -2);
        this.updateEnvironmentObjects(this.foregroundGround, -70);
    }


    //Function importing a sprite
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
    updateEnvironmentObjects(decorations, speed) {
        if (this.isGameOver) {
            return; // Dont update decorations if the game is over
        }
        decorations.forEach((decoration) => {
            // Move each decoration to the left
            decoration.x += speed * (1 / 60); // Motion based on 60 FPS

            // If the image leaves the screen on the left
            if (decoration.x + decoration.displayWidth <= 0) {
                //Find the decoration furthest to the right
                const rightmostDecoration = decorations.reduce((rightmost, current) => {
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
        this.fog = this.add.image(0, 0, "Fog"); // Add image at position (0,0)
        this.fog.setOrigin(0, 0); // Origin top left
        this.fog.setDisplaySize(this.scale.width, this.scale.height); // Resize to cover screen
    }

    //Create the ground and move it to the left
    createGrounds(){
        this.grounds = []; //Table for storing all ground instances
        const groundWidth = 700; // Floor width (corresponds to the image)
        const screenWidth = this.scale.width; // Screen width
        const numTiles = Math.ceil(screenWidth / groundWidth) + 1; // Calculate how many floor tiles are needed to cover the screen

        for (let i = 0; i < numTiles; i++) {
            const ground = this.physics.add.sprite(i * groundWidth, 500, "groundSprite");
            ground.body.setImmovable(true); // The floor remains fixed (does not move under other forces)
            ground.body.allowGravity = false; //Disable gravity
            ground.body.setVelocityX(-200); //Scroll left
            ground.body.setOffset(0, 7); //Shift the hitbox slightly downwards
            this.grounds.push(ground); // Adjust to table
        }
    }


    //Loop the ground texture
    updateGrounds() {
        // Reset floor pieces that leave the screen
        const groundWidth = 700; // Largeur d'un morceau de sol
        this.grounds.forEach(ground => {
            if (ground.x + groundWidth / 2 < 0) {
                // Repositionnez ce morceau à la fin
                ground.x += groundWidth * this.grounds.length;
            }
        });
    }



    // ---------------- HITBOXES ----------------
    //Initialiez hitboxes
    setHitBoxes() {
        this.hitboxDebug = this.add.graphics();
        this.hitboxDebug.lineStyle(2, 0xff0000); // Set a 2px red border
    }

    //Display hero and enemy hitboxes
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
       this.hitboxDebug.lineStyle(2, 0xff0000); // Red, 2px thick
       this.grounds.forEach(ground => {
           const { x, y, width, height } = ground.body; //Reposition the floor when it leaves the screen
           //Draw a rectangle around the hitbox
           this.hitboxDebug.strokeRect(x, y, width, height);
       });
    }

    //Create the hitbox of the hero
    heroHitbox() {
        this.hitboxDebug.clear(); //Delete old rectangle
        const { x, y, width, height } = this.hero.body;
        //Draw a rectangle around the hitbox
        this.hitboxDebug.strokeRect(x, y, width, height);
    }

    //Create the hitbox of an enemy
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