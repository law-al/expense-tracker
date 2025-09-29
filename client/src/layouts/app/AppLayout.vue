<template>
  <div class="h-[100dvh] max-w-[639px] bg-gray-950 flex flex-col">
    <div class="flex-1 p-4 overflow-auto scrollbar-hidden">
      <slot></slot>
    </div>

    <!-- Fixed footer -->
    <footer
      class="w-full max-w-[639px] h-[100px] bg-gradient-to-t from-[#0f172a] to-[#1e293b]/90 backdrop-blur-md border-t border-gray-700/30 p-4 flex-shrink-0 shadow-lg"
    >
      <div class="w-full h-[80px] flex items-center justify-around text-gray-400">
        <!-- Home -->
        <router-link
          to="/dashboard"
          active-class="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.7)]"
          class="flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <u-icon name="i-fluent-home-24-regular" class="size-7" />
          <p class="text-[11px] font-medium tracking-wide">Home</p>
        </router-link>

        <!-- Records -->
        <router-link
          to="/records"
          active-class="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.7)]"
          class="flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <u-icon name="i-solar-book-outline" class="size-7" />
          <p class="text-[11px] font-medium tracking-wide">Records</p>
        </router-link>

        <!-- Add Transaction -->
        <div>
          <div
            @click="openTransactionModal = true"
            class="w-[64px] h-[64px] -mt-6 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-xl transition-transform hover:scale-110"
          >
            <u-icon name="i-mynaui-plus" class="size-9" />
          </div>
        </div>

        <!-- Budgets -->
        <router-link
          to="/budget"
          active-class="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.7)]"
          class="flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <u-icon name="i-ri-currency-fill" class="size-7" />
          <p class="text-[11px] font-medium tracking-wide">Budgets</p>
        </router-link>

        <!-- Menu -->
        <div
          @click="openMenuModal = true"
          class="flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <u-icon name="i-ri-menu-3-line" class="size-7" />
          <p class="text-[11px] font-medium tracking-wide">Menu</p>
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
import UserMenu from '@/components/menu/UserMenu.vue'
import AddTransaction from '@/components/transactions/AddTransaction.vue'
import { useGlobalStore } from '@/stores/global.store'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

// Drawer state
const globalStore = useGlobalStore()
const { openTransactionModal } = storeToRefs(globalStore)
const openMenuModal = ref<boolean>(false)

const finishTransactionAndDismiss = () => {
  openTransactionModal.value = false
  document.body.style.pointerEvents = 'auto'
}
</script>

<style scoped>
.bg-image {
  background: linear-gradient(180deg, #0b0e1a, #1a1446);
  z-index: 10;
}

.scrollbar-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>
