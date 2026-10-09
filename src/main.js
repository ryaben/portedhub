import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useTheme } from './composables/useTheme'

import './style.css'

const app = createApp(App)
app.use(router)

// Initialize theme
const { currentTheme } = useTheme()
document.documentElement.setAttribute('data-theme', currentTheme.value)

app.mount('#app')
