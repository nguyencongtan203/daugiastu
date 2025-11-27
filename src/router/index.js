import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import Home from '../views/Home.vue'
import Auction from '../components/Auction.vue'
import AuctionRoom from '../views/AuctionRoom.vue'
import UserInfo from '../views/UserInfo.vue'      
import RegisterProduct from '@/views/RegisterProduct.vue'
import ProductMana from '@/views/ProductMana.vue'
import AuctionDetail from '@/views/AuctionDetail.vue'
import PaymentMana from '@/views/PaymentMana.vue' 
import VerifySuccess from '@/views/VerifySuccess.vue'
import PaymentSuccess from '@/views/PaymentSuccess.vue'
import RegisteredAuctions from '@/views/RegisteredAuction.vue'
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/auction-room', name: 'AuctionRoom', component: AuctionRoom },
  { path: '/auction', name: 'Auction', component: Auction, meta: { requiresAuth: true } },
  { path: '/user-info', name: 'UserInfo', component: UserInfo, meta: { requiresAuth: true } },
  { path: '/register-product', name: 'RegisterProduct', component: RegisterProduct, meta: { requiresAuth: true } },
  { path: '/product-management', name: 'ProductManagement', component: ProductMana, meta: { requiresAuth: true } },
  { path: '/auction-detail/:id', name: 'AuctionDetail', component: AuctionDetail},
  { path: '/payment-management', name: 'PaymentMana', component: PaymentMana, meta: { requiresAuth: true } },
  { path: '/verify-success', name: 'VerifySuccess', component: VerifySuccess, meta: { requiresAuth: true } },
  { path: '/payment-success', name: 'PaymentSuccess', component: PaymentSuccess, meta: { requiresAuth: true } },
  { path: '/registered-auctions', name: 'RegisteredAuctions', component: RegisteredAuctions, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

//Kiểm tra quyền truy cập
router.beforeEach((to, from, next) => {
  const token = Cookies.get('jwt_token')

  if (to.meta.requiresAuth && !token) {
    next('/') 
  } else {
    next()
  }
})

export default router
