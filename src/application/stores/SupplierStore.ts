// Updated supplierStore.ts (similar to categoryStore)
import { defineStore } from "pinia";
import { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import { SupplierRepository } from "@/infrastructure/repositories/SupplierRepository/SupplierRepository";
import { SupplierUsecase } from "../usecases/SupplierUsecase";
import type { SupplierResponse } from "@/domain/entities/SupplierDTOs/SupplierResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { SupplierRequest } from "@/domain/entities/SupplierDTOs/SupplierRequest";

const supplierRepository = new SupplierRepository();
const supplierUseCase = new SupplierUsecase(supplierRepository);

export const useSupplierStore = defineStore("supplier", {
  state: () => ({
    suppliers: null as PaginationResponse<SupplierResponse> | null, // Updated to full PaginationResponse
    selectedSupplier: null as SupplierResponse | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async getAllSuppliers(params: PaginationParams = { pageIndex: 1, pageSize: 10 }) {
      this.loading = true;
      this.error = null;

      try {
        const response = await supplierUseCase.getAllSuppliers(params);
        if (response.success && response.data) {
          this.suppliers = response.data;
        } else {
          throw new Error(response.message || "Lấy danh sách suppliers thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi lấy danh sách suppliers";
        this.suppliers = PaginationResponse.empty(params.pageIndex ?? 1, params.pageSize ?? 10);
      } finally {
        this.loading = false;
      }
    },

    async getSupplierById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await supplierUseCase.getSupplierById(id);
        if (response.success && response.data) {
          this.selectedSupplier = response.data;
        } else {
          throw new Error(response.message || "Lấy thông tin supplier thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi lấy thông tin supplier";
        this.selectedSupplier = null;
      } finally {
        this.loading = false;
      }
    },

    async addSupplier(request: SupplierRequest) {
      this.loading = true;
      this.error = null;

      try {
        const response = await supplierUseCase.addSupplier(request);
        if (response.success && response.data) {
          // Refetch list to update UI (with default params)
          await this.getAllSuppliers({ pageIndex: 1, pageSize: 10 });
          return response.data; // Trả về supplier mới tạo nếu cần
        } else {
          throw new Error(response.message || "Thêm supplier thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi thêm supplier";
        throw error; // Re-throw nếu caller cần handle
      } finally {
        this.loading = false;
      }
    },

    async updateSupplier(request: SupplierRequest) {
      this.loading = true;
      this.error = null;

      try {
        const response = await supplierUseCase.updateSupplier(request);
        if (response.success && response.data) {
          this.selectedSupplier = response.data;
          // Refetch list with current pagination (but default to 1,10 since BE doesn't paginate)
          await this.getAllSuppliers({ pageIndex: 1, pageSize: 10 });
          return response.data;
        } else {
          throw new Error(response.message || "Cập nhật supplier thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi cập nhật supplier";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSupplier(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await supplierUseCase.deleteSupplier(id);
        if (response.success) {
          // Refetch list with default params
          await this.getAllSuppliers({ pageIndex: 1, pageSize: 10 });
          this.selectedSupplier = null;
        } else {
          throw new Error(response.message || "Xóa supplier thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi xóa supplier";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearSelectedSupplier() {
      this.selectedSupplier = null;
    },

    clearError() {
      this.error = null;
    },
  },

  getters: {
    getSuppliers: (state) => state.suppliers?.data || [], // Extract items nếu cần mảng đơn giản
    getPaginationData: (state) => state.suppliers, // Full pagination object
    getSelectedSupplier: (state) => state.selectedSupplier,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    isEmpty: (state) => !state.suppliers || state.suppliers.totalCounts === 0,
  },
});