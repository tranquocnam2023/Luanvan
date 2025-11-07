<!-- src/views/CategoryView.vue -->
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

  <!-- Categories Table -->
  <div v-else-if="filtered.length > 0" class="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
    <!-- Header with Add Button -->
    <div class="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <i class="fa-solid fa-layer-group text-2xl text-blue-600"></i>
        <h2 class="text-2xl font-bold text-gray-900">Danh sách loại hàng hóa</h2>
      </div>
      <div class="flex items-center gap-3">
        <input v-model="search" type="text" placeholder="Tìm theo tên…"
          class="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-200">
        <select v-model.number="pageSize" class="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-200">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <button
          @click="openAdd"
          class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 shadow-md"
        >
          <i class="fa-solid fa-plus"></i>
          <span>Thêm loại hàng hóa</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Id</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tên loại hàng hóa</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="row in renderedRows" :key="row.catId" class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 animate-fade-in"
            :class="{ 'bg-gray-50/30': row.level > 0 }">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 bg-gray-50 rounded-l-lg">{{ row.catId }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              <div class="flex items-center gap-2" :style="{ paddingLeft: `${row.level * 24}px` }">
                <button v-if="row.hasChildren" @click.stop="toggleCollapse(row.catId)"
                  class="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-900 flex-shrink-0">
                  <i :class="row.isCollapsed ? 'fa-solid fa-chevron-right text-xs' : 'fa-solid fa-chevron-down text-xs'"></i>
                </button>
                <span v-else class="w-5 flex-shrink-0"></span>
                <span :class="{ 'font-semibold': row.level === 0 }">{{ row.catName }}</span>
                <span v-if="row.hasChildren" class="ml-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {{ row.childrenCount }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 rounded-r-lg">
              <button
                @click="openEditModal(row.cat)"
                class="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <i class="fa-solid fa-edit mr-1"></i> Sửa
              </button>
              <button
                @click="confirmDelete(row.cat)"
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
        Hiển thị <span class="font-bold text-gray-900">{{ (currentPage - 1) * pageSize + 1 }}</span> đến
        <span class="font-bold text-gray-900">{{ Math.min(currentPage * pageSize, filtered.length) }}</span> của
        <span class="font-bold text-gray-900">{{ filtered.length }}</span> kết quả
      </div>
      <div class="flex space-x-2">
        <button
          @click="goto(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          <i class="fa-solid fa-chevron-left mr-1"></i> Trước
        </button>
        <button
          @click="goto(i)"
          v-for="i in Math.min(5, totalPages)"
          :key="i"
          :class="[
            'px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105',
            i === currentPage ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-gray-700 bg-white hover:bg-gray-50'
          ]"
        >
          {{ i }}
        </button>
        <span v-if="totalPages > 5" class="px-4 py-2 text-sm text-gray-500">...</span>
        <button
          v-if="totalPages > 5"
          @click="goto(totalPages)"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
        >
          {{ totalPages }}
        </button>
        <button
          @click="goto(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          Sau <i class="fa-solid fa-chevron-right mr-1"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else-if="filtered.length === 0" class="text-center py-16 bg-white rounded-2xl shadow-xl">
    <i class="fa-solid fa-layer-group text-6xl text-gray-300 mb-6 animate-bounce"></i>
    <h3 class="text-2xl font-bold text-gray-900 mb-3">Chưa có loại hàng hóa nào</h3>
    <p class="text-gray-500 mb-6 text-lg">Bắt đầu bằng cách thêm loại hàng hóa đầu tiên.</p>
    <button
      @click="openAdd"
      class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-md"
    >
      <i class="fa-solid fa-plus mr-2"></i> Thêm loại hàng hóa
    </button>
  </div>

  <!-- Add/Edit Category Modal -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
      <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 class="text-xl font-bold text-gray-900">
          {{ isEditMode ? 'Sửa loại hàng hóa' : 'Thêm loại hàng hóa mới' }}
        </h3>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Tên loại hàng hóa</label>
          <input
            v-model.trim="formData.CategoryName"
            type="text"
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Loại cha</label>
          <select
            v-model.number="formData.ParentCategoryId"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-200"
          >
            <option :value="0">-- Không có --</option>
            <option v-for="c in parentOptions" :key="c.id || c.Id" :value="c.id || c.Id">{{ c.categoryName || c.CategoryName }}</option>
          </select>
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
            :disabled="submitting"
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
        <p class="text-gray-600">Bạn có chắc chắn muốn xóa loại hàng hóa <strong class="text-red-600">{{ deleteName }}</strong>? Hành động này không thể hoàn tác.</p>
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
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/application/stores/CategoryStore'
import type { CategoryResponse } from '@/domain/entities/CatergoryDTOs/CategoryResponse'
import type { CategoryRequest } from '@/domain/entities/CatergoryDTOs/CategoryRequest'

const categoryStore = useCategoryStore()
const { categories, loading, error } = storeToRefs(categoryStore)
const { getAllCategories, addCategory, updateCategory, deleteCategory, clearError } = categoryStore

// list state
const pageSize = ref(20)
const currentPage = ref(1)
const search = ref('')

// selection
const selectedIds = ref<number[]>([])
const collapsed = ref<Record<number, boolean>>({})

// modal states
const showModal = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const formData = ref<CategoryRequest>({ Id: 0, CategoryName: '', ParentCategoryId: 0 })

// delete modal
const showDeleteModal = ref(false)
const deleteId = ref<number | null>(null)
const deleteName = ref('')

// fetch once
onMounted(async () => {
  await getAllCategories({ pageIndex: 1, pageSize: 1000 })
})

// computed
const flat = computed<any[]>(() => (categories.value?.data as any[]) ?? [])

