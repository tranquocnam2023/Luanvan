<!-- src/views/Profile.vue (enhanced styling: better gradients, shadows, responsive design, subtle animations) -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="max-w-2xl mx-auto">
      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-sm">
        {{ error }}
        <button @click="clearError" class="float-right text-red-500 hover:text-red-700 transition-colors">×</button>
      </div>

      <!-- Profile Content -->
      <div v-else-if="currentUser" class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02]">
        <!-- Header with Gradient -->
        <div class="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 class="text-xl font-bold">Hồ sơ cá nhân</h2>
          <p class="text-blue-100 text-sm mt-1">Quản lý thông tin cá nhân của bạn</p>
        </div>

        <!-- Profile Info -->
        <div class="p-6 space-y-6">
          <!-- Avatar and Basic Info -->
          <div class="flex items-center space-x-4 animate-fade-in">
            <div class="relative">
              <img
                :src="`https://ui-avatars.com/api/?name=${currentUser.FullName || 'User'}&background=6366F1&color=fff&size=128`"
                alt="avatar"
                class="w-20 h-20 rounded-full shadow-lg ring-4 ring-white"
              />
              <div class="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ currentUser.FullName || 'Không xác định' }}</h3>
              <p class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">@{{ currentUser.Username }}</p>
            </div>
          </div>

          <!-- Role Info -->
          <div class="space-y-3 bg-gray-50 p-4 rounded-xl">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-semibold text-gray-700">Vai trò</label>
              <i class="fa-solid fa-user-shield text-blue-500"></i>
            </div>
            <p class="text-base font-medium text-gray-900 bg-white px-4 py-2 rounded-lg shadow-inner">{{ currentUser.RoleName }}</p>
            <p class="text-xs text-gray-500 italic">Vai trò này được quản lý bởi admin.</p>
          </div>

          <!-- Read-only FullName Display -->
          <div class="space-y-3 bg-gray-50 p-4 rounded-xl">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-semibold text-gray-700">Họ tên</label>
              <i class="fa-solid fa-user text-gray-400"></i>
            </div>
            <p class="text-base font-medium text-gray-900 bg-white px-4 py-2 rounded-lg shadow-inner">{{ currentUser.FullName || 'Không xác định' }}</p>
            <p class="text-xs text-gray-500 italic">Thông tin này được quản lý bởi admin.</p>
          </div>

          <!-- Change Password Link -->
          <div class="pt-4 border-t border-gray-200">
            <router-link
              to="/change-password"
              class="inline-flex items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <i class="fa-solid fa-lock mr-2"></i>
              Đổi mật khẩu
            </router-link>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-2xl shadow-lg">
        <i class="fa-solid fa-user-slash text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy thông tin</h3>
        <p class="text-gray-500 mb-6">Vui lòng kiểm tra lại.</p>
        <button
          @click="reloadProfile"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Tải lại
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/application/stores/UserStore";
import { useAuthStore } from "@/application/stores/AuthStore";
import type { UserResponse } from "@/domain/entities/UserDTOs/UserResponse";

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const { selectedUser: rawCurrentUser, loading, error } = storeToRefs(userStore);
const { getUserById, clearError } = userStore;

const currentUser = computed(() => rawCurrentUser.value);
const currentUsername = computed(() => authStore.user?.data?.Username || "");

// Load current user profile on mount
onMounted(async () => {
  if (currentUsername.value) {
    await loadProfile(currentUsername.value);
  } else {
    router.push("/home");
  }
});

const loadProfile = async (username: string) => {
  await getUserById(username);
};

const reloadProfile = () => {
  loadProfile(currentUsername.value);
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>