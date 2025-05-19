<template>
    <div>
      <h2 class="text-3xl font-semibold text-indigo-700 mb-6">Buscar y Agregar Libros</h2>
      
      <!-- Buscador de Google Books -->
      <BookSearch :showToast="showToast" />
      
      <!-- Separador visual -->
      <div class="my-10 border-t border-gray-200"></div>
      
      <!-- Formulario para agregar libros manualmente -->
      <h2 class="text-3xl font-semibold text-indigo-700 mb-6">Agregar Libro Manualmente</h2>
      <BookForm :showToast="showToast" />
    </div>
  </template>
  
  <script setup>
  import BookSearch from '../components/BookSearch.vue'
  import BookForm from '../components/BookForm.vue'
  
  defineProps(['showToast'])
  </script>



