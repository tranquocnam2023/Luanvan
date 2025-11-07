// Updated UserRepository.ts (added mapping to UserResponse instances for all methods)
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { IUserRepository } from "./IUserRepository";
import { ApiResponse } from "@/domain/values-objects/ApiResponse";
import { http } from "@/infrastructure/api/http";
import { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import type { UserResponse } from "@/domain/entities/UserDTOs/UserResponse";
import type { UserRequest } from "@/domain/entities/UserDTOs/UserRequest";
import { UserResponse as UserResponseClass } from "@/domain/entities/UserDTOs/UserResponse"; // Import class để dùng fromJSON
import type { AddNewUserRequest } from "@/domain/entities/UserDTOs/AddNewUserRequest";

export class UserRepository implements IUserRepository {
  /**
   * Lấy danh sách users với phân trang.
   */
  async getAllUsers(params: PaginationParams): Promise<ApiResponse<PaginationResponse<UserResponse>>> {
    try {
      // Default to page 1, size 10 as per instruction
      const requestParams = { ...params, pageIndex: params.pageIndex ?? 1, pageSize: params.pageSize ?? 10 };
      const response = await http.post("/User/GetAllUsers", requestParams);

      const apiResponse = ApiResponse.fromJson<PaginationResponse<UserResponse>>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Lấy danh sách users thất bại");
      }

      // FIX: Map raw plain data (lowercase keys) to UserResponse instances (capitalized properties)
      const rawItems = apiResponse.data?.data ?? [];
      const items = rawItems.map((item: any) => UserResponseClass.fromJSON(item));

      // Since BE response is flat array without pagination metadata,
      // wrap it in PaginationResponse assuming all data is on current page
      // (totalPages = 1, totalCounts = data.length)
      const paginatedData = new PaginationResponse<UserResponse>(
        items,
        items.length,
        requestParams.pageIndex,
        requestParams.pageSize
      );

      // Return wrapped in ApiResponse<PaginationResponse<UserResponse>>
      return {
        ...apiResponse,
        data: paginatedData,
      } as ApiResponse<PaginationResponse<UserResponse>>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi lấy danh sách users");
    }
  }

  /**
   * Lấy thông tin user theo username.
   */
  async getUserById(username: string): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await http.get(`/User/GetUserById?username=${encodeURIComponent(username)}`);

      const apiResponse = ApiResponse.fromJson<UserResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Lấy thông tin user thất bại");
      }

      // FIX: Map raw plain data to UserResponse instance
      const mappedData = apiResponse.data ? UserResponseClass.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<UserResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi lấy thông tin user");
    }
  }

  /**
   * Thêm user mới.
   */
  async addUser(request: AddNewUserRequest): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await http.post("/User/AddUser", request);

      const apiResponse = ApiResponse.fromJson<UserResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Thêm user thất bại");
      }

      // FIX: Map raw plain data to UserResponse instance
      const mappedData = apiResponse.data ? UserResponseClass.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<UserResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi thêm user");
    }
  }

  /**
   * Xóa user theo username.
   */
  async deleteUser(username: string): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await http.delete(`/User/DeleteUser?username=${encodeURIComponent(username)}`);

      const apiResponse = ApiResponse.fromJson<UserResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Xóa user thất bại");
      }

      // FIX: Map raw plain data to UserResponse instance (safe if data null/empty after delete)
      const mappedData = apiResponse.data ? UserResponseClass.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<UserResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi xóa user");
    }
  }

  /**
   * Cập nhật user.
   */
  async updateUser(request: UserRequest): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await http.put("/User/UpdateUser", request);

      const apiResponse = ApiResponse.fromJson<UserResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Cập nhật user thất bại");
      }

      // FIX: Map raw plain data to UserResponse instance
      const mappedData = apiResponse.data ? UserResponseClass.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<UserResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi cập nhật user");
    }
  }
}