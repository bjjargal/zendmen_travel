import { createRouter, createWebHistory } from 'vue-router'
import { sessionStore } from './data/session'
import { userResource } from '@/data/user'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/pages/Login.vue'),
  },

]

let router = createRouter({
  history: createWebHistory('/erp'),
  routes,
})
router.beforeEach(async (to, from, next) => {
  const store = sessionStore()

  try {
    await userResource.promise
    store.user = userResource.data?.user || null
    store.roles = userResource.data?.roles || []
    store.employee = userResource.data?.employee || {}
  } catch (error) {
    store.user = null
  }

  if (to.name === 'Login' && store.isLoggedIn) {
    next({ name: 'Home' })
  } else if (to.name !== 'Login' && !store.isLoggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router