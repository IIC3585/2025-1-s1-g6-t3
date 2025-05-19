<template>
    <div>
      <h2 class="text-3xl font-semibold text-indigo-700 mb-6">Wishlist - Quiero leer</h2>
      <div v-for="book in filteredBooks" :key="book.id">
        <BookCard :book="book" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useBookStore } from '../store/bookStore'
  import BookCard from '../components/BookCard.vue'
  
  const store = useBookStore()
  const filteredBooks = computed(() => 
    store.books.filter(b => b.status === 'Quiero leer')
  )
  </script>
