import type { SupplierRequest } from "@/domain/entities/SupplierDTOs/SupplierRequest";
import type { SupplierResponse } from "@/domain/entities/SupplierDTOs/SupplierResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";

export interface ISupplierRepository {
  getAllSuppliers(params: PaginationParams): Promise<ApiResponse<PaginationResponse<SupplierResponse>>>;
  getSupplierById(id: string): Promise<ApiResponse<SupplierResponse>>;
  addSupplier(request: SupplierRequest): Promise<ApiResponse<SupplierResponse>>;
  updateSupplier(request: SupplierRequest): Promise<ApiResponse<SupplierResponse>>;
  deleteSupplier(id: string): Promise<ApiResponse<SupplierResponse>>;
}