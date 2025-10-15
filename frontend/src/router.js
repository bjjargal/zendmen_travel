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
    path: '/tour/',
    name: 'TourList',
    component: () => import('@/pages/TourList.vue'),
  },
  {
    path: '/activity/',
    name: 'ActivityList',
    component: () => import('@/pages/ActivityList.vue'),
  },
  {
    path: '/destination/',
    name: 'DestinationList',
    component: () => import('@/pages/DestinationList.vue'),
  },
  {
    path: '/tour/:name?',
    name: 'Tour',
    props: true,
    component: () => import('@/pages/Tour.vue'),
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