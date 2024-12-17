import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';

createApp(App)
  .use(router) // Use the router in the app
  .mount('#app'); // Mount the app to the #app element