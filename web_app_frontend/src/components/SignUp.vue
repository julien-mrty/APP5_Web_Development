<template>
  <div class="signup-page">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSubmit">
      <label for="username">Username:</label>
      <input v-model="username" id="username" type="text" required />

      <label for="password">Password:</label>
      <input v-model="password" id="password" type="password" required />

      <label for="confirmPassword">Confirm Password:</label>
      <input v-model="confirmPassword" id="confirmPassword" type="password" required />

      <button type="submit">Sign Up</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
    <button @click="redirectToConnection" class="redirect-button">Already have an account? Go to Login</button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      errorMessage: null,
    };
  },
  methods: {
    async handleSubmit() {
      // Frontend validation for password mismatch
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          // Save the token to localStorage
          localStorage.setItem("authToken", data.token);

          console.log("Sign-up successful. Token saved:", data.token);

          // Redirect to the home page
          this.$router.push("/home");
        } else {
          const error = await response.json();

          // Handle specific backend errors
          if (response.status === 409) {
            this.errorMessage = "Username is already taken. Please choose another.";
          } else if (response.status === 400) {
            this.errorMessage = "Invalid input. Please check your details.";
          } else {
            this.errorMessage = error.message || "An error occurred during sign-up.";
          }
        }
      } catch (error) {
        // Catch network or unexpected errors
        this.errorMessage = "A network error occurred. Please try again.";
        console.error("Sign-up error:", error);
      }
    },
    redirectToConnection() {
      this.$router.push("/"); // Redirect to the login page
    },
  },
};
</script>


<style scoped>
.signup-page {
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
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.redirect-button {
  margin-top: 15px;
  background-color: #007bff;
  color: #fff;
}

.redirect-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>