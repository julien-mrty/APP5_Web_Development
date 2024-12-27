export default class Hero {
    constructor(scene, x, y) {
        this.scene = scene;

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

        // Initialize animations
        this.scene.anims.create({
            key: "hero-move-right",
            frames: this.scene.anims.generateFrameNumbers("RunAnimation", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1,
        });
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

    //Kill the hero
    die() {
        console.log("Hero is dead!");
        this.sprite.setTint(0xff0000); // Add a visual effect for death
        this.scene.physics.pause(); // Stop the game
        //Think to call a function to display a defeat screen
    }




    //Animate the hero and make it go to the right to counterbalance ground movement going to the left
    moveHeroToRight() {
        this.sprite.setVelocityX(200); // Move right
        this.sprite.play("hero-move-right", true); // Play animation
    }

    getSprite() {
        return this.sprite;
    }

}