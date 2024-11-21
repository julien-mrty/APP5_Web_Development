<template>
  <div class="home-page">
    <h1>Game Home Page</h1>
    <div class="buttons">
      <button @click="goToPlay">Play</button>
      <button @click="goToViewScores">View Scores</button>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </div>
</template>


<script>
import { onMounted } from "vue"; // Import onMounted
import { useRouter } from "vue-router";

export default {
  name: "HomePage",
  setup() {
    const router = useRouter();

    const goToPlay = () => {
      router.push("/playgame");
    };

    const goToViewScores = () => {
      router.push("/gamescores");
    };

    const logout = () => {
      localStorage.removeItem("authToken"); // Remove the token from storage
      router.push("/"); // Redirect to login page
    };

    // Protect the route by checking the token
    onMounted(() => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/"); // Redirect to login if no token is found
      }
    });

    return {
      goToPlay,
      goToViewScores,
      logout,
    };
  },
};
</script>


<style scoped>
.home-page {
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
}

.logout-button {
  background-color: #dc3545;
  color: #fff;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>