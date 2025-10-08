import { createRouter, createWebHistory } from 'vue-router'
import { sessionStore } from './data/session'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('@/pages/Guide.vue'),
  },
  {
    path: '/tour',
    name: 'Tour',
    component: () => import('@/pages/Guide.vue'),
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/pages/Login.vue'),
  },

]

let router = createRouter({
  history: createWebHistory('/zendmen'),
  routes,
})
router.beforeEach(async (to, from, next) => {
  const store = sessionStore()
  if (to.name === 'Login' && store.isLoggedIn) {
    next({ name: 'Home' })
  } else if (to.name !== 'Login' && !store.isLoggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router