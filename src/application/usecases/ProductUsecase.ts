// src/application/usecases/ProductUsecase.ts
// Removed: import type { FormData } from 'formdata-node'; — Use browser's global FormData
import type { ProductResponse } from "@/domain/entities/ProductDTOs/ProductResponse";
// ProductImage imports removed for now
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import type { IProductRepository } from "@/infrastructure/repositories/ProductRepository/IProductRepository";

/**
 * Product Usecase - Xử lý logic nghiệp vụ liên quan đến Product.
 * Sử dụng repository để tương tác với dữ liệu.
 */
export class ProductUsecase {
  constructor(private productRepository: IProductRepository) {}

  /**
   * Lấy danh sách products với phân trang.
   */
  async getAllProducts(
    params: PaginationParams
  ): Promise<ApiResponse<PaginationResponse<ProductResponse>>> {
    return await this.productRepository.getAllProducts(params);
  }

  /**
   * Lấy thông tin product theo id.
   */
  async getProductById(id: string): Promise<ApiResponse<ProductResponse>> {
    return await this.productRepository.getProductById(id);
  }

  /**
   * Thêm product mới.
   */
  async addProduct(request: FormData): Promise<ApiResponse<ProductResponse>> { // Browser's FormData (global)
    return await this.productRepository.addProduct(request);
  }

  /**
   * Xóa product theo id.
   */
  async deleteProduct(id: string): Promise<ApiResponse<ProductResponse>> {
    return await this.productRepository.deleteProduct(id);
  }

  /**
   * Cập nhật product.
   */
  async updateProduct(request: FormData): Promise<ApiResponse<ProductResponse>> { // Browser's FormData (global)
    return await this.productRepository.updateProduct(request);
  }

  // Image methods removed for now
}