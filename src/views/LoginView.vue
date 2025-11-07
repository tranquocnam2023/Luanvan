<!-- src/views/LoginView.vue (updated handleLogin to route to home) -->
<template>
  <div
    class="flex items-center justify-center min-h-screen w-full bg-center bg-cover bg-no-repeat"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div
      class="bg-white shadow-2xl rounded-2xl w-[380px] p-8 flex flex-col items-center"
    >
      <!-- Logo -->
      <div class="mb-6 flex flex-col items-center">
        <img src="@/assets/logo.png" alt="Logo" class="h-full mb-2" />
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="w-full space-y-4">
        <div>
          <label class="block text-gray-600 text-sm mb-1">Tài khoản</label>
          <div class="relative">
            <input
              v-model="username"
              type="text"
              placeholder="Tài khoản"
              class="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              :disabled="loading"
            />
            <i class="fa-solid fa-user absolute left-3 top-2.5 text-gray-400"></i>
          </div>
        </div>

        <div>
          <label class="block text-gray-600 text-sm mb-1">Mật khẩu</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mật khẩu"
              class="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              :disabled="loading"
            />
            <i class="fa-solid fa-lock absolute left-3 top-2.5 text-gray-400"></i>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              :disabled="loading"
            >
              <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white rounded-lg py-2 mt-2 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>

        <!-- Error message -->
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import bgImage from "@/assets/bg.png";
import { useAuthStore } from "@/application/stores/AuthStore";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const showPassword = ref(false);

const loading = computed(() => authStore.isLoading);
const error = computed(() => authStore.error);

const handleLogin = async () => {
  if (!username.value || !password.value) {
    authStore.error = "Vui lòng nhập tài khoản và mật khẩu";
    return;
  }

  await authStore.login(username.value, password.value);

  if (authStore.isAuthenticated) {
    // Redirect to home route after successful login
    router.push({ name: "home" }); // Updated to home
  }
};
</script>

<style>
/* Font Awesome import global */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");
</style>