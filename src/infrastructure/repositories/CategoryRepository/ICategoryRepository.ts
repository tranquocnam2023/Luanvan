import type { CategoryRequest } from "@/domain/entities/CatergoryDTOs/CategoryRequest";
import type { CategoryResponse } from "@/domain/entities/CatergoryDTOs/CategoryResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";

export interface ICategoryRepository {
    getAllCategories(params: PaginationParams): Promise<ApiResponse<PaginationResponse<CategoryResponse>>>;
    getCategoryById(id: number): Promise<ApiResponse<CategoryResponse>>;
    addCategory(request: CategoryRequest): Promise<ApiResponse<CategoryResponse>>;
    updateCategory(request: CategoryRequest): Promise<ApiResponse<CategoryResponse>>;
    deleteCategory(id: number): Promise<ApiResponse<CategoryResponse>>;
}