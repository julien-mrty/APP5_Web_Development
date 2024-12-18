import Phaser from "phaser";

import gameConfig from './../gameConfig//gameConfig.js'; // Assurez-vous que le chemin est correct
import UserInputHandler from "./UserInputHandler";


class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.decorations = []; // To store decorative sprites
        this.randomSequence = ""; // Stores the generated sequence
        this.playerInput = ""; // Stores player input
        this.minSequence = 3; // Minimum sequence length
        this.maxSequence = 7; // Maximum sequence length
    }

    preload() {
        // Les assets seront déjà chargés par PreloaderScene
    }

    create() {
        this.createEnvironment();
        this.createPlayer();


        //this.createEnemy();
        
        this.enemies = this.physics.add.group(); //Create a group for enemies
        this.physics.add.collider(this.enemies, this.grounds);
        
        this.startEnemySpawner(); // Start generating enemies

        this.createControls();
        this.createAnimations();

        // Initialiser la gestion de la saisie utilisateur
        this.userInputHandler = new UserInputHandler(this); // Passer la scène actuelle au gestionnaire
        this.userInputHandler.init();

        //this.createSequenceDisplay();
        //this.input.keyboard.on("keydown", this.handleSequenceInput, this);
        
        //this.setHitBoxes();
    }



    update() {
        this.floorPlacement();
        this.hero.setVelocityX(0)

        this.handlePlayerInput();
        //this.handleSequenceInput();
        this.moveEnvironment();

        //Can't display hitboxes of different entities at the same time
        //this.floorHitbox();
        //this.heroHitbox();
        //this.enemyHitbox();
        this.destroyEnemies();
        
    }



    


