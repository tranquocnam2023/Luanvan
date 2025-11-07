// src/router/index.ts (Fixed: Removed leading '/' from child paths to ensure relative routing; /products now correctly renders ProductList without redirecting to home/dashboard)
import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue' // Nội dung chính
import UserView from '@/views/UserView.vue' // Nội dung chính (quản lý tài khoản)
import CategoryView from '@/views/CategoryView.vue' // Nội dung chính (quản lý loại hàng hóa)
import SupplierView from '@/views/SupplierView.vue' // Nội dung chính (quản lý nhà cung cấp)
import ProductView from '@/views/ProductView.vue' // Parent cho products - <router-view> xử lý tất cả
import ProfileView from '@/views/ProfileView.vue' // Nội dung chính (hồ sơ cá nhân)
import ChangePasswordView from '@/views/ChangePasswordView.vue' // Nội dung chính (đổi mật khẩu)
import { useAuthStore } from '@/application/stores/AuthStore'
import Layout from '@/components/Layout.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ProductList from '@/views/ProductList.vue' // Import cho child route list
import RoleView from '@/views/RoleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Route login (không dùng Layout)
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    // Parent route với Layout cho các trang đã auth
    {
      path: '/',
      component: Layout,
      meta: { requiresAuth: true }, // Áp dụng auth cho parent (lan tỏa đến children)
      children: [
        // Redirect path rỗng về home
        {
          path: '',
          redirect: 'home',
        },
        // Trang chủ (Dashboard)
        {
          path: 'home', // FIX: Bỏ leading '/', relative to parent "/"
          name: 'home',
          component: HomeView,
          meta: { requiresAuth: true },
        },
        // Quản lý tài khoản
        {
          path: 'accounts', // FIX: Bỏ leading '/'
          name: 'accounts',
          component: UserView,
          meta: { requiresAuth: true },
        },
        // Quản lý vai trò
        {
          path: 'roles',
          name: 'roles',
          component: RoleView,
          meta: { requiresAuth: true },
        },
        // Quản lý loại hàng hóa
        {
          path: 'product-types', // FIX: Bỏ leading '/'
          name: 'product-types',
          component: CategoryView,
          meta: { requiresAuth: true },
        },
        // Quản lý nhà cung cấp
        {
          path: 'suppliers', // FIX: Bỏ leading '/'
          name: 'suppliers',
          component: SupplierView,
          meta: { requiresAuth: true },
        },
        // Quản lý sản phẩm (parent route: list/detail/create là children)
        {
          path: 'products',
          component: ProductView, // giữ parent router-view
          meta: { requiresAuth: true },
          children: [
            {
              path: '', // khi truy cập /products
              name: 'products', // ✅ đặt name tại đây, không ở parent
              component: ProductList, // mặc định render danh sách
            },
            {
              path: 'list',
              name: 'product-list',
              component: ProductList,
            },
            {
              path: 'create',
              name: 'product-create',
              component: ProductDetailView,
            },
            {
              path: ':id',
              name: 'product-detail',
              component: ProductDetailView,
            },
          ],
        },

        // Hồ sơ cá nhân
        {
          path: 'profile', // FIX: Bỏ leading '/'
          name: 'profile',
          component: ProfileView,
          meta: { requiresAuth: true },
        },
        // Đổi mật khẩu
        {
          path: 'change-password', // FIX: Bỏ leading '/'
          name: 'change-password',
          component: ChangePasswordView,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

// Global navigation guard
router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()

  // Nếu route cần auth và user chưa đăng nhập, redirect về login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  }
  // Nếu truy cập login nhưng đã auth, redirect về home
  else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'home' })
  }
  // Ngược lại, tiếp tục
  else {
    next()
  }
})

export default router
