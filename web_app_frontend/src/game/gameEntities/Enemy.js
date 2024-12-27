export default class Enemy {
    constructor(scene, x, y, sequence, grounds) {
        this.scene = scene;
        this.sequence = sequence;

        // Create enemy sprite
        this.sprite = this.scene.add.sprite(0, 0, "enemySprite");
        this.sprite.setSize(20, 30);
        this.sprite.setOrigin(0.5, 0.5);

        //Create sequence text for this enemy
        this.text = this.scene.add.text(0, -30, sequence, {
            font: "16px Arial",
            fill: "#ff0000",
        }).setOrigin(0.5);

        // Create a container and add the sprite and the text
        this.container = this.scene.add.container(x, y, [this.sprite, this.text]); //Create a container and add the sprite and the text in     
        this.container.sequence = sequence; //Attach sequence to the container for easy access later   

        this.container.enemyInstance = this; // Attach a reference to the instance

        this.scene.physics.world.enable(this.container); //Enable physics on the container
        this.container.body.setSize(30, 30); // Set the size of the hitbox
        this.container.body.setOffset(-7, -7); // Adjust the hitbox position.


    }

    //Animate the enemy and make it go to the left
    moveEnemyToLeft() {
        this.container.body.setVelocityX(-20); // Moving the container to the left
        this.sprite.play("enemy-move-left", true); // Play the animation for moving left
    }

    // Destroy container and its contents
    destroy() {
        this.container.destroy(); 
    }

    // Check if the enemy is out of bounds
    isOutOfBounds() {
        return this.container.x < -50; 
    }

    //Get the string sequence associated with the enemy
    getSequence() {
        return this.sequence;
    }
}