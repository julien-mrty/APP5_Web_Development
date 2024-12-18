<template>
  <div class="play-page">
    <h1>Game Play Page</h1>
    <div class="buttons">
      <button @click="goToHome">Home</button>
      <button @click="logout" class="logout-button">Logout</button>
    </div>

    <hr />
    <h2>Play the Card Matching Game</h2>

    <div class="game-settings">
      <label for="card-count">Number of cards: </label>
      <select id="card-count" v-model="selectedCardCount">
        <option v-for="option in cardCountOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>

    <button class="start-button" @click="startNewGame">
      <template v-if="newPlayer">Start Game</template>
      <template v-else>Restart Game</template>
    </button>

    <!-- Affichage du score et des coups (caché si pas de partie en cours) -->
    <div class="game-info" v-if="!newPlayer && !gameEnded">
      <p>Score: {{ score }}</p>
      <p>Moves: {{ moves }}</p>
    </div>

    <!-- Plateau de jeu -->
    <section class="game-board" v-if="!gameEnded && !newPlayer">
      <div v-for="(card, index) in cards" :key="index" class="card" :class="{ 'is-flipped': card.visible }"
        @click="flipCard(index)">
        <div class="card-face is-front">
          <img class="card-image" :src="`/images/${card.value}.png`" :alt="card.value" />
          <img v-if="card.matched" src="/images/checkmark.svg" class="icon-checkmark" />
        </div>
        <div class="card-face is-back"></div>
      </div>
    </section>

    <h2 class="status">{{ statusMessage }}</h2>

    <!-- Récapitulatif fin de partie -->
    <div class="game-summary" v-if="gameEnded">
      <h3>Congratulations!</h3>
      <p>You found all matches.</p>
      <p>Final Score: {{ score }}</p>
      <p>Moves: {{ moves }}</p>
      <p>Number of Cards: {{ selectedCardCount }}</p>
      <button @click="startNewGame" class="start-button">Play Again</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "PlayGame",
  setup() {
    const router = useRouter();

    const goToHome = () => {
      router.push("/home");
    };

    const logout = () => {
      localStorage.removeItem("authToken");
      router.push("/");
    };

    // Protect the route by checking the token
    onMounted(() => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/");
      }
    });

    // ----- Images disponibles -----
    const allImages = [
      "ghost",
      "pumpkin",
      "bat",
      "candy",
      "spider",
      "skull",
      "cat",
      "witch",
      "moon",
      "broom",
      "frankenstein"
    ]; // 11 images

    // Options possibles pour le nombre de cartes (maximum 22)
    const cardCountOptions = [4, 8, 12, 16, 20, 24];
    const selectedCardCount = ref(4); // Valeur par défaut, 4 cartes

    const newPlayer = ref(true);
    const cards = ref([]);
    const flippedCards = ref([]);
    const statusMessage = ref("");
    const score = ref(0);
    const moves = ref(0);

    const gameEnded = ref(false);

    // Ajout d'un GameID par défaut, adapté à votre logique de jeu (ex: 1)
    const gameId = 1;

    const startNewGame = () => {
      newPlayer.value = false;
      gameEnded.value = false;
      statusMessage.value = "Find all matches!";
      score.value = 0;
      moves.value = 0;
      initializeGame(selectedCardCount.value);
    };

    const initializeGame = (count) => {
      const pairsNeeded = count / 2;
      const chosenImages = allImages.slice(0, pairsNeeded);
      let tempCards = chosenImages.concat(chosenImages);
      tempCards = tempCards.sort(() => Math.random() - 0.5);

      cards.value = tempCards.map((value, position) => {
        return {
          value,
          position,
          visible: false,
          matched: false
        };
      });
      flippedCards.value = [];
    };

    const flipCard = (index) => {
      if (gameEnded.value) return;
      const card = cards.value[index];
      if (card.matched || card.visible) return;
      if (flippedCards.value.length === 2) return;

      card.visible = true;
      flippedCards.value.push(index);

      if (flippedCards.value.length === 2) {
        moves.value += 1;
        checkForMatch();
      }
    };

    const checkForMatch = () => {
      const [firstIndex, secondIndex] = flippedCards.value;
      const firstCard = cards.value[firstIndex];
      const secondCard = cards.value[secondIndex];

      if (firstCard.value === secondCard.value) {
        firstCard.matched = true;
        secondCard.matched = true;
        flippedCards.value = [];
        score.value += 20;

        if (cards.value.every(c => c.matched)) {
          // Toutes les cartes trouvées
          statusMessage.value = "";
          gameEnded.value = true;
          saveFinalScore(); // Appeler la fonction pour enregistrer le score en BDD
        }
      } else {
        score.value -= 5;
        setTimeout(() => {
          firstCard.visible = false;
          secondCard.visible = false;
          flippedCards.value = [];
        }, 1000);
      }
    };

    const saveFinalScore = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const apiUrl = import.meta.env.VITE_APP_API_URL;
      const scoreData = {
        GameID: gameId,
        Points: score.value
      };

      try {
        const response = await fetch(`${apiUrl}/api/scores`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(scoreData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to save final score:", errorData);
        } else {
          console.log("Final score saved successfully");
        }
      } catch (error) {
        console.error("Error saving final score:", error);
      }
    };

    return {
      goToHome,
      logout,
      newPlayer,
      cards,
      statusMessage,
      score,
      moves,
      startNewGame,
      flipCard,
      selectedCardCount,
      cardCountOptions,
      gameEnded
    };
  },
};
</script>

<style scoped>
.play-page {
  text-align: center;
  margin-top: 50px;
}

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

.start-button {
  background-color: #e78805;
  color: white;
  padding: 8px 16px 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 1rem;
  border: 2px solid #e78805;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s all ease-in;
}

.start-button:hover {
  background-color: transparent;
  color: #e78805;
}

.game-settings {
  margin: 20px;
}

.game-info {
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
  margin: 20px auto;
  max-width: 500px;
}

.card {
  width: 100px;
  height: 140px;
  position: relative;
  transition: 0.5s transform ease-in;
  transform-style: preserve-3d;
  cursor: pointer;
  margin: 0 auto;
}

.card.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
}

.card-face.is-front {
  background-image: url("/images/card-bg.png");
  transform: rotateY(180deg);
  position: absolute;
}

.card-face.is-back {
  background-image: url("/images/card-bg-empty.png");
  position: absolute;
}

.card-image {
  max-width: 80%;
}

.icon-checkmark {
  position: absolute;
  right: 5px;
  bottom: 5px;
}

.status {
  font-size: 1.2rem;
  margin: 20px 0;
}

.game-summary {
  margin-top: 30px;
  font-size: 1.2rem;
}

.game-summary h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.game-summary p {
  margin: 5px 0;
}
</style>
