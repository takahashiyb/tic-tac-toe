import MultiPage from '@/pages/MultiPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/', name: 'multiplayer', component: MultiPage }],
})

export default router
