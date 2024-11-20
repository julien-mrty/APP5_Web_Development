import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App)
  .use(router) // Use the router in the app
  .mount('#app'); // Mount the app to the #app element