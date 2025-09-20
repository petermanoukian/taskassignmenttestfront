import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import './assets/main.css' 
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();

pinia.use(piniaPluginPersistedState);


app.use(pinia)
app.use(router)


// Create a new instance of Echo and configure it to connect to your Reverb server.



app.mount('#app')
