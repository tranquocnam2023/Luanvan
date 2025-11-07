<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">
      Chào mừng đến với Hệ thống Quản lý Điện tử
    </h2>
    <p class="text-gray-600 mb-6">
      Dưới đây là thông tin tổng quan về hệ thống.
    </p>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 text-center py-4">
      <i class="fa-solid fa-spinner fa-spin text-blue-500 mr-2"></i> Đang tải dữ liệu...
    </div>

    <!-- Dashboard Cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-blue-50 p-4 rounded-lg shadow text-center">
        <p class="text-sm text-gray-600">Tổng tài khoản</p>
        <h3 class="text-2xl font-bold text-blue-600">{{ totalUsers }}</h3>
      </div>

      <div class="bg-green-50 p-4 rounded-lg shadow text-center">
        <p class="text-sm text-gray-600">Tổng loại hàng hóa</p>
        <h3 class="text-2xl font-bold text-green-600">{{ totalCategories }}</h3>
      </div>

      <div class="bg-yellow-50 p-4 rounded-lg shadow text-center">
        <p class="text-sm text-gray-600">Tổng nhà cung cấp</p>
        <h3 class="text-2xl font-bold text-yellow-600">{{ totalSuppliers }}</h3>
      </div>

      <div class="bg-purple-50 p-4 rounded-lg shadow text-center">
        <p class="text-sm text-gray-600">Tổng sản phẩm</p>
        <h3 class="text-2xl font-bold text-purple-600">{{ totalProducts }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { DashboardRepository } from "@/infrastructure/repositories/DashboardRepository";

const dashboardRepo = new DashboardRepository();

const totalUsers = ref(0);
const totalCategories = ref(0);
const totalSuppliers = ref(0);
const totalProducts = ref(0);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await dashboardRepo.getOverview();
    totalUsers.value = data.totalUsers;
    totalCategories.value = data.totalCategories;
    totalSuppliers.value = data.totalSuppliers;
    totalProducts.value = data.totalProducts;
  } catch (error: any) {
    console.error("Dashboard error:", error.message);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");
</style>
