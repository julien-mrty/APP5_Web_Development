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
                Pour vaincre un ennemi, il suffit d’écrire la séquence de lettre se situant au-dessus de lui et d’appuyer 
                sur le bouton Entrée. Cela donnera à Blinky un point d’attaque lui permettant de brandir et d'abattre son épée.<br>
                Ces points sont représentés par le chiffre à côté du symbole de l’épée. Sans point d’attaque, Blinky ne peut attaquer
                et se retrouve sans défense face aux soldats de Sheeponia. <br>
                Attention, tout les 100 mètres, ces derniers deviennent plus difficile à occire<br>
                Alors écrivez la séquence le plus rapidement possible avant que l’ennemi ne vous touche ! <br><br>
                
                Blinky possède trois points de vie représentés par les cœurs. S’il se fait toucher trois fois, ce sera sa dernière mission… <br><br>

                Bon courage ! <br><br>

                (Pour mettre le jeu en pause, appuyez sur "Echap")
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


.lore-text {
    position: fixed; 
    right: 10px; 
    top: 40px; 
    width: 650px; 
    background-color: #1d7f2d; 
    color: white; 
    padding: 30px; 
    border-radius: 8px; 
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3); 
    font-size: 14px;
    line-height: 1.5;
    z-index: 1000; 
}


.tutorial-text {
    position: fixed; 
    right: 10px; 
    top: 300px; 
    width: 650px;
    background-color: green; 
    color: white;
    padding: 30px; 
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3); 
    font-size: 14px;
    line-height: 1.5;
    z-index: 1000; 
}


</style>