// Helper to collect all IDs recursively from childCates
const collectAllIds = (cats: any[]): number[] => {
  const ids: number[] = []
  const traverse = (items: any[]) => {
    for (const item of items) {
      const id = item.id || item.Id
      ids.push(id)
      const children = item.childCates || item.ChildCategories
      if (children && children.length > 0) {
        traverse(children)
      }
    }
  }
  traverse(cats)
  return ids
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return flat.value

  // Recursive search through childCates
  const searchInTree = (cats: any[]): any[] => {
    const results: any[] = []
    for (const cat of cats) {
      const name = cat.categoryName || cat.CategoryName
      const children = cat.childCates || cat.ChildCategories
      const nameMatch = name?.toLowerCase().includes(q)

      if (nameMatch || (children && children.length > 0)) {
        const filteredCat = { ...cat }
        if (children && children.length > 0) {
          const filteredChildren = searchInTree(children)
          if (cat.childCates) filteredCat.childCates = filteredChildren
          if (cat.ChildCategories) filteredCat.ChildCategories = filteredChildren
        }
        if (nameMatch || ((filteredCat.childCates || filteredCat.ChildCategories)?.length > 0)) {
          results.push(filteredCat)
        }
      }
    }
    return results
  }

  return searchInTree(flat.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const paged = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

// Recursive render function for nested categories
const renderCategory = (cat: any, level: number = 0): any[] => {
  const rows: any[] = []
  const catId = cat.id || cat.Id
  const catName = cat.categoryName || cat.CategoryName
  const parentId = cat.parentCategoryId || cat.ParentCategoryId
  const children = cat.childCates || cat.ChildCategories
  const hasChildren = children && children.length > 0
  const isCollapsed = collapsed.value[catId] !== undefined ? collapsed.value[catId] : true

  rows.push({ cat, level, catId, catName, parentId, hasChildren, isCollapsed, childrenCount: children?.length || 0 })

  if (hasChildren && !isCollapsed) {
    for (const child of children) {
      rows.push(...renderCategory(child, level + 1))
    }
  }

  return rows
}

const renderedRows = computed(() => {
  const rows: any[] = []
  for (const cat of paged.value) {
    rows.push(...renderCategory(cat))
  }
  return rows
})

watch([pageSize, filtered], () => {
  currentPage.value = 1
  selectedIds.value = []
})

const isAllPageChecked = computed(() => {
  const ids = collectAllIds(paged.value)
  return ids.length > 0 && ids.every(id => selectedIds.value.includes(id))
})

const toggleCheckAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  const ids = collectAllIds(paged.value)
  if (checked) {
    selectedIds.value = Array.from(new Set([...selectedIds.value, ...ids]))
  } else {
    selectedIds.value = selectedIds.value.filter(id => !ids.includes(id))
  }
}

const toggleCollapse = (catId: number) => {
  collapsed.value[catId] = !collapsed.value[catId]
}

const goto = (p: number) => {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
}

// Helper to flatten all categories including nested children
const flattenAllCategories = (cats: any[]): any[] => {
  const result: any[] = []
  const traverse = (items: any[]) => {
    for (const item of items) {
      result.push(item)
      const children = item.childCates || item.ChildCategories
      if (children && children.length > 0) {
        traverse(children)
      }
    }
  }
  traverse(cats)
  return result
}

const allCategories = computed(() => flattenAllCategories(flat.value))

const parentOptions = computed(() => {
  if (!formData.value.Id) return allCategories.value
  return allCategories.value.filter(c => {
    const cId = c.id || c.Id
    return cId !== formData.value.Id
  })
})

// actions
const openAdd = () => {
  isEditMode.value = false
  formData.value = { Id: 0, CategoryName: '', ParentCategoryId: 0 }
  showModal.value = true
}

const openEditModal = (cat: any) => {
  isEditMode.value = true
  const catId = cat.id || cat.Id
  const catName = cat.categoryName || cat.CategoryName
  const parentId = cat.parentCategoryId || cat.ParentCategoryId
  formData.value = {
    Id: catId,
    CategoryName: catName,
    ParentCategoryId: parentId ?? 0
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  submitting.value = false
}

import { nextTick } from "vue";

const handleSubmit = async () => {
  if (!formData.value.CategoryName.trim()) return;
  submitting.value = true;

  try {
    if (formData.value.Id && isEditMode.value) {
      //  Cập nhật
      await updateCategory({ ...formData.value });
    } else {
      //  Thêm mới
      await addCategory({ ...formData.value, Id: 0 });
    }

    //  Gọi lại danh sách sau khi thêm/sửa
    await getAllCategories({ pageIndex: 1, pageSize: 1000 });
    await nextTick(); // đảm bảo reactive cập nhật

    closeModal();
    //  Thông báo thành công
    alert(isEditMode.value ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
  } catch (error) {
    console.error('Update/Add category failed:', error);
    alert('Có lỗi xảy ra khi lưu category!');
  } finally {
    submitting.value = false;
  }
};


const confirmDelete = (cat: any) => {
  deleteId.value = cat.id || cat.Id
  deleteName.value = cat.categoryName || cat.CategoryName
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!deleteId.value) return
  await deleteCategory(deleteId.value)
  showDeleteModal.value = false
  await getAllCategories({ pageIndex: 1, pageSize: 1000 })
}

const bulkDelete = async () => {
  if (selectedIds.value.length === 0) return
  if (!confirm(`Xoá ${selectedIds.value.length} bản ghi?`)) return
  for (const id of selectedIds.value) {
    try { await deleteCategory(id) } catch { }
  }
  selectedIds.value = []
  await getAllCategories({ pageIndex: 1, pageSize: 1000 })
}
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