//------------PLAYER----------------
    createPlayer() {
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

    

//------------ENVIRONMENT----------------
    /*moveEnvironment() {
        const decorationSpeed = -40; // Vitesse de déplacement des décorations
        this.decorations.forEach((decoration, index) => {
            // Déplacer chaque décoration vers la gauche
            decoration.x += decorationSpeed * (1 / 60); // Basé sur 60 FPS
            
            // Si l'image sort de l'écran à gauche
            if (decoration.x + decoration.displayWidth <= 0) {
                const nextIndex = (index + this.decorations.length - 1) % this.decorations.length;
                const nextDecoration = this.decorations[nextIndex];
    
                // Repositionner à la fin, juste après l'image suivante
                decoration.x = nextDecoration.x + nextDecoration.displayWidth;
            }
        });
    }*/

        moveEnvironment() {
            const decorationSpeed = -40; // Vitesse de déplacement des décorations
        
            this.decorations.forEach((decoration, index) => {
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

    floorPlacement() {
        // Reset floor pieces that leave the screen
        const groundWidth = 700; // Largeur d'un morceau de sol
        this.grounds.forEach(ground => {
            if (ground.x + groundWidth / 2 < 0) {
            // Repositionnez ce morceau à la fin
            ground.x += groundWidth * this.grounds.length;
            }
        });
   }

    createEnvironment() {

        //---------------FOG----------------
        //Load fog image to cover entire screen
        this.fog = this.add.image(0, 0, "Fog"); // Ajoutez l'image à la position (0,0)
        this.fog.setOrigin(0, 0); // Origine en haut à gauche
        this.fog.setDisplaySize(this.scale.width, this.scale.height); // Redimensionne pour couvrir l'écran


        //--------------GROUND--------------
        this.grounds = []; //Table for storing all ground instances
        const groundWidth = 700; // Largeur du sol (correspond à votre image)
        const screenWidth = this.scale.width; // Screen width

        // Calculate how many floor tiles are needed to cover the screen
        const numTiles = Math.ceil(screenWidth / groundWidth) + 1;

        for (let i = 0; i < numTiles; i++) {
            const ground = this.physics.add.sprite(i * groundWidth, 500, "groundSprite");
            ground.body.setImmovable(true); // The floor remains fixed (does not move under other forces)
            ground.body.allowGravity = false; //Disable gravity
            ground.body.setVelocityX(-200); //Scroll left
            this.grounds.push(ground); // Ajouter au tableau
        }


        /*// === TREE 1 ===
        const decorationWidth = 200; // Ajustez à la largeur réelle de l'image
        const numDecorations = Math.ceil(screenWidth / decorationWidth) + 3; // Ajouter quelques duplicatas pour la continuité

        this.decorations = [];
        for (let i = 0; i < numDecorations; i++) {
            const decoration = this.add.sprite(i * decorationWidth, 534, "tree1");
            decoration.setOrigin(0, 1); // Bas gauche
            this.decorations.push(decoration);
        }*/

             // === DECORATIONS (TREE1) ===
    const decorationWidth = 200; // Ajustez à la largeur réelle de "tree1"
    const numDecorations = Math.ceil(this.scale.width / decorationWidth) + 2;

    this.decorations = [];
    for (let i = 0; i < numDecorations; i++) {
        const decoration = this.add.sprite(i * decorationWidth, 534, "tree1");
        decoration.setOrigin(0, 1); // Bas gauche pour aligner correctement
        this.decorations.push(decoration);
    }

    }


     
    createControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }





    createEnemy() {
        // Positionner l'ennemi à l'extérieur de l'écran (à droite) et au même niveau que le héros
        const startX = this.scale.width /*+ 230*/; // Hors écran à droite
        const startY = this.hero.y; // Même niveau en y que le héros

        this.enemy = this.physics.add.sprite(startX, startY, "enemySprite"); //Add sprite as physic object. 
        this.enemy.body.setSize(30,30); //Collision box size (width, height)
        this.enemy.setOrigin(0.5,0.5);
        //this.enemy.setOrigin(5,5); //Set a fixed origin for the sprite
        this.enemy.body.setOffset(6, 13); //Define sprite offset

        //Enemy movements
        this.enemy.setVelocityX(-20);

        //Collision between the character and all the instances of ground
        this.grounds.forEach(ground => {
            this.physics.add.collider(this.enemy, ground);
        });
    }

    spawnEnemy() {
        // Créer un nouvel ennemi hors écran à droite
        const enemy = this.enemies.create(
            this.scale.width + 230, // Position initiale hors écran
            this.hero.y,          // Même niveau Y que le héros
            "enemySprite"         // Texture de l'ennemi
        );
    
       // if (enemy) {
            enemy.setVelocityX(-20); // L'ennemi se déplace vers la gauche
            enemy.play("enemy-move-left", true); // Animation de déplacement
            enemy.setSize(20, 30); // Taille de la hitbox si nécessaire
            //enemy.setOrigin(0.5, 0.5); // Centrer le sprite
            enemy.setOrigin(5, 5);
            enemy.body.setOffset(6, 13); //Define sprite offset
            
       // }

        //Collision between the character and all the instances of ground
        this.grounds.forEach(ground => {
            this.physics.add.collider(enemy, ground);
        });
    }

    startEnemySpawner() {
        const minDelay = 1000; // Délai minimum (1 seconde)
        const maxDelay = 3000; // Délai maximum (3 secondes)
    
        // Créer un événement répété pour générer des ennemis
        this.time.addEvent({
            delay: Phaser.Math.Between(minDelay, maxDelay), // Intervalle initial aléatoire
            callback: () => {
                this.spawnEnemy(); // Génère un ennemi
                //console.log("Ennemi créé")
                this.startEnemySpawner(); // Relance un nouvel intervalle irrégulier
            },
            loop: false, // L'événement se répète manuellement (recurse)
        });
    }


    
  

    

    createAnimations() {
        // Creating animations
           //Frames for right
        this.anims.create({
            key: "hero-move-right",
            frames: this.anims.generateFrameNumbers("RunAnimation", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1,
        });

        //Frames for up
        this.anims.create({
            key: "hero-move-up",
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
        /*
        this.anims.create({
            key: "move-left",
            //Play in loop frames from sheet with index 0 to 5
            frames: this.anims.generateFrameNumbers("RunAnimationLeft", { start: 0, end: 5}), // Frames for “left
            frameRate: 10, // 10 frames per second
            repeat: -1 // Repeat indefinitely
        }); 
     

        //Frames for down
        this.anims.create({
            key: "move-down",
            frames: this.anims.generateFrameNumbers("RunAnimation", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1,
        });*/
    }

   

    handlePlayerInput() {

        // Jouer l'animation "enemy-move-left" pour chaque ennemi dans le groupe
        this.enemies.getChildren().forEach(enemy => {
            enemy.play("enemy-move-left", true); // Appliquer l'animation à chaque ennemi
        });

        /*this.enemy.setVelocityX(300);*/
        //this.enemy.play("enemy-move-left", true);
        // Réinitialiser les vitesses
       // this.hero.setVelocity(0);
    
     /*   // Déplacement à gauche
        if (this.cursors.left.isDown) {
            this.hero.setVelocityX(-200);
            this.hero.play("move-left", true);
        }*/
        // Déplacement à droite
      //   if (this.cursors.right.isDown) {
            this.hero.setVelocityX(200);
            this.hero.play("hero-move-right", true);
     //   }
    
      /*  // Déplacement vers le haut
        if (this.cursors.up.isDown) {
            this.hero.setVelocityY(-200);
            this.hero.play("hero-move-up", true);
        }
        // Déplacement vers le bas
        else if (this.cursors.down.isDown) {
            this.hero.setVelocityY(200);
            this.hero.play("move-down", true);
        }
    
        // Si le joueur ne bouge pas, jouer l'animation Idle
        if (!this.cursors.left.isDown && !this.cursors.right.isDown && 
            !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.hero.play("not-moving", true);
        }*/
    }





    
    destroyEnemies(){
        // Parcourir les ennemis et détruire ceux qui sortent de l'écran
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.x < -50) { // Si l'ennemi est hors écran à gauche
                enemy.destroy(); // Supprime l'ennemi
                console.log("Destroyed !")
            }
        });
    }




    

    setHitBoxes() {
        this.hitboxDebug = this.add.graphics();
        this.hitboxDebug.lineStyle(2, 0xff0000); // Set a 2px red border
    }

   floorHitbox() {
       // View the floor hitbox
       this.hitboxDebug.clear(); //Delete old rectangle
       this.hitboxDebug.lineStyle(2, 0xff0000); // Rouge, 2px d'épaisseur
       this.grounds.forEach(ground => {
           const { x, y, width, height } = ground.body; // Repositionner le sol lorsqu'il sort de l'écran
           //Draw a rectangle around the hitbox
           this.hitboxDebug.strokeRect(x, y, width, height);
       });
   }

    heroHitbox() {
        this.hitboxDebug.clear(); //Delete old rectangle
        const { x, y, width, height } = this.hero.body;
        //Draw a rectangle around the hitbox
        this.hitboxDebug.strokeRect(x, y, width, height);
    }

    enemyHitbox() {
        this.hitboxDebug.clear(); // Efface les anciens rectangles
        this.hitboxDebug.lineStyle(2, 0xff0000); // Rouge, 2px d'épaisseur
    
        // Parcourir chaque ennemi dans le groupe
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.body) { // Vérifie que le body existe pour éviter les erreurs
                const { x, y, width, height } = enemy.body; // Récupérer les dimensions du body
                this.hitboxDebug.strokeRect(
                    x-5, // Décaler pour centrer la hitbox
                    y,
                    width,
                    height
                );
            }
        });
    }

























