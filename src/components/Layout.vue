<!-- src/layouts/Layout.vue (toned down header: removed shadow, gradient overlay, made it flat and normal; added case for 'products' route in pageTitle for default /products access; added role-based permissions based on localStorage user/role) -->
<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Sidebar -->
    <aside class="bg-white shadow-2xl flex flex-col transition-all duration-500 ease-in-out"
      :class="{ 'w-64': isSidebarOpen, 'w-20': !isSidebarOpen }">
      <!-- Logo -->
      <div class="p-4 border-b border-gray-100 flex items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-5"></div>
        <img v-if="isSidebarOpen" src="@/assets/logo.png" alt="Electronic Management System"
          class="h-12 z-10 relative" />
        <img v-else src="@/assets/logo_mini.png" alt="Electronic Management System" class="h-12 z-10 relative" />
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
        <!-- Dashboard (always visible if authenticated) -->
        <router-link to="/home"
          class="group flex items-center px-3 py-3 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
          :class="{ 'justify-center': !isSidebarOpen }"
          active-class="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 shadow-md">
          <i class="fa-solid fa-gauge-high text-lg group-hover:rotate-12 transition-transform"></i>
          <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap font-medium transition-all duration-300">
            Dashboard
          </span>
        </router-link>

        <!-- Danh mục (with sub-menu) - Conditionally shown based on permissions -->
        <div class="space-y-2" v-if="showCategories">
          <button @click="toggleCategories"
            class="group w-full flex items-center px-3 py-3 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md"
            :class="{ 'justify-center': !isSidebarOpen }">
            <i class="fa-solid fa-list text-lg group-hover:rotate-12 transition-transform"
              :class="{ 'mr-3': isSidebarOpen }"></i>
            <span v-if="isSidebarOpen" class="whitespace-nowrap font-medium transition-all duration-300">
              Danh mục
            </span>
            <i v-if="isSidebarOpen" class="fa-solid ml-auto text-lg transition-transform duration-300" :class="[
              categoriesOpen ? 'fa-angle-down rotate-180' : 'fa-angle-right'
            ]"></i>
          </button>

          <!-- Sub-menu for Danh mục -->
          <div v-if="isSidebarOpen" :class="[
            'space-y-2 transition-all duration-500 ease-in-out overflow-hidden',
            { 'max-h-0 py-0 opacity-0': !categoriesOpen, 'max-h-[500px] py-2 opacity-100': categoriesOpen }
          ]" class="pl-6 border-l-2 border-blue-200">
            <router-link to="/accounts"
              class="group flex items-center px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-1"
              active-class="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 shadow-inner"
              v-if="canManageAccounts">
              <i class="fa-solid fa-users text-sm mr-3 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium">Quản lý tài khoản</span>
            </router-link>

            <router-link to="/roles"
              class="group flex items-center px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-1"
              active-class="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 shadow-inner"
              v-if="canManageRoles">
              <i class="fa-solid fa-user-shield text-sm mr-3 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium">Quản lý quyền</span>
            </router-link>

            <router-link to="/product-types"
              class="group flex items-center px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-1"
              active-class="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 shadow-inner"
              v-if="canManageProductTypes">
              <i class="fa-solid fa-tags text-sm mr-3 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium">Quản lý loại hàng hóa</span>
            </router-link>

            <router-link to="/suppliers"
              class="group flex items-center px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-1"
              active-class="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 shadow-inner"
              v-if="canManageSuppliers">
              <i class="fa-solid fa-industry text-sm mr-3 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium">Quản lý nhà cung cấp</span>
            </router-link>

            <router-link to="/products"
              class="group flex items-center px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300 transform hover:translate-x-1"
              active-class="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 shadow-inner"
              v-if="canManageProducts">
              <i class="fa-solid fa-box text-sm mr-3 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium">Quản lý sản phẩm</span>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Logout (always visible if authenticated) -->
      <div class="p-4 border-t border-gray-100 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-5"></div>
        <button @click="handleLogout"
          class="group w-full flex items-center justify-center px-3 py-3 text-red-600 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md relative z-10"
          :class="{ 'justify-center': !isSidebarOpen }">
          <i class="fa-solid fa-right-from-bracket text-lg group-hover:rotate-180 transition-transform"></i>
          <span v-if="isSidebarOpen" class="ml-3 whitespace-nowrap font-medium transition-all duration-300">
            Đăng xuất
          </span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col transition-all duration-500 ease-in-out">
      <!-- Top Navbar (toned down: flat, no shadow/gradient) -->
      <header class="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
        <div class="flex items-center space-x-4">
          <!-- Sidebar Toggle Button -->
          <button @click="toggleSidebar"
            class="group p-2.5 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-all duration-300">
            <i :class="isSidebarOpen ? 'fa-solid fa-bars' : 'fa-solid fa-bars-staggered'"
              class="text-lg group-hover:rotate-90 transition-transform"></i>
          </button>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ pageTitle }}
          </h1>
        </div>
        <div class="relative flex items-center space-x-4">
          <!-- User Avatar and Name - Clickable -->
          <div ref="userTrigger" @click="toggleUserDropdown"
            class="group flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all duration-300 user-dropdown-trigger">
            <div class="relative">
              <img
                :src="`https://ui-avatars.com/api/?name=${user?.data?.FullName || 'User'}&background=6366F1&color=fff&size=72`"
                alt="avatar" class="w-10 h-10 rounded-full ring-2 ring-white" />
              <div class="absolute -bottom-0.5 -right-0.5 bg-green-500 w-4 h-4 rounded-full border-2 border-white">
              </div>
            </div>
            <span class="text-base font-semibold text-gray-900 hidden sm:block">{{ user?.data?.FullName ||
              'Administrator' }}</span>
          </div>

          <!-- User Dropdown Popup (like MS Word style, enhanced) -->
          <div v-if="showUserDropdown"
            class="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 animate-fade-in-scale user-dropdown-menu"
            @click.stop>
            <!-- Profile Option -->
            <router-link to="/profile"
              class="group block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-300"
              @click="showUserDropdown = false">
              <div class="flex items-center">
                <i class="fa-solid fa-user text-blue-500 mr-3 group-hover:rotate-12 transition-transform"></i>
                <span class="font-medium">Hồ sơ cá nhân</span>
              </div>
            </router-link>
            <!-- Change Password Option -->
            <router-link to="/change-password"
              class="group block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-300"
              @click="showUserDropdown = false">
              <div class="flex items-center">
                <i class="fa-solid fa-lock text-purple-500 mr-3 group-hover:rotate-12 transition-transform"></i>
                <span class="font-medium">Đổi mật khẩu</span>
              </div>
            </router-link>
            <!-- Divider -->
            <div class="border-t border-gray-200 my-1"></div>
            <!-- Logout Option -->
            <button @click="handleLogout"
              class="group w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-300">
              <div class="flex items-center">
                <i class="fa-solid fa-right-from-bracket mr-3 group-hover:rotate-180 transition-transform"></i>
                <span class="font-medium">Đăng xuất</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 p-6 overflow-y-auto bg-gray-50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/application/stores/AuthStore";
