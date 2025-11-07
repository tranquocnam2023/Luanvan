// Updated categoryStore.ts (similar to userStore)
import { defineStore } from "pinia";
import { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import { CategoryRepository } from "@/infrastructure/repositories/CategoryRepository/CategoryRepository";
import { CategoryUsecase } from "../usecases/CategoryUsecase";
import type { CategoryResponse } from "@/domain/entities/CatergoryDTOs/CategoryResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { CategoryRequest } from "@/domain/entities/CatergoryDTOs/CategoryRequest";


const categoryRepository = new CategoryRepository();
const categoryUseCase = new CategoryUsecase(categoryRepository);

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: null as PaginationResponse<CategoryResponse> | null, // Updated to full PaginationResponse
    selectedCategory: null as CategoryResponse | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async getAllCategories(params: PaginationParams = { pageIndex: 1, pageSize: 10 }) {
      this.loading = true;
      this.error = null;

      try {
        const response = await categoryUseCase.getAllCategories(params);
        if (response.success && response.data) {
          this.categories = response.data;
        } else {
          throw new Error(response.message || "Lấy danh sách categories thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi lấy danh sách categories";
        this.categories = PaginationResponse.empty(params.pageIndex ?? 1, params.pageSize ?? 10);
      } finally {
        this.loading = false;
      }
    },

    async getCategoryById(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await categoryUseCase.getCategoryById(id);
        if (response.success && response.data) {
          this.selectedCategory = response.data;
        } else {
          throw new Error(response.message || "Lấy thông tin category thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi lấy thông tin category";
        this.selectedCategory = null;
      } finally {
        this.loading = false;
      }
    },

    async addCategory(request: CategoryRequest) {
      this.loading = true;
      this.error = null;

      try {
        const response = await categoryUseCase.addCategory(request);
        if (response.success && response.data) {
          // Refetch list to update UI (with default params)
          await this.getAllCategories({ pageIndex: 1, pageSize: 10 });
          return response.data; // Trả về category mới tạo nếu cần
        } else {
          throw new Error(response.message || "Thêm category thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi thêm category";
        throw error; // Re-throw nếu caller cần handle
      } finally {
        this.loading = false;
      }
    },

    async updateCategory(request: CategoryRequest) {
      this.loading = true;
      this.error = null;

      try {
        const response = await categoryUseCase.updateCategory(request);
        if (response.success && response.data) {
          this.selectedCategory = response.data;
          // Refetch list with current pagination (but default to 1,10 since BE doesn't paginate)
          await this.getAllCategories({ pageIndex: 1, pageSize: 10 });
          return response.data;
        } else {
          throw new Error(response.message || "Cập nhật category thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi cập nhật category";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await categoryUseCase.deleteCategory(id);
        if (response.success) {
          // Refetch list with default params
          await this.getAllCategories({ pageIndex: 1, pageSize: 10 });
          this.selectedCategory = null;
        } else {
          throw new Error(response.message || "Xóa category thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi xóa category";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearSelectedCategory() {
      this.selectedCategory = null;
    },

    clearError() {
      this.error = null;
    },
  },

  getters: {
    getCategories: (state) => state.categories?.data || [], // Extract items nếu cần mảng đơn giản
    getPaginationData: (state) => state.categories, // Full pagination object
    getSelectedCategory: (state) => state.selectedCategory,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    isEmpty: (state) => !state.categories || state.categories.totalCounts === 0,
  },
});