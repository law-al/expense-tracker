<template>
  <div class="relative h-fit max-w-[639px] overflow-scroll bg-gray-950">
    <div class="p-4 overflow-auto mb-20">
      <slot></slot>
    </div>

    <footer class="fixed bottom-0 left-0 w-full max-w-[639px] bg-image p-4">
      <div class="w-full h-[50px] flex items-center justify-around text-white">
        <!-- Home -->
        <router-link
          to="/dashboard"
          active-class="text-indigo-700"
          class="flex flex-col items-center justify-center gap-1"
        >
          <u-icon name="i-fluent-home-24-regular" class="size-6" />
          <p class="text-xs">Home</p>
        </router-link>

        <!-- Records -->
        <router-link
          to="/records"
          active-class="text-indigo-700"
          class="flex flex-col items-center justify-center gap-1"
        >
          <u-icon name="i-solar-book-outline" class="size-6" />
          <p class="text-xs">Records</p>
        </router-link>

        <!-- Add Transaction -->
        <div
          class="w-[45px] h-[45px] rounded-full text-white bg-indigo-700 flex items-center justify-center"
        >
          <u-icon name="i-mynaui-plus" class="size-8" />
        </div>

        <!-- Budgets -->
        <router-link
          to="/budgets"
          active-class="text-indigo-700"
          class="flex flex-col items-center justify-center gap-1"
        >
          <u-icon name="i-ri-currency-fill" class="size-6" />
          <p class="text-xs">Budgets</p>
        </router-link>

        <!-- Accounts -->
        <router-link
          to="/accounts"
          active-class="text-indigo-700"
          class="flex flex-col items-center justify-center gap-1"
        >
          <u-icon name="i-ic-sharp-account-box" class="size-6" />
          <p class="text-xs">Accounts</p>
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.bg-image {
  background: linear-gradient(180deg, #0b0e1a, #1a1446);
}
</style>
