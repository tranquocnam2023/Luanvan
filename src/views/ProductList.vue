<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-white border-b px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <i class="fa-solid fa-box text-blue-600"></i> Quản lý hàng hóa
      </h1>
      <button
        @click="navigateToCreate"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium"
      >
        <i class="fa-solid fa-plus"></i> Thêm vào product
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="bg-gray-50 border-b px-6 py-3 flex flex-wrap gap-3 items-center">
      <input
        v-model="filterProductId"
        type="text"
        placeholder="Lọc theo ProductId"
        class="px-3 py-2 border rounded-md text-sm w-40"
      />
      <input
        v-model="filterProductName"
        type="text"
        placeholder="Lọc theo ProductName"
        class="px-3 py-2 border rounded-md text-sm w-56"
      />
      <input
        v-model="filterSupplierId"
        type="text"
        placeholder="Lọc theo SupplierId"
        class="px-3 py-2 border rounded-md text-sm w-40"
      />
      <button
        @click="applyFilters"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1"
      >
        <i class="fa-solid fa-filter"></i>
        Đi đến
      </button>
      <span class="text-gray-500 text-sm ml-2">
        {{ filteredProducts.length }} / {{ totalProducts }} kết quả
      </span>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto px-6 py-4">
      <!-- Loading -->
      <div v-if="store.isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
      </div>

      <!-- Error -->
      <div
        v-else-if="store.hasError"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
      >
        Lỗi: {{ store.error }}
      </div>

      <!-- Empty -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-16 text-gray-500">
        Không có sản phẩm nào.
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto bg-white rounded-lg shadow border">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr class="text-gray-600 text-left">
              <th class="px-4 py-3 w-10">
                <input type="checkbox" :checked="isAllPageChecked" @change="toggleCheckAll" />
              </th>
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">ProductId</th>
              <th class="px-4 py-3">ProductName</th>
              <th class="px-4 py-3">BasePrice</th>
              <th class="px-4 py-3">CategoryId</th>
              <th class="px-4 py-3">ThumbnailUrl</th>
              <th class="px-4 py-3">IsVariant</th>
              <th class="px-4 py-3">SupplierId</th>
              <th class="px-4 py-3 text-center w-28">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(p, index) in pagedProducts"
              :key="p.ProductId"
              class="border-b hover:bg-blue-50 cursor-pointer"
              @click="goDetail(p.ProductId)"
            >
              <td class="px-4 py-3" @click.stop>
                <input type="checkbox" :value="p.ProductId" v-model="selectedIds" />
              </td>
              <td class="px-4 py-3">{{ index + 1 + (currentPage - 1) * pageSize }}</td>
              <td class="px-4 py-3 font-mono text-blue-700">{{ p.ProductId }}</td>
              <td class="px-4 py-3 text-gray-900 font-medium">{{ p.ProductName }}</td>
              <td class="px-4 py-3 text-gray-800">{{ p.BasePrice.toLocaleString('vi-VN') }}</td>
              <td class="px-4 py-3">{{ p.CategoryId }}</td>
              <td class="px-4 py-3">
                <img
                  v-if="p.ThumbnailUrl"
                  :src="p.ThumbnailUrl"
                  class="w-10 h-10 object-cover rounded border"
                />
                <span v-else class="text-gray-400">—</span>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="p.IsVariant ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                  class="px-2 py-1 text-xs font-semibold rounded"
                >
                  {{ p.IsVariant ? 'Có' : 'Không' }}
                </span>
              </td>
              <td class="px-4 py-3">{{ p.SupplierId || '—' }}</td>

              <!-- Actions -->
              <td class="px-4 py-3 text-center flex justify-center gap-3" @click.stop>
                <!-- Edit icon -->
                <button
                  @click="editProduct(p.ProductId)"
                  class="text-blue-600 hover:text-blue-800"
                  title="Chỉnh sửa"
                >
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <!-- Delete icon -->
                <button
                  @click="handleDeleteProduct(p.ProductId)"
                  class="text-red-600 hover:text-red-800"
                  title="Xóa"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="filteredProducts.length > 0"
      class="bg-white border-t px-6 py-3 flex items-center justify-between text-sm text-gray-600"
    >
      <div>Trang {{ currentPage }} / {{ totalPages }} — Tổng {{ filteredProducts.length }}</div>
      <div class="flex gap-2">
        <button
          @click="gotoPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 border rounded disabled:opacity-50"
        >
          Trước
        </button>
        <button
          @click="gotoPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 border rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/application/stores/ProductStore'
import type { ProductResponse } from '@/domain/entities/ProductDTOs/ProductResponse'
import type { PaginationParams } from '@/domain/values-objects/PaginationParams'

const router = useRouter()
const store = useProductStore()

const products = ref<ProductResponse[]>([])
const totalProducts = ref(0)
const pageSize = 10
const currentPage = ref(1)
const selectedIds = ref<string[]>([])

// filters
const filterProductId = ref('')
const filterProductName = ref('')
const filterSupplierId = ref('')

// fetch
const fetchProducts = async (params: PaginationParams = { pageIndex: 1, pageSize }) => {
  await store.getAllProducts(params)
  products.value = store.getProducts
  totalProducts.value = products.value.length
}

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchId = !filterProductId.value || p.ProductId.toString().includes(filterProductId.value)
    const matchName = !filterProductName.value || p.ProductName.toLowerCase().includes(filterProductName.value.toLowerCase())
    const matchSupplier = !filterSupplierId.value || (p.SupplierId?.toString() || '').includes(filterSupplierId.value)
    return matchId && matchName && matchSupplier
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize)))
const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})

const gotoPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const applyFilters = () => {
  currentPage.value = 1
}

const navigateToCreate = () => router.push('/products/create')
const goDetail = (id: string) => router.push(`/products/${id}`)
const editProduct = (id: string) => router.push(`/products/${id}`) // same route if form handles edit

const handleDeleteProduct = async (id: string) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    await store.deleteProduct(id)
    await fetchProducts()
  }
}

const isAllPageChecked = computed(() => {
  const ids = pagedProducts.value.map((x) => x.ProductId)
  return ids.length > 0 && ids.every((id) => selectedIds.value.includes(id))
})

const toggleCheckAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  const ids = pagedProducts.value.map((x) => x.ProductId)
  if (checked) selectedIds.value = Array.from(new Set([...selectedIds.value, ...ids]))
  else selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id))
}

onMounted(() => fetchProducts())
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");
</style>
