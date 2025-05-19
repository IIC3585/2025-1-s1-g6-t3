import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Library from '../pages/Library.vue'
import Wishlist from '../pages/Wishlist.vue'
import Bookshelf from '../pages/Bookshelf.vue'
import Stats from '../pages/Stats.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/library', component: Library },
  { path: '/bookshelf', component: Bookshelf },
  { path: '/wishlist', component: Wishlist },
  { path: '/stats', component: Stats }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})