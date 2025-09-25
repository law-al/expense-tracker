<template>
  <div class="h-screen max-w-[639px] overflow-scroll bg-gray-950 flex flex-col justify-around">
    <div class="h-full p-4 overflow-auto scrollbar-hidden">
      <slot></slot>
    </div>

    <footer class="w-full max-w-[639px] bg-image p-4">
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
        <div
          @click="openMenuModal = true"
          class="flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <u-icon name="i-ri-menu-3-line" class="size-6" />
          <p class="text-xs">Menu</p>
        </div>
      </div>
    </footer>
  </div>

  <!-- Add Transaction modal -->
  <add-transaction
    :open-add-transaction-view="openTransactionModal"
    @close-add-transaction-view="openTransactionModal = false"
    @finish-transaction-and-dismiss="finishTransactionAndDismiss"
  />

  <!-- Menu modal -->
  <user-menu :open-menu-modal="openMenuModal" @close-menu-modal="openMenuModal = false" />
</template>

<script setup lang="ts">
// import AddTransaction from '@/components/transactions/AddTransaction.vue'
import UserMenu from '@/components/menu/UserMenu.vue'
import AddTransaction from '@/components/transactions/AddTransaction.vue'
import { useGlobalStore } from '@/stores/global.store'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { watch } from 'vue'

// Drawer state
const globalStore = useGlobalStore()
const { openTransactionModal } = storeToRefs(globalStore)

const openMenuModal = ref<boolean>(false)

const finishTransactionAndDismiss = () => {
  openTransactionModal.value = false
  document.body.style.pointerEvents = 'auto'
}

watch(
  () => openTransactionModal.value,
  (newVal) => {
    ;('Add Transaction Modal Visible:', newVal)
  },
)
</script>

<style scoped>
.bg-image {
  background: linear-gradient(180deg, #0b0e1a, #1a1446);
  z-index: 10;
}
</style>
