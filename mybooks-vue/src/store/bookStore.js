import { defineStore } from 'pinia'

const STORAGE_KEY = 'mybooks'

export const useBookStore = defineStore('bookStore', {
  state: () => ({
    books: JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  }),
  actions: {
    addBook(book) {
      this.books.push(book)
      this.saveToStorage()
    },
    removeBook(id) {
      this.books = this.books.filter(b => b.id !== id)
      this.saveToStorage()
    },
    updateBook(id, updates) {
      this.books = this.books.map(book => {
        if (book.id === id) {
          return { ...book, ...updates }
        }
        return book
      })
      this.saveToStorage()
    },
    updateBookStatus(id, newStatus) {
      this.updateBook(id, { status: newStatus })
    },
    markAsReading(id) {
      const date = new Date()
      const formatted = date.toLocaleDateString('es-CL')
      this.updateBook(id, { 
        status: 'Leyendo', 
        comment: `Comenzado el ${formatted}` 
      })
    },
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.books))
    }
  }
})

