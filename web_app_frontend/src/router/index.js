import { createRouter, createWebHistory } from 'vue-router';
import ConnectionPage from '../components/Login.vue';
import HomePage from '../components/Home.vue';
import PlayPage from '../components/Play.vue';
import ScoresPage from '../components/Scores.vue';
import SignUpPage from "../components/SignUp.vue";


const routes = [
  {
    path: '/', // Default route
    name: 'ConnectionPage',
    component: ConnectionPage, // This should render your ConnectionPage
  },
  {
    path: '/homepage',  
    name: 'HomePage',
    component: HomePage,
  },
  { 
    path: "/signup", 
    name: 'SignUpPage',
    component: SignUpPage 
  },
  {
    path: '/play',
    name: 'PlayPage',
    component: PlayPage,
  },
  {
    path: '/scores',
    name: 'ScoresPage',
    component: ScoresPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;