<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { debounce } from "lodash";
import searchBook from "@/services/openlibrary";

interface Book {
  title: string;
  author: string;
  isbn: string;
  year?: number;
}

const titleQuery = ref("");
const authorQuery = ref("");

const results: Ref<Array<Book>> = ref([]);

const search = async () => {
  const query: any = {};
  if (titleQuery.value) {
    query.title = titleQuery.value;
  }
  if (authorQuery.value) {
    query.author = authorQuery.value;
  }
  const { data } = await searchBook(query);

  results.value = data.docs.filter;
};
const debouncedSearch = debounce(search, 600);

const selectedBooks = ref([]);
</script>

<template>
  <main>
    <div class="mx-auto max-w-2xl">
      <div class="flex flex-col items-start space-y-2">
        <div class="flex space-x-2">
          <div>Book's title</div>
          <input
            @input="debouncedSearch()"
            class="border border-slate-300 focus-visible:outline focus-visible:outline-slate-400"
            v-model="titleQuery"
          />
        </div>
        <div class="flex space-x-2">
          <div>Author's name</div>
          <input
            class="border border-slate-300 focus-visible:outline focus-visible:outline-slate-400"
            @input="debouncedSearch()"
            v-model="authorQuery"
          />
        </div>
      </div>
      <div class="mt-8 rounded-md bg-slate-200 p-4">
        <ul v-if="results.length">
          <li v-for="(doc, i) in results" :key="i" class="flex space-x-4">
            <input
              type="checkbox"
              :id="doc.isbn"
              :value="doc"
              v-model="selectedBooks"
            />
            <label for="jack">{{ doc.title }} - {{ doc.author }} </label>
          </li>
        </ul>
        <div v-else>No results matching the given query</div>
      </div>
    </div>
  </main>
</template>
