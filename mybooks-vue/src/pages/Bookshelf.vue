<template>
    <div>
      <h2 class="text-3xl font-semibold text-indigo-700 mb-6">Mi Biblioteca</h2>
      <div v-if="books.length === 0" class="text-gray-500">Aún no has agregado libros.</div>
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <BookCard v-for="book in books" :key="book.id" :book="book" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useBookStore } from '../store/bookStore'
  import BookCard from '../components/BookCard.vue'
  
  const store = useBookStore()
  const books = computed(() => store.books)
  </script>
