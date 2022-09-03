import { createRouter, createWebHistory } from "vue-router";
import AddBookView from "../views/AddBookView.vue";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/add-book",
      name: "add-book",
      component: AddBookView,
    },
  ],
});

export default router;
