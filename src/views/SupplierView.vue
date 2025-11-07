<!-- src/views/SupplierView.vue (enhanced with gradients, shadows, animations, better responsive design) -->
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

  <!-- Suppliers Table -->
  <div v-else-if="suppliers && suppliers.data.length > 0" class="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
    <!-- Header with Add Button -->
    <div class="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <i class="fa-solid fa-industry text-2xl text-blue-600"></i>
        <h2 class="text-2xl font-bold text-gray-900">Danh sách nhà cung cấp</h2>
      </div>
      <button
        @click="openAddModal"
        class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-md"
      >
        <i class="fa-solid fa-plus"></i>
        <span>Thêm nhà cung cấp</span>
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mã nhà cung cấp</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tên nhà cung cấp</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Địa chỉ</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Số điện thoại</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="supplier in suppliers.data" :key="supplier.Id" class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 animate-fade-in">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 bg-gray-50 rounded-l-lg">{{ supplier.Id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ supplier.SupplierName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ supplier.SupplierAddress }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ supplier.SupplierPhone }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 rounded-r-lg">
              <button
                @click="openEditModal(supplier)"
                class="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <i class="fa-solid fa-edit mr-1"></i> Sửa
              </button>
              <button
                @click="confirmDelete(supplier.Id)"
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
        Hiển thị <span class="font-bold text-gray-900">{{ (suppliers.pageIndex - 1) * suppliers.pageSize + 1 }}</span> đến
        <span class="font-bold text-gray-900">{{ Math.min(suppliers.pageIndex * suppliers.pageSize, suppliers.totalCounts) }}</span> của
        <span class="font-bold text-gray-900">{{ suppliers.totalCounts }}</span> kết quả
      </div>
      <div class="flex space-x-2">
        <button
          @click="changePage(suppliers.pageIndex - 1)"
          :disabled="suppliers.pageIndex === 1"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          <i class="fa-solid fa-chevron-left mr-1"></i> Trước
        </button>
        <button
          @click="changePage(i)"
          v-for="i in Math.min(5, suppliers.totalPages)"
          :key="i"
          :class="[
            'px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105',
            i === suppliers.pageIndex ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-gray-700 bg-white hover:bg-gray-50'
          ]"
        >
          {{ i }}
        </button>
        <span v-if="suppliers.totalPages > 5" class="px-4 py-2 text-sm text-gray-500">...</span>
        <button
          v-if="suppliers.totalPages > 5"
          @click="changePage(suppliers.totalPages)"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
        >
          {{ suppliers.totalPages }}
        </button>
        <button
          @click="changePage(suppliers.pageIndex + 1)"
          :disabled="suppliers.isLastPage()"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          Sau <i class="fa-solid fa-chevron-right mr-1"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else-if="suppliers && suppliers.totalCounts === 0" class="text-center py-16 bg-white rounded-2xl shadow-xl">
    <i class="fa-solid fa-industry text-6xl text-gray-300 mb-6 animate-bounce"></i>
    <h3 class="text-2xl font-bold text-gray-900 mb-3">Chưa có nhà cung cấp nào</h3>
    <p class="text-gray-500 mb-6 text-lg">Bắt đầu bằng cách thêm nhà cung cấp đầu tiên.</p>
    <button
      @click="openAddModal"
      class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-md"
    >
      <i class="fa-solid fa-plus mr-2"></i> Thêm nhà cung cấp
    </button>
  </div>

  <!-- Add/Edit Supplier Modal -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
      <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 class="text-xl font-bold text-gray-900">
          {{ isEditMode ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới' }}
        </h3>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Id field only in edit mode -->
        <div v-if="isEditMode" class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Mã nhà cung cấp</label>
          <input
            v-model="formData.Id"
            type="text"
            @blur="validateField('Id')"
            :class="[
              'w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed',
              errors.Id ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            ]"
            disabled
          />
          <p v-if="errors.Id" class="text-sm text-red-600 flex items-center">
            <i class="fa-solid fa-exclamation-circle mr-1"></i> {{ errors.Id }}
          </p>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Tên nhà cung cấp</label>
          <input
            v-model="formData.SupplierName"
            type="text"
            @blur="validateField('SupplierName')"
            :class="[
              'w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200',
              errors.SupplierName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            ]"
          />
          <p v-if="errors.SupplierName" class="text-sm text-red-600 flex items-center">
            <i class="fa-solid fa-exclamation-circle mr-1"></i> {{ errors.SupplierName }}
          </p>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Địa chỉ</label>
          <input
            v-model="formData.SupplierAddress"
            type="text"
            @blur="validateField('SupplierAddress')"
            :class="[
              'w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200',
              errors.SupplierAddress ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            ]"
          />
          <p v-if="errors.SupplierAddress" class="text-sm text-red-600 flex items-center">
            <i class="fa-solid fa-exclamation-circle mr-1"></i> {{ errors.SupplierAddress }}
          </p>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Số điện thoại</label>
          <input
            v-model="formData.SupplierPhone"
            type="tel"
            @blur="validateField('SupplierPhone')"
            :class="[
              'w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200',
              errors.SupplierPhone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
            ]"
          />
          <p v-if="errors.SupplierPhone" class="text-sm text-red-600 flex items-center">
            <i class="fa-solid fa-exclamation-circle mr-1"></i> {{ errors.SupplierPhone }}
          </p>
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
            :disabled="submitting || hasErrors"
            class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-md"
          >
            <i v-if="submitting" class="fa-solid fa-spinner fa-spin"></i>
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
        <p class="text-gray-600">Bạn có chắc chắn muốn xóa nhà cung cấp <strong class="text-red-600">{{ deleteId }}</strong>? Hành động này không thể hoàn tác.</p>
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
import { ref, onMounted, reactive, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useSupplierStore } from "@/application/stores/SupplierStore";
import type { SupplierResponse } from "@/domain/entities/SupplierDTOs/SupplierResponse";
import type { SupplierRequest } from "@/domain/entities/SupplierDTOs/SupplierRequest";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";

