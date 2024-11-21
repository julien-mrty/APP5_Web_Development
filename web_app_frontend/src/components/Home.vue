<template>
    <div class="home-page">
      <h1>Game Home Page</h1>
      <div class="buttons">
        <button @click="goToPlay">Play</button>
        <button @click="goToViewScores">View Scores</button>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'HomePage',
    setup() {
      const router = useRouter();
  
      const goToPlay = () => {
        router.push('/play'); // Navigate to Play page
      };
  
      const goToViewScores = () => {
        router.push('/scores'); // Navigate to Scores page
      };
  
      return {
        goToPlay,
        goToViewScores,
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
  </style>
  