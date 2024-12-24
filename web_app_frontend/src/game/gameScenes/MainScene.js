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
    }

    preload() {
        // Assets will already be loaded by PreloaderScene
    }

    create() {
        this.createControls(); // Add user controls
        this.createEnvironment(); //Create the world environment (Fog, Ground and trees)
        this.createHero(); //Create the hero
        this.createEnemyGroup(); //Initialize enemy group



        // Initialize user input management
        this.userInputHandler = new UserInputHandler(this); //Turning the current scene into a manager
        this.userInputHandler.init();

        this.startEnemySpawner(); //Start generating enemies
        this.createAnimations(); //Add all animations

        this.setHitBoxes();
    }



    update() {
        this.hero.moveHeroToRight(); // Move the hero.  Handle hero movement
    
        
        
        this.updateGrounds();  //Manage looping ground
        this.updateTreeEnvironment(); //Manage looping decorations
        //this.destroyOffscreenEnemies();  // Destroy enemies outside the screen
        this.destroyOffscreenEnemiesContainer();  // Destroy enemies outside the screen

        //this.updateEnemyTextPositions();
        //Can't display hitboxes of different entities at the same time
        //this.floorHitbox();
        //this.heroHitbox();
        //this.enemyHitbox();
        this.checkPlayerInputForEnemies();
    }

    
    // ---------------- CONTROLS ----------------
    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }


    //------------PLAYER----------------
    //Create the character controlled by the player
    createHero() {
        this.hero = new Hero(this, this.scale.width * 0.5, 630);
        //Collision between the character and all the instances of ground
        this.grounds.forEach(ground => {
            this.physics.add.collider(this.hero.getSprite(), ground);
        });
        
    }
    //------------ENEMIES----------------
    createEnemyGroup(){
        this.enemies = this.physics.add.group(); //Create a group for enemies
        this.physics.add.collider(this.enemies, this.grounds);
    }

    spawnEnemy() {
        const sequence = this.userInputHandler.generateRandomSequence(); // Generate a sequence for the enemy
        const enemy = new Enemy(this, this.scale.width + 15, 445, sequence, this.grounds); // Create a new enemy
        //const enemy = new Enemy(this, gameConfig.width / 2, 50, sequence, this.grounds); // Create a new enemy
        this.enemies.add(enemy.container); // Add the container to the group

        // Make the enemy move and play its animation
        enemy.moveEnemyToLeft();

        //Ground collision management
        this.grounds.forEach(ground => {
            this.physics.add.collider(enemy.container, ground);
        });

        console.log(`Enemy spawned with sequence: ${sequence}`);

    }


    startEnemySpawner() {
        const minDelay = 1000; // Délai minimum en millisecondes
        const maxDelay = 3000; // Délai maximum en millisecondes

        // Setting up a repeated event to call spawnEnemy
        this.time.addEvent({
            delay: Phaser.Math.Between(minDelay, maxDelay), // Random delay
            callback: () => {
                this.spawnEnemy(); // Call spawnEnemy
                this.startEnemySpawner(); // Relaunch the spawner for the next intervals
            },
            loop: false,  // Do not loop automatically
        });
    }

    

  /*  destroyOffscreenEnemiesContainer() {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.x < -50) { // If the container is off-screen
                enemy.destroy(); // Détruire le container, ce qui détruit également son contenu
                console.log("Enemy destroyed with sequence:", enemy.sequence);
            }
        });
    }*/

    destroyOffscreenEnemiesContainer() {
        this.enemies.getChildren().forEach(enemy => {
            const enemyInstance = enemy.enemyInstance; // Récupérez l'instance Enemy
            if (enemyInstance && enemyInstance.isOutOfBounds()) { // Vérifiez si hors écran
                enemyInstance.destroy(); // Détruisez l'ennemi
                console.log("Enemy destroyed with sequence:", enemyInstance.sequence);
            }
        });
    }



    checkPlayerInputForEnemies(playerInput) {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.sequence === playerInput) {
                console.log("Correct input! Enemy destroyed:", enemy.sequence);
    
                // Destroy the enemy container and its content
                enemy.destroy();
    
                // Update score or trigger some feedback here
            }
        });
    }



    

    



    //------------ENVIRONMENT----------------
    //Create the background (Fog, ground and trees)
    createEnvironment() {
        this.createFog();
        this.createTreeEnvironment();
        this.createGrounds();
    }


    createFog() {
        //Load fog image to cover entire screen
        this.fog = this.add.image(0, 0, "Fog"); // Ajoutez l'image à la position (0,0)
        this.fog.setOrigin(0, 0); // Origine en haut à gauche
        this.fog.setDisplaySize(this.scale.width, this.scale.height); // Redimensionne pour couvrir l'écran

    }

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


    //Make the ground move to the left and loop it
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

    createTreeEnvironment(){
        const decorationWidth = 200; // Adjust to the actual width of “tree1”.
        const numDecorations = Math.ceil(this.scale.width / decorationWidth) + 2;

        this.decorations = [];
        for (let i = 0; i < numDecorations; i++) {
            const decoration = this.add.sprite(i * decorationWidth, 536, "tree1");
            decoration.setOrigin(0, 1); //Bottom left to align correctly
            this.decorations.push(decoration);
        }
    }

    //Make tree sprites move to the right and loop it
    updateTreeEnvironment() {
        const decorationSpeed = -25; // Vitesse de déplacement des décorations

        this.decorations.forEach((decoration) => {
            // Déplacer chaque décoration vers la gauche
            decoration.x += decorationSpeed * (1 / 60); // Déplacement basé sur 60 FPS

            // Si l'image sort de l'écran à gauche
            if (decoration.x + decoration.displayWidth <= 0) {
                // Trouver la dernière image visible
                const rightmostDecoration = this.decorations.reduce((rightmost, current) => {
                    return current.x > rightmost.x ? current : rightmost;
                });

                // Repositionner cette image après la dernière image visible
                decoration.x = rightmostDecoration.x + rightmostDecoration.displayWidth;
            }
        });
    }


     
    // ---------------- ANIMATIONS ----------------
    //Create animations and associate it with a sprite
    createAnimations() {
        this.anims.create({
            key: "enemy-move-left",
            frames: this.anims.generateFrameNumbers("EnemyRunAttackAnimation", { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1,
        });
      
    }

  


    //Initialiez hitboxes
    setHitBoxes() {
        this.hitboxDebug = this.add.graphics();
        this.hitboxDebug.lineStyle(2, 0xff0000); // Set a 2px red border
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