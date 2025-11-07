// functionStore.ts (Similar to supplierStore.ts)
import { defineStore } from "pinia";
import { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import { FunctionRepository } from "@/infrastructure/repositories/FunctionRepository/FunctionRepository";
import { FunctionUsecase } from "../usecases/FunctionUsecase";
import type { FunctionResponse } from "@/domain/entities/FunctionDTOs/FunctionResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { FunctionRequest } from "@/domain/entities/FunctionDTOs/FunctionRequest"; // Assume exists

const functionRepository = new FunctionRepository();
const functionUseCase = new FunctionUsecase(functionRepository);

export const useFunctionStore = defineStore("function", {
  state: () => ({
    functions: null as PaginationResponse<FunctionResponse> | null,
    selectedFunction: null as FunctionResponse | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async getAllFunctions(params: PaginationParams = { pageIndex: 1, pageSize: 10 }) {
      this.loading = true;
      this.error = null;

      try {
        const response = await functionUseCase.getAllFunctions(params);
        if (response.success && response.data) {
          this.functions = response.data;
        } else {
          throw new Error(response.message || "Lấy danh sách functions thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi lấy danh sách functions";
        this.functions = PaginationResponse.empty(params.pageIndex ?? 1, params.pageSize ?? 10);
      } finally {
        this.loading = false;
      }
    },

    async getFunctionById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await functionUseCase.getFunctionById(id);
        if (response.success && response.data) {
          this.selectedFunction = response.data;
        } else {
          throw new Error(response.message || "Lấy thông tin function thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi lấy thông tin function";
        this.selectedFunction = null;
      } finally {
        this.loading = false;
      }
    },

    async addFunction(request: FunctionRequest) {
      this.loading = true;
      this.error = null;

      try {
        const response = await functionUseCase.addFunction(request);
        if (response.success && response.data) {
          // Refetch list to update UI (with default params)
          await this.getAllFunctions({ pageIndex: 1, pageSize: 10 });
          return response; // Trả về function mới tạo nếu cần
        } else {
          throw new Error(response.message || "Thêm function thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi thêm function";
        throw error; // Re-throw nếu caller cần handle
      } finally {
        this.loading = false;
      }
    },

    async updateFunction(request: FunctionRequest) {
      this.loading = true;
      this.error = null;

      try {
        const response = await functionUseCase.updateFunction(request);
        if (response.success && response.data) {
          this.selectedFunction = response.data;
          // Refetch list with current pagination (but default to 1,10 since BE doesn't paginate)
          await this.getAllFunctions({ pageIndex: 1, pageSize: 10 });
          return response;
        } else {
          throw new Error(response.message || "Cập nhật function thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi cập nhật function";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteFunction(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await functionUseCase.deleteFunction(id);
        if (response.success) {
          // Refetch list with default params
          await this.getAllFunctions({ pageIndex: 1, pageSize: 10 });
          this.selectedFunction = null;
        } else {
          throw new Error(response.message || "Xóa function thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi xóa function";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearSelectedFunction() {
      this.selectedFunction = null;
    },

    clearError() {
      this.error = null;
    },
  },

  getters: {
    getFunctions: (state) => state.functions?.data || [], // Extract items nếu cần mảng đơn giản
    getPaginationData: (state) => state.functions, // Full pagination object
    getSelectedFunction: (state) => state.selectedFunction,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    isEmpty: (state) => !state.functions || state.functions.totalCounts === 0,
  },
});