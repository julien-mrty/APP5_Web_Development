import { createRouter, createWebHistory } from 'vue-router';
import Connection from '../components/Log-in.vue';
import Home from '../components/Home.vue';
import Play from '../components/PlayGame.vue';
import Scores from '../components/GameScores.vue';
import SignUp from "../components/SignUp.vue";


const routes = [
  {
    path: '/', // Default route
    name: 'Connection',
    component: Connection, // This should render your Connection
  },
  {
    path: '/home',  
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  { 
    path: "/signup", 
    name: 'SignUp',
    component: SignUp 
  },
  {
    path: '/playgame',
    name: 'PlayGame',
    component: Play,
    meta: { requiresAuth: true }
  },
  {
    path: '/gamescores',
    name: 'GameScores',
    component: Scores,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;