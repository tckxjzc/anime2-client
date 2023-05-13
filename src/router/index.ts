import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/pages/home/index.vue'
import Detail from '@/pages/detail/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/detail/:id',
      name: 'detail',
      component: Detail
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
  ]
})

export default router
