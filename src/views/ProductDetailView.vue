<!-- src/views/ProductDetailView.vue (Enhanced: Hide ProductId field in create mode; added supplier combo box; conditionally append ProductId only for updates; added supplier validation) -->
<template>
  <!-- Loading State -->
  <div v-if="isLocalLoading" class="flex justify-center items-center h-screen bg-gray-50">

    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-lg text-gray-600">Đang tải chi tiết sản phẩm...</p>
    </div>
  </div>


  <!-- Error State -->
  <div v-else-if="loadError" class="flex justify-center items-center h-screen bg-gray-50">
    <div class="text-center">
      <i class="fa-solid fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ loadError }}</h3>
      <button @click="$router.push({ name: 'product-list' })"
        class="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors font-semibold">
        <i class="fa-solid fa-arrow-left mr-2"></i> Quay Lại Danh Sách
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <div v-else-if="selectedProduct || isCreate" class="min-h-screen bg-gray-50">
    <!-- Error Toast -->
    <div v-if="storeError" class="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg z-50 max-w-sm">
      {{ storeError }}
      <button @click="clearStoreError" class="ml-4 text-white hover:text-gray-200">×</button>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Header Bar -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <img :src="productImage" alt="Product Icon"
            class="w-12 h-12 rounded object-cover" />
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">
              {{ isCreate ? 'Tạo Sản Phẩm Mới' : formData.ProductName || 'Sản Phẩm Không Tên' }}
            </h1>
            <p class="text-sm text-gray-500 flex items-center">
              <i class="fa-solid fa-tag mr-1"></i> {{ categoryName }}
            </p>
          </div>
        </div>
        <div class="flex space-x-3">
          <button type="submit" form="productForm"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors font-medium flex items-center space-x-2">
            <i class="fa-solid fa-save"></i>
            <span>{{ isCreate ? 'Tạo' : 'Lưu' }}</span>
          </button>
          <button @click="$router.push({ name: 'product-list', replace: true })"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors font-medium flex items-center space-x-2">
            <i class="fa-solid fa-times"></i>
            <span>Hủy</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Images -->
        <div class="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Hình Ảnh</h3>
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="relative">
              <img :key="previewUrl || selectedProduct?.ThumbnailUrl"
                :src="previewUrl || selectedProduct?.ThumbnailUrl || 'https://via.placeholder.com/400x400?text=Không+Có+Hình'"
                alt="Hình Ảnh Chính" class="w-full h-64 object-cover rounded border border-gray-200" />
            </div>
            <!-- Upload Button -->
            <button @click="thumbnailInput?.click()"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2">
              <i class="fa-solid fa-camera"></i>
              <span>{{ isCreate ? 'Chọn Hình Ảnh' : 'Thay Đổi Hình Ảnh' }}</span>
            </button>
            <!-- Hidden Input -->
            <input ref="thumbnailInput" type="file" accept="image/*" @change="handleThumbnailUpload" class="hidden" />
            <!-- Thumbnail Gallery Placeholder -->
            <div class="grid grid-cols-2 gap-2">
              <div v-for="n in 3" :key="n" 
                class="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                <i class="fa-solid fa-plus"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Form (Single Column) -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">Thông Tin Chung</h3>
          <form id="productForm" @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 gap-4">
              <!-- Product ID field only in edit mode -->
              <div v-if="!isCreate">
                <label class="block text-sm font-medium text-gray-700 mb-1">Mã Sản Phẩm</label>
                <input v-model="formData.ProductId" type="text" readonly
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tên Sản Phẩm</label>
                <input v-model="formData.ProductName" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Giá Bán</label>
                <input v-model.number="formData.BasePrice" type="number" step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Danh Mục</label>
                <select v-model.number="formData.CategoryId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required>
                  <option value="">Chọn danh mục</option>
                  <!-- Hierarchical options: Use flat list with prefixes for indentation -->
                  <option v-for="cat in hierarchicalCategories" :key="cat.Id" :value="cat.Id"
                    class="indent-option">
                    {{ cat.CategoryName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nhà Cung Cấp</label>
                <select v-model="formData.SupplierId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required>
                  <option value="">Chọn nhà cung cấp</option>
                  <option v-for="sup in suppliers" :key="sup.Id" :value="sup.Id">
                    {{ sup.SupplierName }}
                  </option>
                </select>
              </div>
              <div class="flex items-center">
                <input v-model="formData.IsVariant" type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label class="ml-2 text-sm font-medium text-gray-700">Sản Phẩm Phiên Bản</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Fallback -->
  <div v-else class="flex justify-center items-center h-screen bg-gray-50">
    <p class="text-lg text-gray-600">Không tìm thấy sản phẩm.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/application/stores/ProductStore';
import { useCategoryStore } from '@/application/stores/CategoryStore';
import type { ProductResponse } from '@/domain/entities/ProductDTOs/ProductResponse';
import type { ProductRequest } from '@/domain/entities/ProductDTOs/ProductRequest';
import type { CategoryResponse } from '@/domain/entities/CatergoryDTOs/CategoryResponse';
import { useSupplierStore } from '@/application/stores/SupplierStore';
import type { SupplierResponse } from '@/domain/entities/SupplierDTOs/SupplierResponse';

const route = useRoute();
const router = useRouter();
const store = useProductStore();
const categoryStore = useCategoryStore();
const supplierStore = useSupplierStore();

const isCreate = ref(false);
const thumbnailInput = ref<HTMLInputElement | null>(null);
const storeError = ref<string | null>(null);
const isLocalLoading = ref(true);
const loadError = ref<string | null>(null);

const selectedProduct = ref<ProductResponse | null>(null);
const thumbnailFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

// Load nested categories from store (getPaginationData returns full structure with items as top-level)
const nestedCategories = computed(() => categoryStore.getPaginationData?.data || []);

// Suppliers from store (flat list)
const suppliers = computed(() => supplierStore.getSuppliers);

interface FormDataType extends ProductRequest {
  ThumbnailUrl: string;
}

const formData = ref<FormDataType>({
  ProductId: '',
  ProductName: '',
  BasePrice: 0,
  CategoryId: 0,
  SupplierId: '',
  ThumbnailUrl: '',
  IsVariant: false,
  fileImageThumbnail: null,
});

const productImage = computed(() => previewUrl.value || selectedProduct.value?.ThumbnailUrl || 'https://via.placeholder.com/48x48?text=P');

// FIX: Resolve CategoryName from hierarchical flat list (find by Id and use DisplayName)
const categoryName = computed(() => {
  const catId = isCreate.value ? formData.value.CategoryId : selectedProduct.value?.CategoryId;
  const selectedCat = hierarchicalCategories.value.find(c => c.Id === catId);
  return selectedCat ? selectedCat.CategoryName : (isCreate.value ? 'Chưa chọn' : 'Không xác định');
});

// Hierarchical flat list for select: Flatten nested with prefixes for indentation (e.g., "Electronics > Computers > Laptops")
const hierarchicalCategories = computed(() => {
  const flattenWithPrefix = (items: CategoryResponse[], prefix: string = ''): CategoryResponse[] => {
    let flatList: CategoryResponse[] = [];
    items.forEach((item) => {
      const displayName = prefix ? `${prefix} > ${item.CategoryName}` : item.CategoryName;
      flatList.push({
        ...item,
        CategoryName: displayName,  // Add display prop for indented name
      });
      // Recurse into children
      if (item.ChildCategories && item.ChildCategories.length > 0) {
        flatList = flatList.concat(flattenWithPrefix(item.ChildCategories, displayName));
      }
    });
    return flatList;
  };
  return flattenWithPrefix(nestedCategories.value);
});

const clearStoreError = () => {
  store.clearError();
  storeError.value = null;
};

watch(() => store.hasError ? store.error : null, (err) => {
  if (err) {
    storeError.value = err;
    alert(`Lỗi: ${err}`);
    clearStoreError();
  }
});

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  store.clearSelectedProduct();
});

const handleThumbnailUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  console.log('File selected:', file?.name, file?.size, file?.type);
  if (file && file.type.startsWith('image/') && file.size > 0) {
    thumbnailFile.value = file;
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(file);
    console.log('Preview URL created:', previewUrl.value);
    target.value = '';
  } else {
    console.warn('Invalid file type or empty file');
    alert('Vui lòng chọn file hình ảnh hợp lệ!');
  }
};

const clearThumbnailAfterSuccess = () => {
  if (thumbnailFile.value) {
    thumbnailFile.value = null;
  }
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
};

const handleSubmit = async () => {
  // Validation
  if (!formData.value.ProductName?.trim()) {
    alert('Vui lòng nhập tên sản phẩm!');
    return;
  }
  if (formData.value.BasePrice <= 0) {
    alert('Giá bán phải lớn hơn 0!');
    return;
  }
  if (!formData.value.CategoryId || formData.value.CategoryId === 0) {
    alert('Vui lòng chọn danh mục!');
    return;
  }
  if (!formData.value.SupplierId) {
    alert('Vui lòng chọn nhà cung cấp!');
    return;
  }
  if (!thumbnailFile.value) {
    alert('Vui lòng chọn hình ảnh thumbnail!');
    return;
  }

  // Cập nhật commonData: Luôn gửi ProductId (rỗng cho create) -> Chỉ gửi cho update
  const commonData: Record<string, any> = {
    ProductName: formData.value.ProductName.trim(),
    BasePrice: formData.value.BasePrice.toFixed(0), // String với 0 chữ số thập phân, e.g., "100"
    CategoryId: formData.value.CategoryId.toString(),
    SupplierId: formData.value.SupplierId, // String
    IsVariant: formData.value.IsVariant.toString(), // "true" hoặc "false"
  };

  const submitData = new FormData();
  // Chỉ append ProductId nếu không phải create
  if (!isCreate.value) {
    submitData.append('ProductId', formData.value.ProductId);
  }
  // Append các field khác
  Object.entries(commonData).forEach(([key, value]) => {
    submitData.append(key, value);
  });
  submitData.append('fileImageThumbnail', thumbnailFile.value!);

  // Log FormData (giữ nguyên, giờ có ProductId)
  console.log('Submitting FormData:');
  console.log('--- Fields ---');
  for (const [key, value] of (submitData as any).entries()) {
    if (key === 'fileImageThumbnail') {
      const file = value as File;
      console.log(`${key}: File(${file.name}, ${file.size} bytes, ${file.type})`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }
  console.log('--- End FormData ---');

  try {
    if (isCreate.value) {
      console.log('Calling store.addProduct...');
      const newProduct = await store.addProduct(submitData);
      console.log('Add response:', newProduct);
      clearThumbnailAfterSuccess();
      // FIX: Explicit fetch before push to ensure immediate refresh on /products
      await store.getAllProducts({ pageIndex: 1, pageSize: 9 });
      alert('Tạo sản phẩm thành công!');
      await nextTick(); // Đảm bảo UI cập nhật trước khi chuyển trang
      await router.push({ name: 'product-list', replace: true });
 // Await push to complete navigation
    } else {
      console.log('Calling store.updateProduct...');
      const updatedProduct = await store.updateProduct(submitData);
      console.log('Update response:', updatedProduct);
      clearThumbnailAfterSuccess();
      await store.getProductById(formData.value.ProductId); // Sử dụng formData.ProductId
      selectedProduct.value = store.getSelectedProduct;
      // FIX: Explicit fetch before push to ensure immediate refresh on /products
      await store.getAllProducts({ pageIndex: 1, pageSize: 9 });
      alert('Cập nhật sản phẩm thành công!');
      await nextTick(); // Đảm bảo UI cập nhật trước khi chuyển trang
      await router.push({ name: 'product-list', replace: true });
 // Await push to complete navigation
    }
  } catch (error: any) {
    console.error('Full error:', error);
    if (error.response?.data?.errors) {
      let errorMsg = '';
      if (typeof error.response.data.errors === 'object') {
        errorMsg = Object.entries(error.response.data.errors)
          .map(([field, msgs]: [string, any]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n');
      } else {
        errorMsg = error.response.data.errors; // Nếu array/string
      }
      alert(`Lỗi validation từ server:\n${errorMsg}`);
    } else {
      alert(`Lỗi: ${error.message || 'Server từ chối yêu cầu. Kiểm tra console.'}`);
    }
  }
};

onMounted(async () => {
  console.log('ProductDetail mounted - Route name:', route.name, 'Params:', route.params);
  const paramId = route.params.id as string;
  isLocalLoading.value = true;
  loadError.value = null;

  try {
    // Load all nested categories with large pageSize to get full hierarchy
    await categoryStore.getAllCategories({ pageIndex: 1, pageSize: 100 });
    // Load all suppliers with large pageSize to get full list
    await supplierStore.getAllSuppliers({ pageIndex: 1, pageSize: 100 });
    // Use nested items for hierarchy (no flatten here; handled in computed)
    console.log('Loaded nested categories:', nestedCategories.value.length, 'top-level items');
    console.log('Loaded suppliers:', suppliers.value.length, 'items');

    if (route.name === 'product-create') {
      console.log('Create mode detected');
      isCreate.value = true;
      formData.value = {
        ProductId: '',
        ProductName: '',
        BasePrice: 0,
        CategoryId: 0,
        SupplierId: '',
        ThumbnailUrl: '',
        IsVariant: false,
        fileImageThumbnail: null,
      };
    } else if (route.name === 'product-detail' && paramId) {
      console.log('Detail mode - Loading ID:', paramId);
      isCreate.value = false;
      await store.getProductById(paramId);
      selectedProduct.value = store.getSelectedProduct;
      if (!selectedProduct.value) {
        throw new Error('Sản phẩm không tồn tại hoặc đã bị xóa.');
      }

      formData.value = {
        ProductId:selectedProduct.value.ProductId,
        ProductName: selectedProduct.value.ProductName,
        BasePrice: selectedProduct.value.BasePrice,
        CategoryId: selectedProduct.value.CategoryId,
        SupplierId: selectedProduct.value.SupplierId,
        ThumbnailUrl: selectedProduct.value.ThumbnailUrl || '',
        IsVariant: selectedProduct.value.IsVariant,
        fileImageThumbnail: null,
      };
      // CategoryName resolved in computed from hierarchical flat list
      console.log('Loaded product:', selectedProduct.value);
    } else {
      await nextTick();
      await router.push({ name: 'product-list', replace: true });
      return;
    }
  } catch (error: any) {
    console.error('Load product fail:', error);
    loadError.value = error.message || 'Lỗi tải chi tiết sản phẩm. Vui lòng thử lại.';
  } finally {
    isLocalLoading.value = false;
    console.log('Mount complete - isCreate:', isCreate.value);
  }
});

watch(() => store.getSelectedProduct, (newProduct) => {
  if (!isCreate.value && newProduct) {
    selectedProduct.value = newProduct;

    formData.value = {
      ProductId: newProduct.ProductId,
      ProductName: newProduct.ProductName,
      BasePrice: newProduct.BasePrice,
      CategoryId: newProduct.CategoryId,
      SupplierId: newProduct.SupplierId,
      ThumbnailUrl: newProduct.ThumbnailUrl || '',
      IsVariant: newProduct.IsVariant,
      fileImageThumbnail: null,
    };
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = null;
    }
    console.log('Updated form from store:', formData.value);
  }
});
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");

/* Indent sub-options in select (simulate hierarchy via padding-left based on depth; note: CSS can't directly style <option>, but this works for modern browsers) */
select option.indent-option {
  padding-left: 1rem; /* Base padding */
}
select option.indent-option::before { /* Pseudo for deeper levels if needed, but prefix in text handles it */
  content: '';
}
</style>