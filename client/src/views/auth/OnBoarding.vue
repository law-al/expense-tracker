<template>
  <auth-layout>
    <div>
      <div class="mb-auto">
        <img
          src="@/assets/images/wallet-1.png"
          alt="Wallet Icon Image"
          class="w-25 h-25 mx-auto mb-4"
        />
        <h1 class="text-2xl font-bold text-center">Track your Budget</h1>
        <p class="text-center p-4">
          Easily manage your expenses and income with our intuitive budgeting tools.
        </p>
      </div>

      <div class="mt-30">
        <u-button
          size="lg"
          to="/register"
          class="w-full rounded-sm py-3 text-white justify-center cursor-pointer !bg-indigo-700 hover:bg-indigo-800"
          >Proceed</u-button
        >
      </div>
    </div>
  </auth-layout>
</template>

<script setup lang="ts">
import AuthLayout from '@/layouts/auth/AuthLayout.vue'
</script>

<style scoped></style>
