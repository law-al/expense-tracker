import { useUserStore } from '@/stores/user.store'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/auth/AuthLogin.vue') },
    { path: '/register', component: () => import('@/views/auth/AuthRegister.vue') },
    { path: '/verify', component: () => import('@/views/auth/AuthVerify.vue') },
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
    {
      path: '/records',
      component: () => import('@/views/dashboard/UserRecord.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/budget',
      component: () => import('@/views/dashboard/UserBudget.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if ((to.meta.requiresAuth || from.meta.requiresAuth) && !useUserStore().isAuthenticated)
    next('/login')
  else if (
    (to.path === '/login' || to.path === '/register' || to.path === '/verify') &&
    useUserStore().isAuthenticated
  )
    next('/dashboard')
  else next()
})

export default router
