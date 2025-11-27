// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useUserStore } from './stores/userStore'

// Tailwind CSS
import './assets/tailwind.css'
import './assets/styles/buttons.css'
import './assets/styles/loading.css'
// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUser, 
  faMagnifyingGlass, 
  faBell, 
  faBolt, 
  faGem, 
  faHouse, 
  faArrowRightFromBracket, 
  faRightToBracket 
} from '@fortawesome/free-solid-svg-icons'

// Thêm vào library
library.add(
  faUser, 
  faMagnifyingGlass, 
  faBell, 
  faBolt, 
  faGem, 
  faHouse, 
  faArrowRightFromBracket, 
  faRightToBracket
)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Đăng ký FontAwesome component toàn cục
app.component('font-awesome-icon', FontAwesomeIcon)

// Load user từ cookie
const userStore = useUserStore()
await userStore.loadUserFromCookies()

app.mount('#app')
