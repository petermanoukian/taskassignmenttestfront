import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import superadminRoutes from './superadmin';


const routes = [
  {
    path: '/',
    name: 'home',
    component: Login
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  ...superadminRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  // This is a placeholder for your actual authentication check
  const isAuthenticated = false 

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' }) 
  } else {
    next()
  }
})

export default router