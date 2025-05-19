import { writable } from 'svelte/store';

const createBooksStore = () => {
  const { subscribe, set, update } = writable([]);

  // Load initial data from localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mybooks');
    if (stored) {
      set(JSON.parse(stored));
    }
  }

  return {
    subscribe,
    addBook: (book) => update(books => {
      const newBooks = [...books, { ...book, isReading: false, isFavorite: false }];
      localStorage.setItem('mybooks', JSON.stringify(newBooks));
      return newBooks;
    }),
    toggleReading: (id) => update(books => {
      const newBooks = books.map(book => 
        book.id === id ? { ...book, isReading: !book.isReading } : book
      );
      localStorage.setItem('mybooks', JSON.stringify(newBooks));
      return newBooks;
    }),
    toggleFavorite: (id) => update(books => {
      const newBooks = books.map(book => 
        book.id === id ? { ...book, isFavorite: !book.isFavorite } : book
      );
      localStorage.setItem('mybooks', JSON.stringify(newBooks));
      return newBooks;
    })
  };
};

export const books = createBooksStore();