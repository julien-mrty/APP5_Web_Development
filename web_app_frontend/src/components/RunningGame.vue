<template>
    <div class="game_page">
        <h1>You're in the game page</h1>
        <div id="phaser">  </div>
    </div>
</template>


<script>
import { startGame, destroyGame } from "../game/game.js";

export default {
    mounted() {
        //Starting the game
        this.gameInstance = startGame()
        console.log("Game Started", this.gameInstance); // Check that the game has been imported
    },
    beforeUnmount() {
        // Destroys the Phaser instance
        destroyGame();
        console.log("Game instance destroyed");
    },
};

</script>



<style>

</style>