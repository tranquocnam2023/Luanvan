// src/application/stores/ProductStore.ts
import { defineStore } from "pinia";
import { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import { ProductRepository } from "@/infrastructure/repositories/ProductRepository/ProductRepository";
import { ProductUsecase } from "../usecases/ProductUsecase";
import type { ProductResponse } from "@/domain/entities/ProductDTOs/ProductResponse";
// ProductImage imports removed for now
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";

const productRepository = new ProductRepository();
const productUseCase = new ProductUsecase(productRepository);

export const useProductStore = defineStore("product", {
  state: () => ({
    products: null as PaginationResponse<ProductResponse> | null,
    selectedProduct: null as ProductResponse | null,
    // productImages removed for now
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async getAllProducts(params: PaginationParams = { pageIndex: 1, pageSize: 10 }) { // Fix: Default 9
      this.loading = true;
      this.error = null;

      try {
        const response = await productUseCase.getAllProducts(params);
        if (response.success && response.data) {
          this.products = response.data;
        } else {
          throw new Error(response.message || "Lấy danh sách products thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi lấy danh sách products";
        this.products = PaginationResponse.empty(params.pageIndex ?? 1, params.pageSize ?? 9);
      } finally {
        this.loading = false;
      }
    },

    async getProductById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await productUseCase.getProductById(id);
        if (response.success && response.data) {
          this.selectedProduct = response.data;
          // Auto-fetch images removed for now
        } else {
          throw new Error(response.message || "Lấy thông tin product thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi lấy thông tin product";
        this.selectedProduct = null;
      } finally {
        this.loading = false;
      }
    },

    // getProductImages removed for now

    async addProduct(request: FormData) { // Fix: Browser's FormData (global)
      this.loading = true;
      this.error = null;

      try {
        const response = await productUseCase.addProduct(request);
        if (response.success && response.data) {
          // Refetch list to update UI (page 1 after add, as new item may be first)
          await this.getAllProducts({ pageIndex: 1, pageSize: 10 });
          return response.data; // Trả về product mới tạo nếu cần
        } else {
          throw new Error(response.message || "Thêm product thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi thêm product";
        throw error; // Re-throw nếu caller cần handle
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(request: FormData) { // Fix: Browser's FormData (global)
      this.loading = true;
      this.error = null;

      try {
        const response = await productUseCase.updateProduct(request);
        if (response.success && response.data) {
          this.selectedProduct = response.data;
          // Refetch list with default (page 1, but can pass params if needed)
          await this.getAllProducts({ pageIndex: 1, pageSize: 9 });
          // Refetch images removed for now
          return response.data;
        } else {
          throw new Error(response.message || "Cập nhật product thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi cập nhật product";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await productUseCase.deleteProduct(id);
        if (response.success) {
          // Refetch list with default (adjust to current if passed)
          await this.getAllProducts({ pageIndex: 1, pageSize: 9 });
          this.selectedProduct = null;
          // productImages cleared removed for now
        } else {
          throw new Error(response.message || "Xóa product thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi xóa product";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Image actions removed for now

    clearSelectedProduct() {
      this.selectedProduct = null;
      // productImages cleared removed for now
    },

    clearError() {
      this.error = null;
    },
  },

  getters: {
    getProducts: (state) => state.products?.data || [], // Extract items nếu cần mảng đơn giản
    getPaginationData: (state) => state.products, // Full pagination object
    getSelectedProduct: (state) => state.selectedProduct,
    // getProductImages removed for now
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    isEmpty: (state) => !state.products || state.products.totalCounts === 0,
  },
});