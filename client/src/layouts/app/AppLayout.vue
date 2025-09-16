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
        <div class="">
          <div
            @click="openTransactionModal = true"
            class="w-[45px] h-[45px] rounded-full text-white bg-indigo-700 flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-800"
          >
            <u-icon name="i-mynaui-plus" class="size-8" />
          </div>

          <add-transaction
            :open-add-transaction-view="openTransactionModal"
            @close-add-transaction-view="openTransactionModal = false"
          />
        </div>

        <!-- Budgets -->
        <router-link
          to="/budget"
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

<script setup lang="ts">
// import AddTransaction from '@/components/transactions/AddTransaction.vue'
import { useGlobalStore } from '@/stores/global.store'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, watch } from 'vue'

const AddTransaction = defineAsyncComponent(
  () => import('@/components/transactions/AddTransaction.vue'),
)

// Drawer state
const globalStore = useGlobalStore()
const { openTransactionModal } = storeToRefs(globalStore)

watch(
  () => openTransactionModal.value,
  (newVal) => {
    console.log('Add Transaction Modal Visible:', newVal)
  },
)
</script>

<style scoped>
.bg-image {
  background: linear-gradient(180deg, #0b0e1a, #1a1446);
}
</style>
