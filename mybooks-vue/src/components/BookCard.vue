<template>
    <div class="bg-white p-6 rounded-lg shadow-md mb-4 flex flex-col md:flex-row gap-4 items-start">
      <img
        v-if="book.cover"
        :src="book.cover"
        alt="Portada"
        class="w-24 h-36 object-cover rounded shadow mx-auto md:mx-0"
      />
  
      <div class="flex-1 w-full">
        <div class="flex flex-col md:flex-row justify-between items-start">
          <div class="space-y-1 w-full">
            <h3 class="text-lg font-semibold text-indigo-700">{{ book.title }}</h3>
            <p class="text-sm text-gray-600 italic">por {{ book.author }}</p>
  
            <!-- Selector de estado normal -->
            <p v-if="!showReviewForm" class="text-sm text-gray-700">
              Estado:
              <select
                v-model="selectedStatus"
                @change="handleStatusChange"
                class="text-sm border rounded p-1 ml-1"
              >
                <option>Leído</option>
                <option v-if="previousStatus === 'Leyendo'">Leyendo</option>
                <option>Quiero leer</option>
                <option>Recomendado</option>
              </select>
            </p>            <!-- Comentario (Solo lectura) -->
            <p v-if="book.comment && !showReviewForm" class="text-sm text-gray-700 mt-2 italic">
              "{{ book.comment }}"
            </p>

            <!-- Formulario de valoración cuando pasa de "Leyendo" a "Leído" -->
            <div v-if="showReviewForm" class="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
              <h4 class="font-medium text-indigo-700 text-sm mb-2">
                ¡Has terminado este libro! Cuéntanos qué te pareció
              </h4>
              
              <div class="mb-3">
                <label class="block text-sm text-gray-600 mb-1">Tu opinión:</label>
                <textarea 
                  v-model="reviewComment" 
                  rows="3" 
                  class="w-full border border-gray-300 rounded p-2 text-sm"
                  placeholder="¿Qué te pareció el libro?"
                ></textarea>
              </div>
              
              <div class="flex gap-2">
                <button 
                  @click="submitReview"
                  class="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
                >
                  Guardar valoración
                </button>
                <button 
                  @click="cancelReview"
                  class="bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
  
            <p v-if="book.category" class="text-sm text-gray-500">Categoría: {{ book.category }}</p>
  
            <a 
              :href="googleBooksUrl" 
              target="_blank" 
              class="inline-block mt-2 text-sm text-green-600 hover:underline"
              v-if="googleBooksUrl"
            >
              🛒 Ver en Google Books
            </a>
  
            <button
              v-if="selectedStatus === 'Quiero leer'"
              @click="markAsReading(book.id)"
              class="mt-2 ml-0 md:ml-3 text-sm text-blue-600 hover:underline"
            >
              📖 Estoy leyendo
            </button>
          </div>
  
          <button
            @click="removeBook(book.id)"
            class="text-red-600 hover:text-red-800 text-sm px-2 py-1 mt-2 md:mt-0"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue'
  import { useBookStore } from '../store/bookStore'
  
  const props = defineProps({
    book: {
      type: Object,
      required: true
    }
  })
  
  const store = useBookStore()
  const selectedStatus = ref(props.book.status)
  const previousStatus = ref(props.book.status)
  const showReviewForm = ref(false)
  const reviewComment = ref('')
  
  // Mantener el estado local sincronizado con las propiedades
  watch(() => props.book.status, (newStatus) => {
    selectedStatus.value = newStatus
    previousStatus.value = newStatus
  })
  
  // Generar URL para Google Books basado en el título y autor
  const googleBooksUrl = computed(() => {
    if (props.book.title) {
      const query = encodeURIComponent(`${props.book.title} ${props.book.author}`)
      return `https://books.google.com/books?q=${query}`
    }
    return null
  })
  
  const handleStatusChange = () => {
    // Si intenta cambiar a "Leyendo" y no está permitido, revertir el cambio
    if (selectedStatus.value === 'Leyendo' && previousStatus.value !== 'Leyendo') {
      selectedStatus.value = previousStatus.value
      return
    }
    
    // Si cambia de "Leyendo" a "Leído", mostrar el formulario de valoración
    if (previousStatus.value === 'Leyendo' && selectedStatus.value === 'Leído') {
      showReviewForm.value = true
      // Al mostrar el formulario, preparamos un nuevo comentario
      reviewComment.value = ''
    } else if (previousStatus.value === 'Leyendo') {
      // Si cambia de Leyendo a cualquier otro estado (excepto Leído),
      // quitamos el comentario de "Comenzado el ..."
      store.updateBook(props.book.id, { 
        status: selectedStatus.value,
        comment: '' 
      })
      previousStatus.value = selectedStatus.value
    } else {
      // Para otros cambios de estado, actualizar directamente
      store.updateBookStatus(props.book.id, selectedStatus.value)
      previousStatus.value = selectedStatus.value
    }
  }
  
  const submitReview = () => {
    // Actualizar el libro con el nuevo estado y comentario
    store.updateBook(props.book.id, { 
      status: 'Leído', 
      comment: reviewComment.value 
    })
    previousStatus.value = 'Leído'
    showReviewForm.value = false
  }
  
  const cancelReview = () => {
    // Restaurar el estado anterior y cancelar
    selectedStatus.value = previousStatus.value
    showReviewForm.value = false
  }
  
  const removeBook = (id) => {
    store.removeBook(id)
  }
  
  const markAsReading = (id) => {
    store.markAsReading(id)
    previousStatus.value = 'Leyendo'
  }
  </script>


