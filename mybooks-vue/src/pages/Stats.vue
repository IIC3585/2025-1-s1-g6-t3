<template>
    <div class="space-y-8">
      <h2 class="text-3xl font-semibold text-indigo-700">📈 Estadísticas de Lectura</h2>
  
      <div class="bg-white p-4 rounded shadow">
        <p class="text-lg">Total de libros: <strong>{{ books.length }}</strong></p>
        <p>Leídos: {{ countByStatus('Leído') }}</p>
        <p>En lectura: {{ countByStatus('Leyendo') }}</p>
        <p>Quiero leer: {{ countByStatus('Quiero leer') }}</p>
        <p>Recomendados: {{ countByStatus('Recomendado') }}</p>
      </div>
  
      <!-- Sección de libros que está leyendo el usuario -->
      <div v-if="booksReading.length > 0" class="bg-white p-4 rounded shadow">
        <h3 class="text-xl font-semibold text-indigo-700 mb-4">📖 Libros en Lectura</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="book in booksReading" 
            :key="book.id" 
            class="border border-gray-200 p-3 rounded-lg"
          >
            <div class="flex gap-3">
              <img 
                v-if="book.cover" 
                :src="book.cover" 
                alt="Portada" 
                class="w-16 h-auto object-cover rounded"
              />
              <div>
                <p class="font-medium text-indigo-700">{{ book.title }}</p>
                <p class="text-sm text-gray-600">por {{ book.author }}</p>
                <p class="text-sm mt-1" v-if="book.comment">{{ book.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-2">Libros por Estado</h3>
          <BarChart :labels="statusLabels" :values="statusValues" />
        </div>
  
        <div class="bg-white p-4 rounded shadow">
          <h3 class="font-semibold mb-2">Libros por Categoría</h3>
          <PieChart :labels="categoryLabels" :values="categoryValues" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useBookStore } from '../store/bookStore'
  import BarChart from '../components/BarChart.vue'
  import PieChart from '../components/PieChart.vue'
  
  const store = useBookStore()
  const books = computed(() => store.books)
  
  const countByStatus = (status) => 
    books.value.filter(b => b.status === status).length
  
  // Obtener libros que están siendo leídos actualmente
  const booksReading = computed(() => 
    books.value.filter(b => b.status === 'Leyendo')
  )
  
  const statusLabels = ['Leído', 'Leyendo', 'Quiero leer', 'Recomendado']
  const statusValues = computed(() => statusLabels.map(s => countByStatus(s)))
  
  const categoryMap = computed(() => {
    const map = {}
    books.value.forEach(book => {
      const cat = book.category || 'Sin categoría'
      map[cat] = (map[cat] || 0) + 1
    })
    return map
  })
  
  const categoryLabels = computed(() => Object.keys(categoryMap.value))
  const categoryValues = computed(() => Object.values(categoryMap.value))
  </script>

