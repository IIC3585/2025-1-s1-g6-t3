<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <nav class="bg-white shadow-md sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <span>📚 MyBooks</span>
          </h1>
          
          <!-- Botón menú hamburguesa para móvil -->
          <button 
            class="block md:hidden text-gray-600 focus:outline-none"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Navegación para pantallas medianas y grandes -->
          <div class="hidden md:flex space-x-6 text-sm font-medium">
            <router-link to="/" class="hover:text-indigo-600">Inicio</router-link>
            <router-link to="/library" class="hover:text-indigo-600">Agregar Libros</router-link>
            <router-link to="/bookshelf" class="hover:text-indigo-600">Biblioteca</router-link>
            <router-link to="/wishlist" class="hover:text-indigo-600">Wishlist</router-link>
            <router-link to="/stats" class="hover:text-indigo-600">Estadísticas</router-link>
          </div>
        </div>
        
        <!-- Menú móvil -->
        <div 
          :class="isMenuOpen ? 'block' : 'hidden'" 
          class="md:hidden mt-2 py-2 space-y-2"
        >
          <router-link 
            to="/" 
            class="block px-2 py-1 text-indigo-600 rounded hover:bg-indigo-50"
            @click="isMenuOpen = false"
          >
            Inicio
          </router-link>
          <router-link 
            to="/library" 
            class="block px-2 py-1 text-indigo-600 rounded hover:bg-indigo-50"
            @click="isMenuOpen = false"
          >
            Agregar Libros
          </router-link>
          <router-link 
            to="/bookshelf" 
            class="block px-2 py-1 text-indigo-600 rounded hover:bg-indigo-50"
            @click="isMenuOpen = false"
          >
            Biblioteca
          </router-link>
          <router-link 
            to="/wishlist" 
            class="block px-2 py-1 text-indigo-600 rounded hover:bg-indigo-50"
            @click="isMenuOpen = false"
          >
            Wishlist
          </router-link>
          <router-link 
            to="/stats" 
            class="block px-2 py-1 text-indigo-600 rounded hover:bg-indigo-50"
            @click="isMenuOpen = false"
          >
            Estadísticas
          </router-link>
        </div>
      </div>
    </nav>
    <main class="max-w-6xl mx-auto px-4 py-8">
      <router-view :showToast="showToast" />
    </main>
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import Toast from './components/Toast.vue'
import { ref } from 'vue'

const toastRef = ref(null)
const isMenuOpen = ref(false)

const showToast = (message) => {
  toastRef.value?.showToast(message)
}
</script>
