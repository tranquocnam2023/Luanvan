// Updated userStore.ts (fix isSuccess to success property)
import { defineStore } from "pinia";
import { PaginationResponse } from "@/domain/values-objects/PaginationResponse";

import type { UserRequest } from "@/domain/entities/UserDTOs/UserRequest";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import { UserRepository } from "@/infrastructure/repositories/UserRepository/UserRepository";
import { UserUseCase } from "../usecases/UserUsecase";
import type { UserResponse } from "@/domain/entities/UserDTOs/UserResponse";
import type { AddNewUserRequest } from "@/domain/entities/UserDTOs/AddNewUserRequest";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

export const useUserStore = defineStore("user", {
  state: () => ({
    users: null as PaginationResponse<UserResponse> | null, // Updated to full PaginationResponse
    selectedUser: null as UserResponse | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async getAllUsers(params: PaginationParams = { pageIndex: 1, pageSize: 10 }) {
      this.loading = true;
      this.error = null;

      try {
        const response = await userUseCase.getAllUsers(params);
        if (response.success && response.data) {
          this.users = response.data;
        } else {
          throw new Error(response.message || "Lấy danh sách users thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi lấy danh sách users";
        this.users = PaginationResponse.empty(params.pageIndex ?? 1, params.pageSize ?? 10);
      } finally {
        this.loading = false;
      }
    },

    async getUserById(username: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await userUseCase.getUserById(username);
        if (response.success && response.data) {
          this.selectedUser = response.data;
        } else {
          throw new Error(response.message || "Lấy thông tin user thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi lấy thông tin user";
        this.selectedUser = null;
      } finally {
        this.loading = false;
      }
    },

    async addUser(request: AddNewUserRequest) {
      this.loading = true;
      this.error = null;

      try {
        const response = await userUseCase.addUser(request);
        if (response.success && response.data) {
          // Refetch list to update UI (with default params)
          await this.getAllUsers({ pageIndex: 1, pageSize: 10 });
          return response.data; // Trả về user mới tạo nếu cần
        } else {
          throw new Error(response.message || "Thêm user thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi thêm user";
        throw error; // Re-throw nếu caller cần handle
      } finally {
        this.loading = false;
      }
    },

    async updateUser(request: UserRequest) {
      this.loading = true;
      this.error = null;

      try {
        const response = await userUseCase.updateUser(request);
        if (response.success && response.data) {
          this.selectedUser = response.data;
          // Refetch list with current pagination (but default to 1,10 since BE doesn't paginate)
          await this.getAllUsers({ pageIndex: 1, pageSize: 10 });
          return response.data;
        } else {
          throw new Error(response.message || "Cập nhật user thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi cập nhật user";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(username: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await userUseCase.deleteUser(username);
        if (response.success) {
          // Refetch list with default params
          await this.getAllUsers({ pageIndex: 1, pageSize: 10 });
          this.selectedUser = null;
        } else {
          throw new Error(response.message || "Xóa user thất bại");
        }
      } catch (error: any) {
        this.error = error.message || "Lỗi không xác định khi xóa user";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearSelectedUser() {
      this.selectedUser = null;
    },

    clearError() {
      this.error = null;
    },
  },

  getters: {
    getUsers: (state) => state.users?.data || [], // Extract items nếu cần mảng đơn giản
    getPaginationData: (state) => state.users, // Full pagination object
    getSelectedUser: (state) => state.selectedUser,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    isEmpty: (state) => !state.users || state.users.totalCounts === 0,
  },
});