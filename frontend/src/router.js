import { createRouter, createWebHistory } from 'vue-router'
import { sessionStore } from './data/session'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/staff/',
    name: 'staff',
    component: () => import('@/pages/Staff.vue'),
  },
  {
    path: '/tour/',
    name: 'TourList',
    component: () => import('@/pages/TourList.vue'),
  },
  {
    path: '/lead/',
    name: 'LeadList',
    component: () => import('@/pages/LeadList.vue'),
  },
  {
    path: '/lead/:name?',
    name: 'Lead',
    props: true,
    component: () => import('@/pages/Lead.vue'),
  },
  {
    path: '/activity/',
    name: 'ActivityList',
    component: () => import('@/pages/ActivityList.vue'),
  },
  {
    path: '/accomodation/',
    name: 'accomodationList',
    component: () => import('@/pages/AccomodationList.vue'),
  },
  {
    path: '/destination/',
    name: 'DestinationList',
    component: () => import('@/pages/DestinationList.vue'),
  },
  {
    path: '/employee/',
    name: 'employeeList',
    component: () => import('@/pages/EmployeeList.vue'),
  },
  {
    path: '/oppertunity/',
    name: 'oppertunityList',
    component: () => import('@/pages/OppertunityList.vue'),
  },
  {
    path: '/quotation/',
    name: 'quotationList',
    component: () => import('@/pages/QuotationList.vue'),
  },
  {
    path: '/quotation/:name?',
    name: 'quotation',
    props: true,
    component: () => import('@/pages/Quotation.vue'),
  },
  {
    path: '/vehicle/',
    name: 'VehicleList',
    component: () => import('@/pages/VehicleList.vue'),
  },
  {
    path: '/oppertunity/:name?',
    name: 'oppertunity',
    props: true,
    component: () => import('@/pages/Oppertunity.vue'),
  },
  {
    path: '/contacts/',
    name: 'contactList',
    component: () => import('@/pages/ContactList.vue'),
  },
  {
    path: '/employee/:name?',
    name: 'employee',
    props: true,
    component: () => import('@/pages/Employee.vue'),
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