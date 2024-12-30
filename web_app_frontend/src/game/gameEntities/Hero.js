export default class Hero {
    constructor(scene, x, y) {
        this.scene = scene;
        this.heroVelocity = 200;

        //Graphic appearance
        this.sprite = scene.physics.add.sprite(x, y, "heroSprite"); // Create the hero sprite. //Add a blank sprite as physic object. A sprite is needed to add an animation over
        this.sprite.body.collideWorldBounds = true; //To collide with the window
        this.sprite.body.setSize(20, 30); //Collision box size (width, height)
        this.sprite.setOrigin(5, 5); //Set a fixed origin for the sprite
        this.sprite.body.setOffset(6, 13); //Define sprite offset

        //Lives
        this.lives = 3; // Add life points
        this.attackPoints = 0;
        this.isInvulnerable = false; // To avoid losing several lives quickly when colliding with ennemies

    }

    //Increases attack points
    addAttackPoint() {
        this.attackPoints += 1;
        console.log(`Points d'attaque : ${this.attackPoints}`);
        this.scene.updateAttackPointsDisplay(); // Met à jour l'affichage des points
    }

    //Use an attack point to kill   an enemy
    useAttackPoint() {
        if (this.attackPoints > 0) {
            this.attackPoints -= 1;
            console.log(`Points d'attaque restants : ${this.attackPoints}`);
            this.scene.updateAttackPointsDisplay(); // Updates points display
            return true; // Indicates that a point has been used
        }
        return false; //No points available
    }

    //Removes one hit point from the player if he's not in a state of invulnerability
    takeDamage() {
        if (!this.isInvulnerable) { //If not invulnerable
            this.lives -= 1;
            console.log(`Hero hit! Remaining lives: ${this.lives}`);

            //Update hearts display
            this.scene.updateLivesDisplay();

            //Activate temporary invulnerability
            this.isInvulnerable = true;
            this.scene.time.addEvent({
                delay: 1000, // 1 second of invulnerability
                callback: () => {
                    this.isInvulnerable = false;
                },
                loop: false
            });

            if (this.lives <= 0) {
                this.die();
            }
        }
    }


    //Animate the hero and make it go to the right to counterbalance ground movement going to the left
    moveHeroToRight() {
        if (this.scene.isGameOver) {
            this.heroVelocity = 0
            return; // Do not update decorations if the game is over
        }

      

        this.sprite.setVelocityX(this.heroVelocity); // Move right
        this.sprite.play("hero-move-right", true); // Play animation
    }

    //Kill the hero
    die() {
        this.scene.isGameOver = true; // Indiquer que le jeu est terminé
        console.log("Hero is dead!");
        this.sprite.setTint(0xff0000); // Add a visual effect for death
        
        this.scene.scene.start('GameOverScene', { score: this.scene.score }); // Call the GameOver scene
        this.scene.scene.pause(); // Pause la scène actuelle

        //Think to call a function to display a defeat screen
    }

    //Stops all game processes when the player dies
    /*endGame(){
        const newEnemySpeed = -200; //change current enemies speed to give the illusion that they're running fast
        this.scene.changeEnemySpeed(newEnemySpeed);

        // Stop the hero's movement
        this.sprite.setVelocity(0); // Set speed to 0
        this.sprite.body.allowGravity = false; // Deactivate gravity to keep it stationary

        // Disable enemy overlay 
        this.scene.physics.world.removeCollider(this.scene.heroEnemyCollider);


        // Stop floors
        this.scene.grounds.forEach(ground => {
            if (ground.body) {
                ground.body.setVelocityX(0); // Stop physical movement
            } 
        });

        // Stop decorating
        this.scene.decorations.forEach(decoration => {
            decoration.x = decoration.x; //Freezes the current position of the decorations
        });

        //Stop score update
        this.scene.updateScore = () => {}; //Replace the method so that it does nothing

    
        // Continue with hero animation only. Replace with death animation
        //this.sprite.play("hero-move-right", true);

        //Displays the final score
        const { width, height } = this.scene.scale;
        this.scene.add.text(width / 2, height / 2, `Game Over\nScore: ${Math.floor(this.scene.score)} m`, {
            font: "32px Arial",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
    }*/



    getSprite() {
        return this.sprite;
    }

}