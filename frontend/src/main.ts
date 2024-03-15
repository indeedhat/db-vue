import { createApp } from 'vue'
import { createPinia } from 'pinia'
import  piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import vueClickOutsideElement from 'vue-click-outside-element'

import App from './App.vue'
import router from './router'

import './assets/main.css';

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

const app = createApp(App)
app.use(vueClickOutsideElement)
app.use(pinia)
app.use(router)
app.mount('#app')
