<script setup lang="ts">
import { RouterView } from "vue-router";
import HeaderNav from "./components/HeaderNav.vue";
</script>

<template>
  <header class="mb-4"><HeaderNav /></header>
  <RouterView />
</template>

<style scoped></style>
