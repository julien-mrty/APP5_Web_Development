import { createRouter, createWebHistory } from 'vue-router';
import ConnectionPage from '../components/ConnectionPage.vue';
import HomePage from '../components/HomePage.vue';
import PlayPage from '../components/PlayPage.vue';
import ScoresPage from '../components/ScoresPage.vue';


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