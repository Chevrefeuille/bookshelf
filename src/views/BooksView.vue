<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import { listBooks } from "@/services/airtable";
import type { Book } from "@/types/Book";

const books: Ref<Book[]> = ref([]);

onMounted(async () => {
  books.value = await listBooks();
});
</script>

<template>
  <main class="px-6">
    <p>
      <span class="font-bold">{{ books.length }}</span> books in the bookshelf
    </p>
    <div class="mx-auto mt-4 grid grid-cols-8 gap-4">
      <div
        v-for="(book, i) in books"
        :key="i"
        class="overflow-hidden rounded-md"
      >
        <img :src="book.coverUrl" class="h-full w-full object-cover" />
      </div>
    </div>
  </main>
</template>
