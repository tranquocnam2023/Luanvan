import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import './assets/main.css'  // Tailwind CSS v3
const app = createApp(App)

app.use(createPinia())
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate );
app.use(router)

app.mount('#app')
