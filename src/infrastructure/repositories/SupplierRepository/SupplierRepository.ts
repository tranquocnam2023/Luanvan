import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { ISupplierRepository } from "./ISupplierRepository";
import { ApiResponse } from "@/domain/values-objects/ApiResponse";
import { http } from "@/infrastructure/api/http";
import { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import { SupplierResponse } from "@/domain/entities/SupplierDTOs/SupplierResponse";
import type { SupplierRequest } from "@/domain/entities/SupplierDTOs/SupplierRequest";

export class SupplierRepository implements ISupplierRepository {
  /**
   * Lấy danh sách suppliers với phân trang.
   */
  async getAllSuppliers(params: PaginationParams): Promise<ApiResponse<PaginationResponse<SupplierResponse>>> {
    try {
      // Default to page 1, size 10 as per instruction
      const requestParams = { ...params, pageIndex: params.pageIndex ?? 1, pageSize: params.pageSize ?? 10 };
      const response = await http.post("/Supplier/GetAllSuppliers", requestParams);

      const apiResponse = ApiResponse.fromJson<PaginationResponse<SupplierResponse>>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Lấy danh sách suppliers thất bại");
      }

      // FIX: Map raw plain data (lowercase keys) to SupplierResponse instances (capitalized properties)
      const rawItems = apiResponse.data?.data ?? [];
      const items = rawItems.map((item: any) => SupplierResponse.fromJSON(item));

      // Since BE response is flat array without pagination metadata,
      // wrap it in PaginationResponse assuming all data is on current page
      // (totalPages = 1, totalCounts = data.length)
      const paginatedData = new PaginationResponse<SupplierResponse>(
        items,
        items.length,
        requestParams.pageIndex,
        requestParams.pageSize
      );

      // Return wrapped in ApiResponse<PaginationResponse<SupplierResponse>>
      return {
        ...apiResponse,
        data: paginatedData,
      } as ApiResponse<PaginationResponse<SupplierResponse>>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi lấy danh sách suppliers");
    }
  }

  /**
   * Lấy thông tin supplier theo id.
   */
  async getSupplierById(id: string): Promise<ApiResponse<SupplierResponse>> {
    try {
      const response = await http.get(`/Supplier/${id}/GetSupplierById`);

      const apiResponse = ApiResponse.fromJson<SupplierResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Lấy thông tin supplier thất bại");
      }

      // FIX: Map raw plain data to SupplierResponse instance
      const mappedData = apiResponse.data ? SupplierResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<SupplierResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi lấy thông tin supplier");
    }
  }

  /**
   * Thêm supplier mới.
   */
  async addSupplier(request: SupplierRequest): Promise<ApiResponse<SupplierResponse>> {
    try {
      const response = await http.post("/Supplier/AddSupplier", request);

      const apiResponse = ApiResponse.fromJson<SupplierResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Thêm supplier thất bại");
      }

      // FIX: Map raw plain data to SupplierResponse instance
      const mappedData = apiResponse.data ? SupplierResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<SupplierResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi thêm supplier");
    }
  }

  /**
   * Xóa supplier theo id.
   */
  async deleteSupplier(id: string): Promise<ApiResponse<SupplierResponse>> {
    try {
      const response = await http.delete(`/Supplier/DeleteSupplier?id=${id}`);

      const apiResponse = ApiResponse.fromJson<SupplierResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Xóa supplier thất bại");
      }

      // FIX: Map raw plain data to SupplierResponse instance (safe if data null/empty after delete)
      const mappedData = apiResponse.data ? SupplierResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<SupplierResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi xóa supplier");
    }
  }

  /**
   * Cập nhật supplier.
   */
  async updateSupplier(request: SupplierRequest): Promise<ApiResponse<SupplierResponse>> {
    try {
      const response = await http.put("/Supplier/UpdateSupplier", request);

      const apiResponse = ApiResponse.fromJson<SupplierResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Cập nhật supplier thất bại");
      }

      // FIX: Map raw plain data to SupplierResponse instance
      const mappedData = apiResponse.data ? SupplierResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<SupplierResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi cập nhật supplier");
    }
  }
}