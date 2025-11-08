<!-- src/views/HomeView.vue -->
<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">
      Chào mừng đến với Hệ thống Quản lý Điện tử
    </h2>
    <p class="text-gray-600 mb-4">
      Chọn một mục từ menu bên trái để bắt đầu quản lý.
    </p>

    <!-- Thông tin tổng quan -->
    <div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <div class="bg-blue-50 p-4 rounded-lg shadow text-center">
        <p class="text-sm text-gray-600">Tổng tài khoản</p>
        <h3 class="text-2xl font-bold text-blue-600">{{ overview.totalUsers }}</h3>
      </div>

      <div class="bg-green-50 p-4 rounded-lg shadow text-center">
        <p class="text-sm text-gray-600">Tổng loại hàng hóa</p>
        <h3 class="text-2xl font-bold text-green-600">{{ overview.totalCategories }}</h3>
      </div>

      <div class="bg-yellow-50 p-4 rounded-lg shadow text-center">
        <p class="text-sm text-gray-600">Tổng nhà cung cấp</p>
        <h3 class="text-2xl font-bold text-yellow-600">{{ overview.totalSuppliers }}</h3>
      </div>

      <div class="bg-purple-50 p-4 rounded-lg shadow text-center">
        <p class="text-sm text-gray-600">Tổng sản phẩm</p>
        <h3 class="text-2xl font-bold text-purple-600">{{ overview.totalProducts }}</h3>
      </div>
    </div>

    <div v-else class="text-gray-500 mt-6">Đang tải dữ liệu...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { DashboardRepository } from "@/infrastructure/repositories/DashboardRepository";

const dashboardRepo = new DashboardRepository();
const overview = ref({ totalUsers: 0, totalCategories: 0, totalSuppliers: 0, totalProducts: 0 });
const loading = ref(true);

onMounted(async () => {
  try {
    overview.value = await dashboardRepo.getOverview();
  } catch (error: any) {
    console.error("Lỗi khi tải Dashboard:", error.message);
  } finally {
    loading.value = false;
  }
});
</script>
