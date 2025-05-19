<template>
    <div>
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
      />
      <p v-if="books.length === 0" class="text-gray-500">No hay libros en esta lista.</p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useBookStore } from '../store/bookStore'
  import BookCard from './BookCard.vue'
  
  const store = useBookStore()
  const books = computed(() => store.books)
  </script>


