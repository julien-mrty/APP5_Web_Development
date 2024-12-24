export default class Hero {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, "heroSprite"); // Create the hero sprite. //Add a blank sprite as physic object. A sprite is needed to add an animation over
        this.sprite.body.collideWorldBounds = true; //To collide with the window
        this.sprite.body.setSize(20, 30); //Collision box size (width, height)
        this.sprite.setOrigin(5, 5); //Set a fixed origin for the sprite
        this.sprite.body.setOffset(6, 13); //Define sprite offset

        // Initialize animations
        this.scene.anims.create({
            key: "hero-move-right",
            frames: this.scene.anims.generateFrameNumbers("RunAnimation", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1,
        });
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