const supplierStore = useSupplierStore();

const { suppliers, loading, error } = storeToRefs(supplierStore);
const { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier, clearError } = supplierStore;

const showModal = ref(false);
const isEditMode = ref(false);
const submitting = ref(false);
const formData = ref<SupplierRequest>({
  Id: "",
  SupplierName: "",
  SupplierAddress: "",
  SupplierPhone: "",
});

const errors = reactive({
  Id: "",
  SupplierName: "",
  SupplierAddress: "",
  SupplierPhone: "",
});

const showDeleteModal = ref(false);
const deleteId = ref("");

// Validation functions
const validateField = (field: keyof SupplierRequest) => {
  (errors as any)[field] = "";

  switch (field) {
    case 'Id':
      if (!isEditMode.value) return; // Skip Id validation in add mode
      if (!formData.value.Id?.trim()) {
        (errors as any).Id = "Mã nhà cung cấp là bắt buộc.";
      } else if (formData.value.Id.length < 3 || formData.value.Id.length > 20) {
        (errors as any).Id = "Mã nhà cung cấp phải từ 3 đến 20 ký tự.";
      }
      break;
    case 'SupplierName':
      if (!formData.value.SupplierName?.trim()) {
        (errors as any).SupplierName = "Tên nhà cung cấp là bắt buộc.";
      } else if (formData.value.SupplierName.length < 3 || formData.value.SupplierName.length > 100) {
        (errors as any).SupplierName = "Tên nhà cung cấp phải từ 3 đến 100 ký tự.";
      }
      break;
    case 'SupplierAddress':
      if (!formData.value.SupplierAddress?.trim()) {
        (errors as any).SupplierAddress = "Địa chỉ là bắt buộc.";
      } else if (formData.value.SupplierAddress.length < 5 || formData.value.SupplierAddress.length > 200) {
        (errors as any).SupplierAddress = "Địa chỉ phải từ 5 đến 200 ký tự.";
      }
      break;
    case 'SupplierPhone':
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,10}$/;
      if (!formData.value.SupplierPhone?.trim()) {
        (errors as any).SupplierPhone = "Số điện thoại là bắt buộc.";
      } else if (!phoneRegex.test(formData.value.SupplierPhone)) {
        (errors as any).SupplierPhone = "Số điện thoại không hợp lệ (10 ký tự, chỉ số và dấu).";
      }
      break;
  }
};

const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach(key => (errors as any)[key] = "");
  
  if (isEditMode.value) {
    validateField('Id');
  }
  validateField('SupplierName');
  validateField('SupplierAddress');
  validateField('SupplierPhone');

  isValid = Object.values(errors).every(e => e === "");

  return isValid;
};

const hasErrors = computed(() => Object.values(errors).some(e => e !== ""));

// Watch for changes to clear errors on input
watch(() => formData.value.Id, () => { if (errors.Id) errors.Id = ""; });
watch(() => formData.value.SupplierName, () => { if (errors.SupplierName) errors.SupplierName = ""; });
watch(() => formData.value.SupplierAddress, () => { if (errors.SupplierAddress) errors.SupplierAddress = ""; });
watch(() => formData.value.SupplierPhone, () => { if (errors.SupplierPhone) errors.SupplierPhone = ""; });

// Load suppliers with default params
onMounted(() => {
  getAllSuppliers({ pageIndex: 1, pageSize: 10 });
});

// Pagination
const changePage = (page: number) => {
  if (page >= 1 && page <= (suppliers.value?.totalPages || 1)) {
    getAllSuppliers({ pageIndex: page, pageSize: suppliers.value?.pageSize || 10 });
  }
};

// Modal handlers
const openAddModal = () => {
  isEditMode.value = false;
  formData.value = { Id: "", SupplierName: "", SupplierAddress: "", SupplierPhone: "" };
  Object.keys(errors).forEach(key => (errors as any)[key] = "");
  showModal.value = true;
};

const openEditModal = (supplier: SupplierResponse) => {
  isEditMode.value = true;
  formData.value = { 
    Id: supplier.Id, 
    SupplierName: supplier.SupplierName, 
    SupplierAddress: supplier.SupplierAddress, 
    SupplierPhone: supplier.SupplierPhone 
  };
  Object.keys(errors).forEach(key => (errors as any)[key] = "");
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  submitting.value = false;
  Object.keys(errors).forEach(key => (errors as any)[key] = "");
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  submitting.value = true;
  try {
    if (isEditMode.value) {
      await updateSupplier(formData.value);
    } else {
      // For add, create request without Id
      const addRequest = {
        Id: "",
        SupplierName: formData.value.SupplierName,
        SupplierAddress: formData.value.SupplierAddress,
        SupplierPhone: formData.value.SupplierPhone
      };
      await addSupplier(addRequest);
    }
    closeModal();
    // Refetch with default params
    getAllSuppliers({ pageIndex: 1, pageSize: 10 });
  } catch (err: any) {
    // Error đã set trong store
    console.error(err);
  } finally {
    submitting.value = false;
  }
};

// Delete handlers
const confirmDelete = (id: string) => {
  deleteId.value = id;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    await deleteSupplier(deleteId.value);
    showDeleteModal.value = false;
    // Refetch with default params
    getAllSuppliers({ pageIndex: 1, pageSize: 10 });
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