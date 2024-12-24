import Phaser from "phaser";
import gameConfig from '../gameConfig/gameConfig.js';
import UserInputHandler from "./UserInputHandler.js";


class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");

        this.hero = null; // The hero
        this.enemies = null; // Enemy group
        this.grounds = []; // Grounds (static elements)
        this.decorations = []; // To store decorative sprites (trees or other background elements
    
        this.userInputHandler = null; // User input handler
        this.randomSequence = ""; // Stores the generated sequence
        this.playerInput = ""; // Stores player input
        this.minSequence = 3; // Minimum sequence length
        this.maxSequence = 7; // Maximum sequence length
    }

    preload() {
        // Assets will already be loaded by PreloaderScene
    }

    create() {
        this.createControls(); // Add user controls
        this.createEnvironment(); //Create the world environment (Fog, Ground and trees)
        this.createHero(); //Create the hero
        this.createEnemyGroup(); //Initialize enemy group
        this.startEnemySpawner(); //Start generating enemies
        this.createAnimations(); //Add all animations

        // Initialize user input management
        this.userInputHandler = new UserInputHandler(this); //Turning the current scene into a manager
        this.userInputHandler.init();

        this.setHitBoxes();
    }



    update() {
        this.updateGrounds();  //Manage looping ground
        this.updateTreeEnvironment(); //Manage looping decorations
        this.moveHero(); // Handle hero movement
        this.destroyOffscreenEnemies();  // Destroy enemies outside the screen

        //Can't display hitboxes of different entities at the same time
        //this.floorHitbox();
        //this.heroHitbox();
        //this.enemyHitbox();
    }

    
    // ---------------- CONTROLS ----------------
    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }


    //------------PLAYER----------------
    //Create the character controlled by the player
    createHero() {
        this.hero = this.physics.add.sprite(gameConfig.width*(50/100), 630, "heroSprite"); //Add a blank sprite as physic object. A sprite is needed to add an animation over
        this.hero.body.collideWorldBounds = true; //To collide with the window
        this.hero.body.setSize(20,30); //Collision box size (width, height)
        this.hero.setOrigin(5,5); //Set a fixed origin for the sprite

        this.hero.body.setOffset(6, 13); //Define sprite offset

        //Collision between the character and all the instances of ground
        this.grounds.forEach(ground => {
            this.physics.add.collider(this.hero, ground);
        });
    }

     
    //Animate the hero and make it go to the right to counterbalance ground movement going to the left
    moveHero() {
        this.hero.setVelocityX(200);
        this.hero.play("hero-move-right", true);
    }


    //------------ENEMIES----------------
    createEnemyGroup(){
        this.enemies = this.physics.add.group(); //Create a group for enemies
        this.physics.add.collider(this.enemies, this.grounds);
    }

    //Create an enemy
    spawnEnemy() {
        // Create a new off-screen enemy on the right
        const enemy = this.enemies.create(
            this.scale.width + 230, //Off-screen initial position
            this.hero.y,            //Same Y level as the hero
            "enemySprite"           //Enemy texture
        );  

        enemy.setVelocityX(-20); // The enemy moves to the left
        enemy.play("enemy-move-left", true); // Animation deplacement. Play the “enemy-move-left” animation for each enemy in the group
        enemy.setSize(20, 30); // Hitbox size if required
        //enemy.setOrigin(0.5, 0.5); // Center the sprite
        enemy.setOrigin(5, 5);
        enemy.body.setOffset(6, 13); //Define sprite offset


        //Collision between the character and all the instances of ground
        this.grounds.forEach(ground => {
            this.physics.add.collider(enemy, ground);
        });
    }

    //Create enemies at irregular intervals
    startEnemySpawner() {
        const minDelay = 1000; // Minimum delay (1 second)
        const maxDelay = 3000; // Maximum delay (3 seconds)
    
        //Create a repeated event to generate enemies
        this.time.addEvent({
            delay: Phaser.Math.Between(minDelay, maxDelay), // Random initial interval
            callback: () => {
                this.spawnEnemy(); // Generates an enemy
                //console.log("Ennemy created")
                this.startEnemySpawner(); // Relaunches a new irregular interval
            },
            loop: false, // Event is repeated manually (recurse)
        });
    }

    //Destroy enemy instance when out of the sceen on the left
    destroyOffscreenEnemies(){
        // Scroll through the enemies and destroy those that leave the screen
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.x < -50) { // If the enemy is off-screen on the left
                enemy.destroy(); // Eliminates the enemy
                console.log("Ennemy Destroyed !")
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
        // Creating animations
        //Frames for right
        this.anims.create({
            key: "hero-move-right",
            frames: this.anims.generateFrameNumbers("RunAnimation", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1,
        });

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