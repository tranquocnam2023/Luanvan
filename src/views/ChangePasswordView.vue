<!-- src/views/ChangePasswordView.vue (enhanced styling: better form focus states, gradients, validation icons, smooth animations) -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
    <div class="max-w-md mx-auto">
      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 shadow-sm animate-pulse">
        {{ error }}
        <button @click="clearError" class="float-right text-red-500 hover:text-red-700 transition-colors">×</button>
      </div>

      <!-- Success Message -->
      <div v-else-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 shadow-sm animate-bounce">
        Mật khẩu đã được cập nhật thành công! Vui lòng đăng nhập lại.
        <button @click="handleSuccess" class="float-right text-green-500 hover:text-green-700 transition-colors">×</button>
      </div>

      <!-- Change Password Form -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
        <!-- Header with Gradient -->
        <div class="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <h2 class="text-xl font-bold">Đổi mật khẩu</h2>
          <p class="text-purple-100 text-sm mt-1">Cập nhật mật khẩu an toàn cho tài khoản của bạn</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleChangePassword" class="p-6 space-y-5">
          <!-- Current Password -->
          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
            <div class="relative">
              <input
                v-model="formData.currentPassword"
                type="password"
                required
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-purple-500 transition-all duration-200"
                placeholder="Nhập mật khẩu hiện tại"
              />
              <i class="fa-solid fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <!-- New Password -->
          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
            <div class="relative">
              <input
                v-model="formData.newPassword"
                type="password"
                required
                minlength="6"
                :class="[
                  'w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200',
                  formData.newPassword.length >= 6 ? 'border-green-500' : 'border-gray-200 focus:border-purple-500'
                ]"
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              />
              <i class="fa-solid fa-lock-open absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <p v-if="formData.newPassword && formData.newPassword.length < 6" class="text-xs text-red-500 mt-1 flex items-center">
              <i class="fa-solid fa-exclamation-circle mr-1"></i>
              Mật khẩu phải có ít nhất 6 ký tự.
            </p>
            <p v-else-if="formData.newPassword" class="text-xs text-green-500 mt-1 flex items-center">
              <i class="fa-solid fa-check-circle mr-1"></i>
              Mật khẩu hợp lệ!
            </p>
          </div>

          <!-- Confirm New Password -->
          <div class="relative">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
            <div class="relative">
              <input
                v-model="formData.confirmPassword"
                type="password"
                required
                :class="[
                  'w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200',
                  formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'border-green-500' : 'border-gray-200 focus:border-purple-500'
                ]"
                placeholder="Nhập lại mật khẩu mới"
              />
              <i class="fa-solid fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <p v-if="formData.confirmPassword && formData.newPassword !== formData.confirmPassword" class="text-xs text-red-500 mt-1 flex items-center">
              <i class="fa-solid fa-exclamation-triangle mr-1"></i>
              Mật khẩu xác nhận không khớp.
            </p>
            <p v-else-if="formData.confirmPassword" class="text-xs text-green-500 mt-1 flex items-center">
              <i class="fa-solid fa-check-circle mr-1"></i>
              Xác nhận thành công!
            </p>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$router.go(-1)"
              class="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all duration-200 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="submitting || !isFormValid"
              class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 font-medium"
            >
              <i v-if="submitting" class="fa-solid fa-spinner fa-spin"></i>
              <span>Cập nhật mật khẩu</span>
            </button>
          </div>
        </form>
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
import type { UserRequest } from "@/domain/entities/UserDTOs/UserRequest";

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const { loading, error } = storeToRefs(userStore);
const { updateUser, clearError: storeClearError } = userStore;

const submitting = ref(false);
const success = ref(false);

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const formData = ref<ChangePasswordForm>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const isFormValid = computed(() => {
  return (
    formData.value.currentPassword &&
    formData.value.newPassword.length >= 6 &&
    formData.value.newPassword === formData.value.confirmPassword
  );
});

onMounted(() => {
  const currentUsername = authStore.user?.data?.Username || "";
  if (!currentUsername) {
    router.push("/home");
  }
});

const handleChangePassword = async () => {
  if (!isFormValid.value) return;

  submitting.value = true;
  try {
    const submitData: UserRequest = {
      Username: authStore.user?.data?.Username || "",
      FullName: authStore.user?.data?.FullName || "",
      RoleId: authStore.user?.data?.RoleId || "",
      Password: formData.value.newPassword,
    };
    await updateUser(submitData);
    
    success.value = true;
    setTimeout(() => {
      authStore.logout();
      router.push({ name: "login" });
    }, 2000);
  } catch (err: any) {
    console.error(err);
  } finally {
    submitting.value = false;
  }
};

const handleSuccess = () => {
  success.value = false;
};

const clearError = () => {
  storeClearError();
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");
</style>