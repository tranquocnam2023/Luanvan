import type { SupplierRequest } from "@/domain/entities/SupplierDTOs/SupplierRequest";
import type { SupplierResponse } from "@/domain/entities/SupplierDTOs/SupplierResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import type { ISupplierRepository } from "@/infrastructure/repositories/SupplierRepository/ISupplierRepository";

/**
 * Supplier Usecase - Xử lý logic nghiệp vụ liên quan đến Supplier.
 * Sử dụng repository để tương tác với dữ liệu.
 */
export class SupplierUsecase {
  constructor(private supplierRepository: ISupplierRepository) {}

  /**
   * Lấy danh sách suppliers với phân trang.
   */
  async getAllSuppliers(
    params: PaginationParams
  ): Promise<ApiResponse<PaginationResponse<SupplierResponse>>> {
    return await this.supplierRepository.getAllSuppliers(params);
  }

  /**
   * Lấy thông tin supplier theo id.
   */
  async getSupplierById(id: string): Promise<ApiResponse<SupplierResponse>> {
    return await this.supplierRepository.getSupplierById(id);
  }

  /**
   * Thêm supplier mới.
   */
  async addSupplier(request: SupplierRequest): Promise<ApiResponse<SupplierResponse>> {
    return await this.supplierRepository.addSupplier(request);
  }

  /**
   * Xóa supplier theo id.
   */
  async deleteSupplier(id: string): Promise<ApiResponse<SupplierResponse>> {
    return await this.supplierRepository.deleteSupplier(id);
  }

  /**
   * Cập nhật supplier.
   */
  async updateSupplier(request: SupplierRequest): Promise<ApiResponse<SupplierResponse>> {
    return await this.supplierRepository.updateSupplier(request);
  }
}