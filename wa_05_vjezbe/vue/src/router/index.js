import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PizzaList from '../components/PizzaList.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/pizze',
    name: 'PizzaList',
    component: PizzaList,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;