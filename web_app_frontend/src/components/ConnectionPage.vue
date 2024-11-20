<template>
    <div class="connection-page">
      <h1>Login</h1>
      <form @submit.prevent="handleSubmit">
        <label for="username">Username:</label>
        <input v-model="username" id="username" type="text" required />
  
        <label for="password">Password:</label>
        <input v-model="password" id="password" type="password" required />
  
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  import { useRouter } from "vue-router"; // Import useRouter
  
  export default {
    methods: {
      handleSubmit() {
        const router = useRouter(); // Get the router instance
        console.log("Logging in:", this.username); // Debug: Log input
        router.push("/homepage"); // Redirect to HomePage
      },
    },
  };
  </script>
  
  <style scoped>
  .connection-page {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  label {
    display: block;
    margin: 10px 0 5px;
  }
  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
  }
  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
  