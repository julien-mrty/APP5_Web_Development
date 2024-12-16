<template>
  <div class="scores-page">
    <h1>See your scores here {{ user.username }}</h1>
    <div class="user-info">
      <img :src="user.avatar_url" alt="User Avatar" class="user-avatar" />
    </div>
    <div v-if="scores.length > 0">
      <ul>
        <li v-for="(scores, index) in scores" :key="index">
        {{ scores.Points }}   {{ new Date(scores.CreatedAt).toLocaleString() }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No scores found.</p>
    </div>
    <div class="buttons">
      <button @click="goToHome">Home</button>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"; // Import ref for reactivity and onMounted for lifecycle hook
import { useRouter } from "vue-router";

export default {
  name: "GameScores",
  setup() {
    const router = useRouter(); // Get the router instance
    const scores = ref([]); // Reactive variable to store scores
    const user = ref({ avatar_url: "", username: "" });

    const goToHome = () => {
      router.push("/home"); // Navigate to home page
    };

    const logout = () => {
      localStorage.removeItem("authToken"); // Remove the token from storage
      router.push("/"); // Redirect to login page
    };

    // Fetch scores securely
    const fetchScores = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        router.push("/");
        return;
      }
      
      try {
        const apiUrl = import.meta.env.VITE_APP_API_URL;
        const response = await fetch(`${apiUrl}/api/scores`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          scores.value = await response.json(); // Update the scores array
          console.log("Scores fetched successfully:", scores.value);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch scores:", errorData);
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      }

    };

    function base64UrlToBase64(base64Url) {
      return base64Url.replace(/-/g, "+").replace(/_/g, "/");
    }

    // Fetch user info from token
    const fetchUserInfo = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Extraire la partie payload du token
          const payloadBase64Url = token.split(".")[1];
          const payloadBase64 = base64UrlToBase64(payloadBase64Url);
          const decodedPayload = JSON.parse(atob(payloadBase64));

          user.value.username = decodedPayload.username || "Unknown";
          user.value.avatar_url = `https://robohash.org/${decodedPayload.username}?set=set1&size=150x150`;
        } catch (error) {
          console.error("Failed to parse token:", error);
          router.push("/"); 
        }
      } else {
        router.push("/");
      }
};


    // Protect the route and fetch scores on mount
    onMounted(() => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/"); // Redirect to login if no token is found
      } else {
        fetchUserInfo();
        fetchScores(); // Fetch scores if the token is valid
      }
    });

    return {
      user,
      goToHome,
      logout,
      scores, 
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