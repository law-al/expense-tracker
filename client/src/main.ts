import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ui from '@nuxt/ui/vue-plugin'

import App from './App.vue'
import router from './router'
import AppLayout from './layouts/app/AppLayout.vue'
import PercentBar from './components/common/PercentBar.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ui)
app.component('AppLayout', AppLayout)
app.component('PercentBar', PercentBar)
app.component('LoadingModal', () => import('@/components/common/LoadingModal.vue'))

app.mount('#app')
