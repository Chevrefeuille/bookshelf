<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { debounce } from "lodash";
import searchBook from "@/services/openlibrary";
import { addBookRecords } from "@/services/airtable";
import type { Book } from "@/types/Book";

const titleQuery = ref("");
const authorQuery = ref("");

const results: Ref<Book[]> = ref([]);

const search = async () => {
  const query: { title?: string; author?: string } = {};
  if (titleQuery.value) {
    query.title = titleQuery.value;
  }
  if (authorQuery.value) {
    query.author = authorQuery.value;
  }
  const { data } = await searchBook(query);

  results.value = data.docs.map(
    (doc: any): Book => ({
      key: doc.key,
      title: doc.title ? doc.title : "unknown",
      authors: doc.author_name ? doc.author_name : [],
      isbn: doc.isbn ? doc.isbn : [],
      year: doc.first_publish_year ? doc.first_publish_year : undefined,
      tags: doc.subject ? doc.subject : [],
      languages: doc.language ? doc.language : [],
      editions: doc.edition_key ? doc.edition_key : [],
      coverUrl: doc.edition_key
        ? `https://covers.openlibrary.org/b/olid/${doc.edition_key[0]}-M.jpg`
        : "https://via.placeholder.com/150x350",
    })
  );
};
const debouncedSearch = debounce(search, 1000);

const getAuthorsString = (authors: string[]) => {
  return authors.length > 0 ? "by " + authors.join(", ") : "Unknown author";
};

const selectedBooks: Ref<Book[]> = ref([]);
const toggleSelect = (book: Book) => {
  if (isSelected(book.key)) {
    selectedBooks.value = selectedBooks.value.filter(
      (selectedBook: Book) => selectedBook.key !== book.key
    );
  } else {
    selectedBooks.value.push(book);
  }
};
const isSelected = (key: string) => {
  return selectedBooks.value.some((book: Book) => book.key === key);
};

const addBooks = () => {
  addBookRecords(selectedBooks.value);
};
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
        <div v-if="results.length">
          <button class="mb-2 rounded-md bg-gray-300 p-2" @click="addBooks()">
            Mark as read
          </button>
          <div class="flex flex-col space-y-2">
            <div
              v-for="(book, i) in results"
              :key="i"
              class="cursor-pointer rounded-md bg-slate-300 p-2"
              @click="toggleSelect(book)"
              :class="{ 'bg-green-500': isSelected(book.key) }"
            >
              <p class="font-bold">{{ book.title }}</p>
              <p>{{ getAuthorsString(book.authors) }}</p>
              <p class="text-sm">First published in {{ book.year }}</p>
              <p class="text-sm">
                {{ book.editions.length }} editions in
                {{ book.languages.length }} langages
              </p>
            </div>
          </div>
        </div>
        <div v-else>No results matching the given query</div>
      </div>
    </div>
  </main>
</template>
