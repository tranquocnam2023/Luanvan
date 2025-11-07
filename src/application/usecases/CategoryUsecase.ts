import type { CategoryRequest } from "@/domain/entities/CatergoryDTOs/CategoryRequest";
import type { CategoryResponse } from "@/domain/entities/CatergoryDTOs/CategoryResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import type { ICategoryRepository } from "@/infrastructure/repositories/CategoryRepository/ICategoryRepository";

/**
 * Category Usecase - Xử lý logic nghiệp vụ liên quan đến Category.
 * Sử dụng repository để tương tác với dữ liệu.
 */
export class CategoryUsecase {
  constructor(private categoryRepository: ICategoryRepository) {}

  /**
   * Lấy danh sách categories với phân trang.
   */
  async getAllCategories(
    params: PaginationParams
  ): Promise<ApiResponse<PaginationResponse<CategoryResponse>>> {
    return await this.categoryRepository.getAllCategories(params);
  }

  /**
   * Lấy thông tin category theo id.
   */
  async getCategoryById(id: number): Promise<ApiResponse<CategoryResponse>> {
    return await this.categoryRepository.getCategoryById(id);
  }

  /**
   * Thêm category mới.
   */
  async addCategory(request: CategoryRequest): Promise<ApiResponse<CategoryResponse>> {
    return await this.categoryRepository.addCategory(request);
  }

  /**
   * Xóa category theo id.
   */
  async deleteCategory(id: number): Promise<ApiResponse<CategoryResponse>> {
    return await this.categoryRepository.deleteCategory(id);
  }

  /**
   * Cập nhật category.
   */
  async updateCategory(request: CategoryRequest): Promise<ApiResponse<CategoryResponse>> {
    return await this.categoryRepository.updateCategory(request);
  }
}