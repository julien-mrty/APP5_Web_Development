<template>
    <div class="game_page">
        <!-- Phaser game container -->
        <div id="phaser"></div>

        <!-- Buttons for Home and Logout -->
        <div class="buttons">
            <button @click="goToHome">Home</button>
            <button @click="logout" class="logout-button">Logout</button>
        </div>

        <!-- Side text container -->
        <div class="lore-text">
            <p>
                La forêt est envahie ! <br> <br> 
                Après des années à croupir dans l’ombre, l’empire de Sheeponia est de retour.<br>
                Afin de protéger son peuple de cette menace imminente, le courageux Blinky est missionné par son peuple
                pour partir en éclaireur et prévenir les royaumes aux alentours du drame se profilant à l’horizon. <br>
                Mais Sheeponia a été prévoyant et envoie déjà ses soldats à sa rencontre pour l’empêcher de mener à bien
                sa mission. <br>
                Mais Blinky n’est pas tout seul ! Armé de sa fidèle S-word, il peut vaincre n’importe qui ! <br>
            </p>
        </div>
         <!-- Side text container -->
         <div class="tutorial-text">
            <p>
                Tutoriel : <br> <br> 
                Pour vaincre un ennemi, il suffit d’écrire la séquence de lettre se situant au-dessus de sa tête et d’appuyer 
                sur le bouton Entrée. Cela donnera à Blinky un point d’attaque lui permettant de brandir et d'abattre son épée.<br>
                Ces points sont représentés par le chiffre à côté du symbole de l’épée. Sans point d’attaque, Blinky ne peut attaquer
                 et se retrouve sans défense face aux soldats de Sheeponia. <br> <br>
                Écrivez la séquence le plus rapidement possible avant que l’ennemi ne vous touche ! <br>
                Blinky possède trois points de vie représentés par les cœurs. <br>
                S’il se fait toucher plus de trois fois, ce sera sa dernière mission… <br><br>

                Bon courage ! <br><br>

                (Pour mettre le jeu en pause en appuyez sur "Echap")
            </p>
        </div>
    </div>
</template>

<script>
import { startGame, destroyGame } from "../game/game.js";
import { useRouter } from "vue-router";

export default {
    setup() {
        const router = useRouter();

        // Navigate back to home
        const goToHome = () => {
            router.push("/home");
        };

        // Logout by removing the token
        const logout = () => {
            localStorage.removeItem("authToken");
            router.push("/");
        };

        return {
            goToHome,
            logout,
        };
    },
    mounted() {
        // Start the Phaser game
        this.gameInstance = startGame();
    },
    beforeUnmount() {
        // Destroy the Phaser instance
        destroyGame();
        console.log("Game instance destroyed");
    },
};
</script>

<style scoped>
.game_page {
    
    margin-top: 50px;
    position: relative;
}

/* Styling for the buttons */
.buttons {
    margin-top: 20px;
}

button {
    padding: 10px 20px;
    margin: 10px;
    font-size: 18px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
}

button:hover {
    background-color: #0056b3;
}

.logout-button {
    background-color: #dc3545;
    color: #fff;
}

.logout-button:hover {
    background-color: #c82333;
}

/* Side text styling */
.lore-text {
    position: fixed; /* Makes the text independent of other elements */
    right: 10px; /* Adjust the position from the right */
    top: 80px; /* Adjust the position from the top */
    width: 650px; /* Set a fixed width for the text block */
    background-color: green; /* Background color */
    color: white; /* Text color */
    padding: 30px; /* Padding for better readability */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3); /* Adds a subtle shadow */
    font-size: 14px;
    line-height: 1.5;
    z-index: 1000; /* Ensures it appears on top */
}

/* Side text styling */
.tutorial-text {
    position: fixed; /* Makes the text independent of other elements */
    right: 10px; /* Adjust the position from the right */
    top: 340px; /* Adjust the position from the top */
    width: 650px; /* Set a fixed width for the text block */
    background-color: green; /* Background color */
    color: white; /* Text color */
    padding: 30px; /* Padding for better readability */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3); /* Adds a subtle shadow */
    font-size: 14px;
    line-height: 1.5;
    z-index: 1000; /* Ensures it appears on top */
}


</style>
