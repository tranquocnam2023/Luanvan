<!-- src/views/ProductView.vue (Parent for /products - renders children: list/create/detail) -->
<template>
  <div class="min-h-full space-y-6">
    <!-- BẮT BUỘC: Render child routes -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();  // Để dùng trong template nếu cần
</script>

<style scoped>
/* Styles tùy chọn */
</style>