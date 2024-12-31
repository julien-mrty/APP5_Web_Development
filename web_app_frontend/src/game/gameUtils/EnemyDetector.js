import Phaser from "phaser";

export default class EnemyDetector {
    constructor(scene, detectionZoneConfig) {
        this.scene = scene;
        this.detectedEnemies = []; //List of detected enemies

        const { x, y, width, height, showHitbox } = detectionZoneConfig;

        //Creating attack animation detection zone
        this.detectionZone = this.scene.add.zone(x, y).setSize(width, height).setOrigin(0.5, 0.5);
        this.scene.physics.add.existing(this.detectionZone);
        this.detectionZone.body.setAllowGravity(false);
        this.detectionZone.body.setImmovable(true);

        //Show hitbox if requested
        if (showHitbox) {
            this.debugHitbox = this.scene.add.graphics();
            this.debugHitbox.lineStyle(2, 0x00ff00); //Green for detection zone
            this.debugHitbox.strokeRect(
                this.detectionZone.x - this.detectionZone.body.width / 2,
                this.detectionZone.y - this.detectionZone.body.height / 2,
                this.detectionZone.body.width,
                this.detectionZone.body.height
            );
        }

        //Overlap management between zone and enemies
        this.scene.physics.add.overlap(
            this.detectionZone,
            this.scene.enemies,
            (zone, enemyContainer) => {
                const enemy = enemyContainer.enemyInstance;
                if (enemy && !this.detectedEnemies.includes(enemy)) {
                    this.detectedEnemies.push(enemy); //Adds enemy to list
                    //console.log("Enemy entered detection zone.");
                }
            },
            null,
            this.scene
        );
    }

    
    //Updates detection zone position
    updateDetectionZone(x, y) {
        this.detectionZone.x = x;
        this.detectionZone.y = y;

        //Update debug hitbox if necessary
        if (this.debugHitbox) {
            this.debugHitbox.clear();
            this.debugHitbox.lineStyle(2, 0x00ff00); //Green for detection zone
            this.debugHitbox.strokeRect(
                this.detectionZone.x - this.detectionZone.body.width / 2,
                this.detectionZone.y - this.detectionZone.body.height / 2,
                this.detectionZone.body.width,
                this.detectionZone.body.height
            );
        }
    }

    
    //Check if an enemy can be attacked
    processEnemyDetection(hero) {
        if (hero.attackPoints > 0 && !hero.isAttacking) {
            const enemyToAttack = this.detectedEnemies.shift(); //Recovers the first enemy detected
            if (enemyToAttack) {
                this.triggerHeroAttackAnimation(hero, enemyToAttack); //Launch attack
            }
        }
    }

    
    //Triggers the hero's attack animation
    triggerHeroAttackAnimation(hero, enemy) {
        if (hero.attackPoints > 0 && !hero.isAttacking) { //Checks if the hero can attack
            //console.log("Enemy in range! Triggering attack animation.");
            hero.isAttacking = true;

            const attackAnimationKey = Phaser.Math.Between(0, 1) === 0 ? "hero-attack1" : "hero-attack2";
            hero.sprite.play(attackAnimationKey, true);

            hero.sprite.off("animationcomplete");
            hero.sprite.on("animationcomplete", (animation) => {
                if (animation.key === attackAnimationKey) {
                    hero.isAttacking = false;
                    hero.sprite.play("hero-move-right", true);
                    //console.log("Retour à l'animation de course.");
                    this.detectedEnemies = this.detectedEnemies.filter((e) => e !== enemy); // Removes enemy from list
                }
            });
        } else {
            //console.log("Héros ne peut pas attaquer !");
        }
    }

    //Removes off-screen or destroyed enemies
    removeOffscreenEnemies() {
        this.detectedEnemies = this.detectedEnemies.filter((enemy) => enemy && !enemy.isOutOfBounds());
    }
}
