import MultiPage from '@/pages/MultiPage.vue'
import StartPage from '@/pages/StartPage.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/multi', name: 'multiplayer', component: MultiPage },
    { path: '/', name: 'start', component: StartPage },
  ],
})

export default router
