<template>
  <div class="scores-page">
    <h1>See your scores here</h1>
    <div class="buttons">
      <button @click="goToHome">Home</button>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue"; // Import onMounted
import { useRouter } from "vue-router"; // Import useRouter

export default {
  name: "GameScores",
  setup() {
    const router = useRouter(); // Get the router instance

    const goToHome = () => {
      router.push("/home"); // Correct route path
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
      goToHome,
      logout,
    };
  },
};
</script>

<style scoped>
.scores-page {
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
</style>