<!-- src/views/UserView.vue (updated: hide Username and Password fields in add mode; adjust handleSubmit for AddNewUserRequest) -->
<template>
  <!-- Loading Spinner -->
  <div v-if="loading" class="flex justify-center items-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 shadow-lg"></div>
  </div>

  <!-- Error Message -->
  <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-sm animate-pulse">
    {{ error }}
    <button @click="clearError" class="float-right text-red-500 hover:text-red-700 transition-colors duration-200">×</button>
  </div>

  <!-- Users Table -->
  <div v-else-if="users && users.data.length > 0" class="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
    <!-- Header with Add Button -->
    <div class="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <i class="fa-solid fa-users text-2xl text-blue-600"></i>
        <h2 class="text-2xl font-bold text-gray-900">Danh sách tài khoản</h2>
      </div>
      <button
        @click="openAddModal"
        class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-md"
      >
        <i class="fa-solid fa-plus"></i>
        <span>Thêm tài khoản</span>
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tên đăng nhập</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Họ tên</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Vai trò</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users.data" :key="user.Username" class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 animate-fade-in">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 bg-gray-50 rounded-l-lg">{{ user.Username }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ user.FullName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{{ user.RoleName }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 rounded-r-lg">
              <button
                @click="openEditModal(user)"
                class="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <i class="fa-solid fa-edit mr-1"></i> Sửa
              </button>
              <button
                @click="confirmDelete(user.Username)"
                class="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <i class="fa-solid fa-trash mr-1"></i> Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="px-6 py-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Hiển thị <span class="font-bold text-gray-900">{{ (users.pageIndex - 1) * users.pageSize + 1 }}</span> đến
        <span class="font-bold text-gray-900">{{ Math.min(users.pageIndex * users.pageSize, users.totalCounts) }}</span> của
        <span class="font-bold text-gray-900">{{ users.totalCounts }}</span> kết quả
      </div>
      <div class="flex space-x-2">
        <button
          @click="changePage(users.pageIndex - 1)"
          :disabled="users.pageIndex === 1"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          <i class="fa-solid fa-chevron-left mr-1"></i> Trước
        </button>
        <button
          @click="changePage(i)"
          v-for="i in Math.min(5, users.totalPages)"
          :key="i"
          :class="[
            'px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105',
            i === users.pageIndex ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-gray-700 bg-white hover:bg-gray-50'
          ]"
        >
          {{ i }}
        </button>
        <span v-if="users.totalPages > 5" class="px-4 py-2 text-sm text-gray-500">...</span>
        <button
          v-if="users.totalPages > 5"
          @click="changePage(users.totalPages)"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
        >
          {{ users.totalPages }}
        </button>
        <button
          @click="changePage(users.pageIndex + 1)"
          :disabled="users.isLastPage()"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          Sau <i class="fa-solid fa-chevron-right mr-1"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else-if="users && users.totalCounts === 0" class="text-center py-16 bg-white rounded-2xl shadow-xl">
    <i class="fa-solid fa-users text-6xl text-gray-300 mb-6 animate-bounce"></i>
    <h3 class="text-2xl font-bold text-gray-900 mb-3">Chưa có tài khoản nào</h3>
    <p class="text-gray-500 mb-6 text-lg">Bắt đầu bằng cách thêm tài khoản đầu tiên.</p>
    <button
      @click="openAddModal"
      class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-md"
    >
      <i class="fa-solid fa-plus mr-2"></i> Thêm tài khoản
    </button>
  </div>

  <!-- Add/Edit User Modal -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
      <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 class="text-xl font-bold text-gray-900">
          {{ isEditMode ? 'Sửa tài khoản' : 'Thêm tài khoản mới' }}
        </h3>
        <p v-if="!isEditMode" class="text-sm text-gray-500 mt-1">Tên đăng nhập và mật khẩu sẽ được tạo tự động.</p>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Username field only in edit mode -->
        <div v-if="isEditMode" class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Tên đăng nhập</label>
          <input
            v-model="formData.Username"
            type="text"
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-200"
            disabled
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Họ tên</label>
          <input
            v-model="formData.FullName"
            type="text"
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Vai trò</label>
          <select
            v-model="formData.RoleId"
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">Chọn vai trò</option>
            <option v-for="role in roleStore.getRoles" :key="role.RoleId" :value="role.RoleId">
              {{ role.RoleName }}
            </option>
          </select>
        </div>
        <!-- Password field only in edit mode (optional) -->
        <div v-if="isEditMode" class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Mật khẩu mới (tùy chọn)</label>
          <p class="text-xs text-gray-500">Để lại trống nếu không muốn thay đổi mật khẩu.</p>
          <input
            v-model="formData.Password"
            type="password"
            placeholder="Nhập mật khẩu mới..."
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <div class="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="submitting || roleStore.isLoading"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-md"
          >
            <i v-if="submitting || roleStore.isLoading" class="fa-solid fa-spinner fa-spin"></i>
            <span>{{ isEditMode ? 'Cập nhật' : 'Thêm' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div class="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-t-2xl">
        <h3 class="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
        <p class="text-gray-600">Bạn có chắc chắn muốn xóa tài khoản <strong class="text-red-600">{{ deleteUsername }}</strong>? Hành động này không thể hoàn tác.</p>
      </div>
      <div class="p-6 border-t border-gray-200">
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-6 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
          >
            Hủy
          </button>
          <button
            @click="handleDelete"
            class="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/application/stores/UserStore";
import { useRoleStore } from "@/application/stores/RoleStore";
import type { UserResponse } from "@/domain/entities/UserDTOs/UserResponse";
import { UserRequest } from "@/domain/entities/UserDTOs/UserRequest";
import { AddNewUserRequest } from "@/domain/entities/UserDTOs/AddNewUserRequest";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";

const userStore = useUserStore();
const roleStore = useRoleStore();

const { users, loading, error } = storeToRefs(userStore);
const { getAllUsers, addUser, updateUser, deleteUser, clearError } = userStore;

const showModal = ref(false);
const isEditMode = ref(false);
const submitting = ref(false);
const formData = ref<Partial<UserRequest>>({
  Username: "",
  FullName: "",
  RoleId: "",
  Password: "",
});

const showDeleteModal = ref(false);
const deleteUsername = ref("");

// Load users with default params
onMounted(() => {
  getAllUsers({ pageIndex: 1, pageSize: 10 });
});

// Pagination
const changePage = (page: number) => {
  if (page >= 1 && page <= (users.value?.totalPages || 1)) {
    getAllUsers({ pageIndex: page, pageSize: users.value?.pageSize || 10 });
  }
};

// Modal handlers
const openAddModal = async () => {
  isEditMode.value = false;
  formData.value = { FullName: "", RoleId: "" };
  await roleStore.getAllRoles({ pageIndex: 1, pageSize: 1000 }); // Load all roles with large pageSize
  showModal.value = true;
};

const openEditModal = async (user: UserResponse) => {
  isEditMode.value = true;
  formData.value = { 
    Username: user.Username, 
    FullName: user.FullName, 
    RoleId: user.RoleId, 
    Password: "" 
  };
  await roleStore.getAllRoles({ pageIndex: 1, pageSize: 1000 }); // Load all roles with large pageSize
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  submitting.value = false;
  formData.value.Password = ""; // Reset password field
};

const handleSubmit = async () => {
  if (!formData.value.FullName || !formData.value.RoleId) return;

  submitting.value = true;
  try {
    if (isEditMode.value) {
      // Use UserRequest for update (Password optional/empty if unchanged)
      const updateRequest = new UserRequest({
        Username: formData.value.Username || "",
        Password: formData.value.Password || "",
        FullName: formData.value.FullName,
        RoleId: formData.value.RoleId
      });
      await updateUser(updateRequest);
    } else {
      // Use AddNewUserRequest for add (only FullName and RoleId)
      const addRequest = new AddNewUserRequest({
        FullName: formData.value.FullName,
        RoleId: formData.value.RoleId
      });
      await addUser(addRequest);
    }
    closeModal();
    // Refetch with default params
    getAllUsers({ pageIndex: 1, pageSize: 10 });
  } catch (err: any) {
    // Error đã set trong store
    console.error(err);
  } finally {
    submitting.value = false;
  }
};

// Delete handlers
const confirmDelete = (username: string) => {
  deleteUsername.value = username;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    await deleteUser(deleteUsername.value);
    showDeleteModal.value = false;
    // Refetch with default params
    getAllUsers({ pageIndex: 1, pageSize: 10 });
  } catch (err: any) {
    // Error đã set trong store
    console.error(err);
  }
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