import type { RoleResponse } from '@/domain/entities/RoleDTOs/RoleResponse'; // Adjust path as needed
import type { RoleFunctionResponse } from '@/domain/entities/RoleFunctionDTOs/RoleFunctionResponse'; // Adjust path as needed

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isSidebarOpen = ref(true);
const categoriesOpen = ref(true);
const showUserDropdown = ref(false);
const userTrigger = ref<HTMLElement | null>(null);

const user = computed(() => authStore.user);
const role = computed(() => authStore.getRole as RoleResponse | null);

// Permission checks based on RoleFunctions from localStorage-loaded role
const canManageAccounts = computed(() =>
  role.value?.RoleFunctions?.some((rf: RoleFunctionResponse) => rf.FunctionName === 'Quản lý người dùng' && rf.IsActive) || false
);
const canManageRoles = computed(() =>
  role.value?.RoleFunctions?.some((rf: RoleFunctionResponse) => rf.FunctionName === 'Quản lý quyền' && rf.IsActive) || false
);
const canManageProductTypes = computed(() =>
  role.value?.RoleFunctions?.some((rf: RoleFunctionResponse) => rf.FunctionName === 'Quản lý loại hàng hóa' && rf.IsActive) || false
);
const canManageSuppliers = computed(() =>
  role.value?.RoleFunctions?.some((rf: RoleFunctionResponse) => rf.FunctionName === 'Quản lý nhà cung cấp' && rf.IsActive) || false
);
const canManageProducts = computed(() =>
  role.value?.RoleFunctions?.some((rf: RoleFunctionResponse) => rf.FunctionName === 'Quản lý hàng hóa' && rf.IsActive) || false
);

// Show "Danh mục" section if any sub-permission is granted
const showCategories = computed(() =>
  [canManageAccounts, canManageRoles, canManageProductTypes, canManageSuppliers, canManageProducts].some((perm) => perm.value)
);

// Dynamic page title based on route (added case for 'products' default)
const pageTitle = computed(() => {
  switch (route.name) {
    case 'home':
      return 'Dashboard';
    case 'accounts':
      return 'Quản lý tài khoản';
    case 'product-types':
      return 'Quản lý loại hàng hóa';
    case 'suppliers':
      return 'Quản lý nhà cung cấp';
    case 'products':  // FIX: For default /products access (before redirect to list)
    case 'product-list':
      return 'Quản lý sản phẩm';
    case 'product-create':
      return 'Thêm sản phẩm';
    case 'product-detail':
      return 'Chi tiết sản phẩm';
    case 'profile':
      return 'Hồ sơ cá nhân';
    case 'change-password':
      return 'Đổi mật khẩu';
    case 'roles':
      return 'Quản lý quyền';
    default:
      return 'Dashboard';
  }
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  if (!isSidebarOpen.value) {
    categoriesOpen.value = false;
  }
};

const toggleCategories = () => {
  if (showCategories.value) {
    categoriesOpen.value = !categoriesOpen.value;
  }
};

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value;
};

// Close dropdown when clicking outside (improved with ref)
const handleClickOutside = (event: MouseEvent) => {
  if (showUserDropdown.value && userTrigger.value && !userTrigger.value.contains(event.target as Node)) {
    showUserDropdown.value = false;
  }
};

onMounted(() => {
  nextTick(() => {
    document.addEventListener('click', handleClickOutside);
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
  showUserDropdown.value = false;
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");

.animate-fade-in-scale {
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Ensure dropdown is above other elements */
.user-dropdown-menu {
  z-index: 1000 !important;
}

.user-dropdown-trigger {
  position: relative;
  z-index: 999;
}
</style>
