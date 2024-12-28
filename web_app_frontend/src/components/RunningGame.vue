<template>

    <div class="game_page">
        <h1>You're in the game page</h1>
        <div id="phaser">  </div>
    </div>

    
    
</template>


<script>
import startGame from "../game/game.js";

export default {
    mounted() {
        startGame()
        //console.log(game); // Vérifiez si le jeu est bien importé
    },
};

</script>



<style>

</style>