import { createRouter, createWebHistory } from "vue-router";
import AddBookView from "@//views/AddBookView.vue";
import BooksView from "@/views/BooksView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/books",
      name: "books",
      component: BooksView,
    },
    {
      path: "/add-book",
      name: "add-book",
      component: AddBookView,
    },
  ],
});

export default router;
