/* global Phaser */

const gameConfig = {
    width: 700,
    height: 500,
    type: Phaser.AUTO,
    parent: "phaser",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 450},
            debug: false,
        },
    },
};

export default gameConfig;