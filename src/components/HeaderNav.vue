<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="flex justify-between bg-slate-200 py-4 px-2 shadow-md">
    <div>Digital bookshelf</div>
    <nav class="flex space-x-4">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/add-book">Add books</RouterLink>
    </nav>
    <div></div>
  </div>
</template>
