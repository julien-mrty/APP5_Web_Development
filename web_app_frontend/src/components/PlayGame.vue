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

    <!-- Display score and moves only if the game is running -->
    <div class="game-info" v-if="!newPlayer && !gameEnded">
      <p>Score: {{ score }}</p>
      <p>Moves: {{ moves }}</p>
    </div>

    <!-- Game board -->
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

    <!-- End of game summary -->
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

    // Navigate back to home
    const goToHome = () => {
      router.push("/home");
    };

    // Logout by removing the token
    const logout = () => {
      localStorage.removeItem("authToken");
      router.push("/");
    };

    // Protect the route by checking the token
    onMounted(() => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/");
      } else {
        decodeTokenForUserID(token);
      }
    });

    // Decode the token to extract user_id
    const userId = ref(null);
    const decodeTokenForUserID = (token) => {
      try {
        const payloadBase64Url = token.split(".")[1];
        const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(atob(payloadBase64));
        if (decodedPayload && decodedPayload.userID) {
          userId.value = decodedPayload.userID; // userID should be set in the token
        } else if (decodedPayload && decodedPayload.id) {
          // If the token uses 'id' instead of 'userID'
          userId.value = decodedPayload.id;
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        router.push("/");
      }
    };

    // All available images
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


    // Possible card counts
    const cardCountOptions = [4, 8, 12, 16, 20, 24];
    const selectedCardCount = ref(4); // Default: 4 cards


    const newPlayer = ref(true);
    const cards = ref([]);
    const flippedCards = ref([]);
    const statusMessage = ref("");
    const score = ref(0);
    const moves = ref(0);
    const gameEnded = ref(false);

    // We want the gameId to change each new game. Let's increment it each time.
    // Start from 0 and increment each time startNewGame() is called.
    const gameId = ref(0);

    // Start a new game, increment the gameId, reset status
    const startNewGame = () => {
      gameId.value += 1; // Increment game ID each time we start a new game
      newPlayer.value = false;
      gameEnded.value = false;
      statusMessage.value = "Find all matches!";
      score.value = 0;
      moves.value = 0;
      initializeGame(selectedCardCount.value);
    };

    // Initialize the game with the chosen number of cards
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

    // Handle flipping a card
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

    // Check if the two flipped cards match
    const checkForMatch = () => {
      const [firstIndex, secondIndex] = flippedCards.value;
      const firstCard = cards.value[firstIndex];
      const secondCard = cards.value[secondIndex];

      if (firstCard.value === secondCard.value) {
        firstCard.matched = true;
        secondCard.matched = true;
        flippedCards.value = [];
        score.value += 20;

        // If all cards matched, end the game
        if (cards.value.every(c => c.matched)) {
          statusMessage.value = "";
          gameEnded.value = true;
          saveFinalScore();
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

    // Save the final score to the database
    const saveFinalScore = async () => {
      const token = localStorage.getItem("authToken");
      if (!token || !userId.value) return; // Ensure we have user_id from token

      const apiUrl = import.meta.env.VITE_APP_API_URL;
      const scoreData = {
        UserID: userId.value,  // Now we include the user ID
        GameID: gameId.value,  // Use the incremented gameId
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
