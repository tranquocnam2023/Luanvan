import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { ICategoryRepository } from "./ICategoryRepository";
import { ApiResponse } from "@/domain/values-objects/ApiResponse";
import { http } from "@/infrastructure/api/http";
import { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import { CategoryResponse } from "@/domain/entities/CatergoryDTOs/CategoryResponse";
import type { CategoryRequest } from "@/domain/entities/CatergoryDTOs/CategoryRequest";

export class CategoryRepository implements ICategoryRepository {
  /**
   * Lấy danh sách categories với phân trang.
   */
  async getAllCategories(params: PaginationParams): Promise<ApiResponse<PaginationResponse<CategoryResponse>>> {
    try {
      // Default to page 1, size 10 as per instruction
      const requestParams = { ...params, pageIndex: params.pageIndex ?? 1, pageSize: params.pageSize ?? 10 };
      const response = await http.post("/Category/GetAllCategories", requestParams);

      const apiResponse = ApiResponse.fromJson<PaginationResponse<CategoryResponse>>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Lấy danh sách categories thất bại");
      }

      // FIX: Map raw plain data (lowercase keys) to CategoryResponse instances (capitalized properties)
      const rawItems = apiResponse.data?.data ?? [];
      const items = rawItems.map((item: any) => CategoryResponse.fromJSON(item));

      // Since BE response is flat array without pagination metadata,
      // wrap it in PaginationResponse assuming all data is on current page
      // (totalPages = 1, totalCounts = data.length)
      const paginatedData = new PaginationResponse<CategoryResponse>(
        items,
        items.length,
        requestParams.pageIndex,
        requestParams.pageSize
      );

      // Return wrapped in ApiResponse<PaginationResponse<CategoryResponse>>
      return {
        ...apiResponse,
        data: paginatedData,
      } as ApiResponse<PaginationResponse<CategoryResponse>>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi lấy danh sách categories");
    }
  }

  /**
   * Lấy thông tin category theo id.
   */
  async getCategoryById(id: number): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await http.get(`/Category/GetCategoryById?id=${id}`);

      const apiResponse = ApiResponse.fromJson<CategoryResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Lấy thông tin category thất bại");
      }

      // FIX: Map raw plain data to CategoryResponse instance
      const mappedData = apiResponse.data ? CategoryResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<CategoryResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi lấy thông tin category");
    }
  }

  /**
   * Thêm category mới.
   */
  async addCategory(request: CategoryRequest): Promise<ApiResponse<CategoryResponse>> {
    try {
      console.log("Adding category with request:", request); // Debug log
      const response = await http.post("/Category/AddCategory", request);

      const apiResponse = ApiResponse.fromJson<CategoryResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Thêm category thất bại");
      }

      // FIX: Map raw plain data to CategoryResponse instance
      const mappedData = apiResponse.data ? CategoryResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<CategoryResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi thêm category");
    }
  }

  /**
   * Xóa category theo id.
   */
  async deleteCategory(id: number): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await http.delete(`/Category/DeleteCategory?id=${id}`);

      const apiResponse = ApiResponse.fromJson<CategoryResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Xóa category thất bại");
      }

      // FIX: Map raw plain data to CategoryResponse instance (safe if data null/empty after delete)
      const mappedData = apiResponse.data ? CategoryResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<CategoryResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi xóa category");
    }
  }

  /**
   * Cập nhật category.
   */
  async updateCategory(request: CategoryRequest): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await http.put("/Category/UpdateCategory", request);

      const apiResponse = ApiResponse.fromJson<CategoryResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Cập nhật category thất bại");
      }

      // FIX: Map raw plain data to CategoryResponse instance
      const mappedData = apiResponse.data ? CategoryResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<CategoryResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi cập nhật category");
    }
  }
}