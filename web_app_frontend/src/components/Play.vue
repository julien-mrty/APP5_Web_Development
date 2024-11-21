<template>
    <div class="play-page">
      <h1>Game Play Page</h1>
      <div class="buttons">
        <button @click="goToHome">Home</button>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from "vue-router"; // Import useRouter
  
  export default {
    name: "PlayPage",
    setup() {
      const router = useRouter(); // Get the router instance
  
      const goToHome = () => {
        router.push("/homepage"); // Correct route path
      };
  
      return {
        goToHome,
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
  </style>  