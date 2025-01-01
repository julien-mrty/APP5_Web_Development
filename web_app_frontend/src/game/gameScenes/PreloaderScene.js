import Phaser from "phaser";

//Character animations
import HeroRunAnimation from "/src/gameAssets/gameSprites/HeroRun.png"
import HeroRunAttackAnimation1 from "/src/gameAssets/gameSprites/RunAttack1.png"
import HeroRunAttackAnimation2 from "/src/gameAssets/gameSprites/RunAttack2.png"
import EnemyRunAttackAnimation from "/src/gameAssets/gameSprites/EnemyRunAttack2.png"

//Environment
import GroundSprite from "/src/gameAssets/gameBackgrounds/ground.png"
import GroundDecoration from "/src/gameAssets/gameBackgrounds/groundDecoration.png"
import Tree0 from "/src/gameAssets/gameBackgrounds/0tree.png"
import Tree1 from "/src/gameAssets/gameBackgrounds/1tree.png"
import Light2 from "/src/gameAssets/gameBackgrounds/2light.png"
import Tree3 from "/src/gameAssets/gameBackgrounds/3tree.png"
import Tree4 from "/src/gameAssets/gameBackgrounds/4tree.png"
import Light5 from "/src/gameAssets/gameBackgrounds/5light.png"
import Tree6 from "/src/gameAssets/gameBackgrounds/6tree.png"
import Tree7 from "/src/gameAssets/gameBackgrounds/7tree.png"
import Fog from "/src/gameAssets/gameBackgrounds/Fog.png"

//User Interface sprites
import Heart from "/src/gameAssets/gameSprites/heart.png"
import Sword from "/src/gameAssets/gameSprites/sword.png"

//Music
import MainMenuMusic from "/src/gameAssets/gameSounds/mainMenuMusic.mp3"
import RunningGameMusic from "/src/gameAssets/gameSounds/runningGameMusic.mp3"
import GameOverMusic from "/src/gameAssets/gameSounds/gameOverMusic.mp3";

//Sound
import AttackSound from "/src/gameAssets/gameSounds/sword.mp3"


class PreloaderScene extends Phaser.Scene {
    constructor() {
        super("PreloaderScene");
    }

    preload() {
        const assets = {
            groundSprite: GroundSprite, //Load a texture that will be named “groundSprite”. Use the same name in MainScence.js to access it
            Fog: Fog, // Load a texture named "Fog"...
            tree0: Tree0,
            tree1: Tree1,
            light2: Light2,
            tree3: Tree3,
            tree4: Tree4,
            light3: Light5,
            tree6: Tree6,
            tree7: Tree7,
            groundDecoration: GroundDecoration,
        };
    
        // Load all images dynamically
        for (const [key, path] of Object.entries(assets)) {
            this.load.image(key, path);
        }

        this.load.image('heartSprite', Heart); //Load the sprite for the heart
        this.load.image('swordSprite', Sword); 

        // Load a spritesheet with multiple frames
        this.load.spritesheet('RunAnimation', HeroRunAnimation, {
            frameWidth: 42, //width of a single frame in the spridesheet 
            frameHeight: 42 //height of a single frame in the spridesheet
        });//Player sprite

        
        this.load.spritesheet('HeroRunAttackAnimation1', HeroRunAttackAnimation1, {
            frameWidth: 42,
            frameHeight: 42,
        });
        this.load.spritesheet('HeroRunAttackAnimation2', HeroRunAttackAnimation2, {
            frameWidth: 42,
            frameHeight: 42,
        });

        this.load.spritesheet('EnemyRunAttackAnimation', EnemyRunAttackAnimation, {
            frameWidth: 42,
            frameHeight: 42 
        });

        this.load.audio('attackSound', AttackSound); //Load the sound attack sound
        this.load.audio('mainMenuMusic', MainMenuMusic); //Load the music of the menu
        this.load.audio('runningGameMusic', RunningGameMusic); //Load the music of the game
        this.load.audio('gameOverMusic', GameOverMusic); //Load the music of the game over

    }

    create() {
        // Initialize animations
        if (!this.anims.exists('hero-move-right')) {
            this.anims.create({
                key: "hero-move-right",
                frames: this.anims.generateFrameNumbers("RunAnimation", { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1,
            });
        }

        //Load an animation for the attack
        this.anims.create({
            key: "hero-attack1",
            frames: this.anims.generateFrameNumbers("HeroRunAttackAnimation1", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0 // Animation must not loop
        });

        this.anims.create({
            key: "hero-attack2",
            frames: this.anims.generateFrameNumbers("HeroRunAttackAnimation2", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0 
        });

        if (!this.anims.exists('enemy-move-left')) {
            this.anims.create({
                key: "enemy-move-left",
                frames: this.anims.generateFrameNumbers("EnemyRunAttackAnimation", { start: 0, end: 4 }),
                frameRate: 10,
                repeat: -1,
            });
        }

        this.scene.start("MainMenuScene");
    }
}

export default PreloaderScene;