import { createRouter, createWebHistory } from 'vue-router';
import ConnectionPage from '../View/ConnectionPage.vue';
import TheWelcome from '../components/TheWelcome.vue';

const routes = [
  {
    path: '/',
    name: 'ConnectionPage',
    component: ConnectionPage,  // The connection page will be shown first
  },
  {
    path: '/welcome',
    name: 'WelcomePage',
    component: TheWelcome,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;