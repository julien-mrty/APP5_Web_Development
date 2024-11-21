import { createRouter, createWebHistory } from 'vue-router';
import Connection from '../components/Log-in.vue';
import Home from '../components/Home.vue';
import Play from '../components/Play.vue';
import Scores from '../components/Scores.vue';
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
    path: '/play',
    name: 'Play',
    component: Play,
    meta: { requiresAuth: true }
  },
  {
    path: '/scores',
    name: 'Scores',
    component: Scores,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;