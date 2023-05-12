import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/pags/home/index.vue'
import Detail from '@/pags/detail/index.vue'

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
