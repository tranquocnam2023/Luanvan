<!-- src/views/CategoryView.vue -->
<template>
  <div class="flex h-screen bg-gray-50">
    <!-- LEFT: List -->
    <div class="flex-[1.15] bg-white border-r border-gray-200 flex flex-col">
      <!-- Header -->
      <div class="px-5 py-4 border-b bg-white flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Categories</h2>
        <div class="flex items-center gap-3">
          <div class="hidden md:flex items-center gap-2">
            <input v-model="search" type="text" placeholder="Tìm theo tên…"
              class="px-3 py-2 border rounded-md text-sm w-56">
            <select v-model.number="pageSize" class="px-2 py-2 border rounded-md text-sm">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <button class="px-3 py-2 border rounded-md text-sm" :disabled="selectedIds.length === 0" @click="bulkDelete">
              Xoá đã chọn ({{ selectedIds.length }})
            </button>
          </div>
          <button @click="openAdd" class="bg-green-600 hover:bg-green-700 text-white px-3.5 py-2.5 rounded-md text-sm">
            Thêm vào categories
          </button>
        </div>
      </div>

      <!-- Filters on mobile -->
      <div class="md:hidden px-4 py-3 flex gap-2 border-b bg-gray-50">
        <input v-model="search" type="text" placeholder="Tìm theo tên…"
          class="flex-1 px-3 py-2 border rounded-md text-sm">
        <select v-model.number="pageSize" class="px-2 py-2 border rounded-md text-sm">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-auto">
        <!-- loading -->
        <div v-if="loading" class="h-56 flex items-center justify-center">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
        </div>

        <!-- error -->
        <div v-else-if="error" class="m-4 p-4 rounded-md bg-red-50 text-red-700 border border-red-200 relative">
          {{ error }}
          <button @click="clearError" class="absolute right-2 top-2 text-red-500">×</button>
        </div>

        <!-- empty -->
        <div v-else-if="filtered.length === 0" class="p-8 text-center text-gray-600">
          Không có bản ghi.
        </div>

        <!-- table -->
        <table v-else class="min-w-full text-sm">
          <thead class="bg-gray-50 border-y">
            <tr class="text-left text-gray-600">
              <th class="w-10 px-4 py-3">
                <input type="checkbox" :checked="isAllPageChecked" @change="toggleCheckAll($event)">
              </th>
              <th class="w-40 px-4 py-3">Id</th>
              <th class="px-4 py-3">CategoryName</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in renderedRows" :key="row.catId"
              class="border-b hover:bg-blue-50 cursor-pointer"
              :class="{ 'bg-gray-50/30': row.level > 0 }"
              @click="selectRow(row.cat)">
              <td class="px-4 py-3" @click.stop>
                <input type="checkbox" :value="row.catId" v-model="selectedIds">
              </td>
              <td class="px-4 py-3">
                <button class="text-blue-600 hover:underline" @click.stop="selectRow(row.cat)">{{ row.catId }}</button>
              </td>
              <td class="px-4 py-3 text-gray-900">
                <div class="flex items-center gap-2" :style="{ paddingLeft: `${row.level * 24}px` }">
                  <button
                    v-if="row.hasChildren"
                    @click.stop="toggleCollapse(row.catId)"
                    class="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-900 flex-shrink-0"
                  >
                    <i :class="row.isCollapsed ? 'fa-solid fa-chevron-right text-xs' : 'fa-solid fa-chevron-down text-xs'"></i>
                  </button>
                  <span v-else class="w-5 flex-shrink-0"></span>
                  <span :class="{ 'font-semibold': row.level === 0 }">{{ row.catName }}</span>
                  <span
                    v-if="row.hasChildren"
                    class="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full font-medium"
                  >
                    {{ row.childrenCount }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="border-t bg-white px-4 py-3 flex items-center justify-between">
        <div class="text-xs text-gray-500">
          Trang {{ currentPage }} / {{ totalPages }} — Tổng {{ filtered.length }}
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 border rounded-md text-sm" :disabled="currentPage === 1"
            @click="goto(currentPage - 1)">Trước</button>
          <button class="px-3 py-1.5 border rounded-md text-sm" :disabled="currentPage === totalPages"
            @click="goto(currentPage + 1)">Sau</button>
        </div>
      </div>
    </div>

    <!-- RIGHT: Detail / Edit -->
    <div class="flex-[0.85] hidden lg:flex flex-col bg-white" v-if="selectedCategory || editMode">
      <div class="px-6 py-5 border-b bg-blue-50 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ editMode ? (selectedCategory ? 'Sửa' : 'Thêm mới') : 'Chi tiết' }}
        </h3>
        <div class="flex gap-2">
          <button v-if="!editMode && selectedCategory" class="px-3 py-2 border rounded-md text-sm"
            @click="startEdit">Sửa</button>
          <button v-if="!editMode && selectedCategory" class="px-3 py-2 border rounded-md text-sm text-red-600"
            @click="confirmDelete(selectedCategory!)">Xoá</button>
          <button class="px-3 py-2 border rounded-md text-sm" @click="closeDetail">Đóng</button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-auto p-6">
        <!-- Form -->
        <form v-if="editMode" class="space-y-5 max-w-xl" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên loại</label>
            <input v-model.trim="formData.CategoryName" class="w-full px-3 py-2 border rounded-md" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Loại cha</label>
            <select v-model.number="formData.ParentCategoryId" class="w-full px-3 py-2 border rounded-md">
              <option :value="0">-- Không có --</option>
              <option v-for="c in parentOptions" :key="c.Id" :value="c.Id">{{ c.CategoryName }}</option>
            </select>
          </div>
          <div class="pt-2 flex gap-2">
            <button type="button" class="px-4 py-2 border rounded-md" @click="cancelEdit">Huỷ</button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 rounded-md bg-blue-600 text-white">
              <i v-if="submitting" class="fa-solid fa-spinner fa-spin mr-2"></i>
              {{ selectedCategory ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>

        <!-- View -->
        <div v-else class="space-y-4">
          <div class="text-sm text-gray-500">ID</div>
          <div class="text-lg font-semibold">{{ selectedCategory!.Id }}</div>
          <div class="text-sm text-gray-500">Tên loại</div>
          <div class="text-lg font-semibold">{{ selectedCategory!.CategoryName }}</div>
          <div class="text-sm text-gray-500">Loại cha</div>
          <div class="text-base">{{ parentName }}</div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="px-5 py-4 border-b">
          <h4 class="font-semibold">Xác nhận xoá</h4>
        </div>
        <div class="px-5 py-4">
          Bạn chắc chắn muốn xoá <b>{{ deleteName }}</b>?
        </div>
        <div class="px-5 py-4 border-t flex justify-end gap-2">
          <button class="px-3 py-2 border rounded-md" @click="showDeleteModal = false">Huỷ</button>
          <button class="px-3 py-2 rounded-md bg-red-600 text-white" @click="handleDelete">Xoá</button>
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

// right panel
const selectedCategory = ref<CategoryResponse | null>(null)
const editMode = ref(false)
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

const parentOptions = computed(() => {
  if (!selectedCategory.value) return flat.value
  return flat.value.filter(c => c.Id !== selectedCategory.value!.Id)
})

const parentName = computed(() => {
  const pid = selectedCategory.value?.ParentCategoryId || 0
  if (!pid) return '-- Không có --'
  const p = flat.value.find(c => c.Id === pid)
  return p ? p.CategoryName : 'Không xác định'
})

// actions
const selectRow = (cat: CategoryResponse) => {
  selectedCategory.value = cat
  editMode.value = false
}

const openAdd = () => {
  selectedCategory.value = null
  editMode.value = true
  formData.value = { Id: 0, CategoryName: '', ParentCategoryId: null }
}

const startEdit = () => {
  if (!selectedCategory.value) return
  editMode.value = true
  formData.value = {
    Id: selectedCategory.value.Id,
    CategoryName: selectedCategory.value.CategoryName,
    ParentCategoryId: selectedCategory.value.ParentCategoryId ?? null
  }
}

const cancelEdit = () => (editMode.value = false)
const closeDetail = () => {
  selectedCategory.value = null
  editMode.value = false
}

import { nextTick } from "vue";

const handleSubmit = async () => {
  if (!formData.value.CategoryName.trim()) return;
  submitting.value = true;

  try {
    let savedCategory: CategoryResponse | null = null;

    if (formData.value.Id && selectedCategory.value) {
      //  Cập nhật
      const updated = await updateCategory({ ...formData.value });
      savedCategory = updated || null;
    } else {
      //  Thêm mới
      const added = await addCategory({ ...formData.value, Id: 0 });
      savedCategory = added || null;
    }

    //  Gọi lại danh sách sau khi thêm/sửa
    await getAllCategories({ pageIndex: 1, pageSize: 1000 });
    await nextTick(); // đảm bảo reactive cập nhật

    //  Nếu BE không trả category mới -> tìm lại trong danh sách
    if (!savedCategory && formData.value.Id) {
      savedCategory = flat.value.find(x => x.Id === formData.value.Id) || null;
    }

    selectedCategory.value = savedCategory;
    editMode.value = false;

    //  Thông báo thành công
    alert(selectedCategory.value ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
  } catch (error) {
    console.error('Update/Add category failed:', error);
    alert('Có lỗi xảy ra khi lưu category!');
  } finally {
    submitting.value = false;
  }
};


const confirmDelete = (c: CategoryResponse) => {
  deleteId.value = c.Id
  deleteName.value = c.CategoryName
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!deleteId.value) return
  await deleteCategory(deleteId.value)
  showDeleteModal.value = false
  selectedCategory.value = null
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
</style>
