import { createRouter, createWebHistory } from "vue-router";
import LoginRegister from '../components/LoginRegister.vue'
import App from "../App_primjer_s_dodavanjem.vue";

const routes = [
  { path: "/", redirect: "/register" },
  { path: "/home", name: "Home", component: App },
  { path: '/login', component: LoginRegister },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;