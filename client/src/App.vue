<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from './stores/user.store'
import { useAccountStore } from './stores/account.store'

const userStore = useUserStore()
const accountStore = useAccountStore()

onMounted(() => {
  userStore.initializeUser()
  accountStore.fetchUsersAccount()
})
</script>

<template>
  <u-app>
    <router-view />
  </u-app>
</template>

<style scoped></style>
