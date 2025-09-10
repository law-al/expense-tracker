import { useUserStore } from '@/stores/user.store'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/auth/AuthLogin.vue') },
    { path: '/register', component: () => import('@/views/auth/AuthRegister.vue') },
    { path: '/onboarding', component: () => import('@/views/auth/OnBoarding.vue') },
    {
      path: '/create-account',
      component: () => import('@/views/accounts/CreateAccount.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      component: () => import('@/views/dashboard/UserDashboard.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  console.log(to)
  console.log(useUserStore().isAuthenticated)
  if (to.meta.requiresAuth && !useUserStore().isAuthenticated) next('/login')
  next()
})

export default router
