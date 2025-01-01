import Phaser from "phaser";

class MusicScene extends Phaser.Scene {
    constructor() {
        super("MusicScene");
        this.currentMusic = null;
    }

    playMusic(key, options = {}) {
        if (this.currentMusic) {
            if (this.currentMusic.key === key) {
                //If music is already running, do nothing
                return;
            }
            this.stopMusic(); //Turn off current music if it's different
        }

        //Plays new music
        this.currentMusic = this.sound.add(key, {
            volume: options.volume || 0.5,
            loop: options.loop !== undefined ? options.loop : true,
        });
        this.currentMusic.key = key; //Associates key with sound for future verification
        this.currentMusic.play();
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic.destroy();
            this.currentMusic = null;
        }
    }

    isPlaying(key) {
        return this.currentMusic && this.currentMusic.key === key && this.currentMusic.isPlaying;
    }
}

export default MusicScene;