/*
    //Generate a random sequence of three letters.
    generateRandomSequence() {
        //Set of valid characters
       // const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀ-ÖØ-Ýà-öø-ý0123456789&\"'()-_ç@)=/*?\\!§";
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzà-ö0123456789&\"'()-_ç@)=/*?\\!§";

        // Determine a random length between minSequence and maxSequence
        const sequenceLength = Math.floor(Math.random() * (this.maxSequence - this.minSequence + 1)) + this.minSequence;

        let sequence = "";
        for (let i = 0; i < sequenceLength; i++) {
            sequence += letters[Math.floor(Math.random() * letters.length)];
        }
        return sequence;
    }
  
    handleSequenceInput(event) {
        const key = event.key;
          
        // If the key is “Backspace”, delete the last character of playerInput
        if (key === "Backspace") {
            if (this.playerInput.length > 0) {
                this.playerInput = this.playerInput.slice(0, -1); // Deletes the last character
                console.log("Entrée actuelle après suppression :", this.playerInput);
                this.playerInputText.setText(this.playerInput); // Update display
            }
            return; // Ne pas continuer avec le reste de la méthode
        }

        // Si la touche est "Enter", valider la séquence
        if (key === "Enter") {
            if (this.playerInput.length >= this.minSequence && this.playerInput.length <= this.maxSequence) { // Vérifier uniquement si l'utilisateur a bien 3 caractères
                this.checkPlayerInput(); // Appel à la fonction pour vérifier la saisie
            } 
            else {
                console.log("Erreur : La saisie doit contenir entre " + this.minSequence + " et " + this.maxSequence + " caractères.");
                this.passToNextSequence(); // Go directly to the next sequence
            }
            return;
        }


        // Expression régulière pour autoriser :
        // - Lettres majuscules et minuscules (A-Z, a-z)
        // - Lettres accentuées majuscules et minuscules (À-Ö, à-ö, Ø-Ý, ø-ý)
        // - Chiffres (0-9)
        // - Caractères spéciaux (&, ", ', (, -, _, ç, @, ), =, /, *, ?, \, !, §)
        const validKeyPattern = /^[A-Za-zÀ-ÖØ-Ýà-öø-ý0-9&"'\(\)_ç@)=/\*?\\!§-]$/;
    
        if (validKeyPattern.test(key)) {
            if (this.playerInput.length < this.maxSequence) { // Limit entry to 7 characters
                this.playerInput += key;
                this.playerInputText.setText(this.playerInput);
            }
        }
       
    }

    //Check the player inputs
    checkPlayerInput() {
        if (this.playerInput === this.randomSequence) {
            console.log("Bien joué !");
            this.passToNextSequence(); // Resets the sequence for a new
        } else {
            console.log("Erreur : La saisie est incorrecte.");
            this.passToNextSequence(); // Move on to the next sequence
        }
    }

    passToNextSequence() {
        this.playerInput = ""; // Réinitialise l'entrée du joueur
        this.randomSequence = this.generateRandomSequence(); // Génère une nouvelle séquence
        this.sequenceText.setText(this.randomSequence); // Met à jour le texte à l'écran
        this.playerInputText.setText(this.playerInput); // Réinitialise l'affichage de l'entrée utilisateur
    }

    
    //Display the sequence of letters created
    createSequenceDisplay() {
        this.randomSequence = this.generateRandomSequence(); // Générer une séquence aléatoire
        this.sequenceText = this.add.text(
            gameConfig.width / 2, 
            50, 
            this.randomSequence, 
            { font: "32px Arial", fill: "#ffffff" }
        ).setOrigin(0.5, 0.5);

        // Ajouter un texte pour l'entrée du joueur
        this.playerInputText = this.add.text(
            gameConfig.width / 2, 
            100, 
            this.playerInput, // Initialement vide
            { font: "32px Arial", fill: "#ff0000" } // Texte en rouge
        ).setOrigin(0.5, 0.5);
    }

*/
}

export default MainScene;