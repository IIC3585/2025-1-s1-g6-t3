<template>
    <div class="bg-white p-6 rounded-lg shadow-md mb-8 space-y-10">
      <!-- Buscar libros desde Google Books -->
      <section>
        <h2 class="text-2xl font-semibold text-indigo-700 mb-4">Buscar libro en línea</h2>
        <form @submit.prevent="searchBooks" class="flex items-center shadow-sm border border-gray-300 rounded overflow-hidden mb-6">
          <input
            v-model="query"
            type="text"
            placeholder="Buscar libros por título"
            class="flex-1 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" class="bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition">
            Buscar
          </button>
        </form>
  
        <ul v-if="results.length > 0" class="space-y-6">
          <li
            v-for="book in results"
            :key="book.id"
            class="bg-gray-50 p-4 rounded shadow flex flex-col sm:flex-row gap-4"
          >
            <img
              v-if="book.volumeInfo.imageLinks?.thumbnail"
              :src="book.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')"
              alt="Portada"
              class="w-24 h-36 object-cover rounded shadow mx-auto sm:mx-0"
            />
            <div class="flex-1 space-y-2">
              <p class="text-lg font-semibold text-indigo-700">{{ book.volumeInfo.title }}</p>
              <p class="text-sm text-gray-600 italic" v-if="book.volumeInfo.authors">por {{ book.volumeInfo.authors.join(', ') }}</p>
              <p class="text-sm text-gray-500" v-if="book.volumeInfo.categories">Categoría: {{ book.volumeInfo.categories[0] }}</p>
  
              <!-- Campos manuales -->
              <div>
                <label class="text-sm text-gray-600">Estado</label>
                <select v-model="book.customState" class="w-full p-1 border border-gray-300 rounded">
                  <option disabled value="">Selecciona un estado</option>
                  <option>Leído</option>
                  <option>Leyendo</option>
                  <option>Quiero leer</option>
                  <option>Recomendado</option>
                </select>
              </div>
  
              <div>
                <label class="text-sm text-gray-600">Comentario</label>
                <textarea v-model="book.customComment" rows="2" class="w-full border border-gray-300 rounded p-1" placeholder="Comentario (opcional)"></textarea>
              </div>
  
              <button
                @click="addBookFromApi(book)"
                class="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Agregar libro
              </button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import { useBookStore } from '../store/bookStore'
  
  const store = useBookStore()
  
  const query = ref('')
  const results = ref([])
  const loading = ref(false)
  
  const searchBooks = async () => {
    if (!query.value.trim()) return
    loading.value = true
    results.value = []
  
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query.value)}`
      )
      results.value = (response.data.items || []).map(item => ({
        ...item,
        customState: '',
        customComment: ''
      }))
    } catch (error) {
      console.error('Error al buscar libros:', error)
    } finally {
      loading.value = false
    }
  }

  const props = defineProps(['showToast'])
  
  const addBookFromApi = (book) => {
    const info = book.volumeInfo
  
    if (!book.customState) {
      alert('Debes seleccionar un estado antes de agregar.')
      return
    }
  
    store.addBook({
      id: Date.now(),
      title: info.title || 'Sin título',
      author: info.authors ? info.authors.join(', ') : 'Autor desconocido',
      status: book.customState,
      comment: book.customComment,
      category: info.categories ? info.categories[0] : 'Sin categoría',
      cover: info.imageLinks?.thumbnail || '',
    })

    props.showToast('📚 Libro agregado desde Google Books')
    
    // Limpiar los resultados y la consulta después de agregar el libro
    results.value = []
    query.value = ''
  }
  </script>
  
  
