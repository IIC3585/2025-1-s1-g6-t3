<template>
    <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 class="text-xl font-semibold text-indigo-700 mb-4">Agregar nuevo libro manualmente</h3>
  
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          v-model="title"
          type="text"
          placeholder="Título del libro"
          required
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
        />
      </div>
  
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Autor</label>
        <input
          v-model="author"
          type="text"
          placeholder="Autor del libro"
          required
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
        />
      </div>
  
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          v-model="status"
          required
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
        >
          <option disabled value="">Selecciona un estado</option>
          <option>Leído</option>
          <option>Leyendo</option>
          <option>Quiero leer</option>
          <option>Recomendado</option>
        </select>
      </div>
  
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <input
          v-model="category"
          type="text"
          placeholder="Ej: Novela, Ciencia ficción, Historia"
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>
  
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
        <textarea
          v-model="comment"
          placeholder="¿Qué opinas de este libro?"
          rows="3"
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>
  
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Portada (opcional)</label>
        <input type="file" accept="image/*" @change="handleImageUpload" />
        <img v-if="cover" :src="cover" class="mt-2 w-24 rounded shadow" />
      </div>
  
      <button
        type="submit"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        Agregar libro
      </button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useBookStore } from '../store/bookStore'
  
  const title = ref('')
  const author = ref('')
  const status = ref('')
  const comment = ref('')
  const category = ref('')
  const cover = ref('')
  
  const store = useBookStore()

  const props = defineProps({
    showToast: {
      type: Function,
      required: true
    }
  })
  
  const handleSubmit = () => {
    store.addBook({
      id: Date.now(),
      title: title.value,
      author: author.value,
      status: status.value,
      comment: comment.value,
      category: category.value,
      cover: cover.value,
    })
  
    // Mostrar notificación
    props.showToast('✅ Libro agregado manualmente')
  
    // Limpiar formulario
    title.value = ''
    author.value = ''
    status.value = ''
    comment.value = ''
    category.value = ''
    cover.value = ''
  }
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
  
    const reader = new FileReader()
    reader.onload = () => {
      cover.value = reader.result
    }
    reader.readAsDataURL(file)
  }
  </script>
  

