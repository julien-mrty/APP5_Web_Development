<template>
  <div class="home-page">
    <h1>Game Home Page</h1>
    <div class="user-info">
      <img :src="user.avatar_url" alt="User Avatar" class="user-avatar" />
      <h3>{{ user.username }}</h3>
    </div>
    <div class="buttons">
      <button @click="goToRunningGame">Play Running Game</button>
      <button @click="goToPlay">Play Card Game</button>
      <button @click="goToViewScores">View Card Game Scores</button>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </div>
</template>


<script>
import { onMounted, ref } from "vue"; // Import onMounted
import { useRouter } from "vue-router";

export default {
  name: "HomePage",
  setup() {
    const router = useRouter();
    const user = ref({ avatar_url: "", username: "" });

    const goToRunningGame = () => {
      router.push("/runninggame");
    };

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

    function base64UrlToBase64(base64Url) {
      return base64Url.replace(/-/g, "+").replace(/_/g, "/");
    }

    // Fetch user info from token
    const fetchUserInfo = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          
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


    // Protect the route by checking the token
    onMounted(() => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/"); // Redirect to login if no token is found
      } else {
        fetchUserInfo();
      }
    });

    return {
      user,
      goToRunningGame,
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