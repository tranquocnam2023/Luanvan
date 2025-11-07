<<<<<<< HEAD
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import type { ProductResponse } from "@/domain/entities/ProductDTOs/ProductResponse";
import type { ProductImageResponse } from "@/domain/entities/ProductImageDTOs/ProductImageResponse";
import type { ProductImageRequest } from "@/domain/entities/ProductImageDTOs/ProductImageRequest";
// Removed: import type { FormData } from 'formdata-node'; — Use browser's global FormData

export interface IProductRepository {
  getAllProducts(params: PaginationParams): Promise<ApiResponse<PaginationResponse<ProductResponse>>>;
  getProductById(id: string): Promise<ApiResponse<ProductResponse>>;
  addProduct(request: FormData): Promise<ApiResponse<ProductResponse>>; // Browser's FormData (global)
  deleteProduct(id: string): Promise<ApiResponse<ProductResponse>>;
  updateProduct(request: FormData): Promise<ApiResponse<ProductResponse>>; // Browser's FormData (global)
  // getProductImages(productId: string): Promise<ApiResponse<ProductImageResponse[]>>;
  // addProductImage(request: FormData): Promise<ApiResponse<ProductImageResponse>>; // Browser's FormData (global)
  // updateProductImage(request: ProductImageRequest): Promise<ApiResponse<ProductImageResponse>>;
  // deleteProductImage(id: number): Promise<ApiResponse<ProductImageResponse>>;
=======
import type { ProductRequest } from "@/domain/entities/ProductDTOs/ProductRequest";
import type { ProductResponse } from "@/domain/entities/ProductDTOs/ProductResponse";
import type { ProductImageRequest } from "@/domain/entities/ProductImageDTOs/ProductImageRequest";
import type { ProductImageResponse } from "@/domain/entities/ProductImageDTOs/ProductImageResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";

export interface IProductRepository {
    getAllProducts(params: PaginationParams): Promise<ApiResponse<PaginationResponse<ProductResponse>>>;
    getProductById(id: string): Promise<ApiResponse<ProductResponse>>;
    addProduct(request: ProductRequest): Promise<ApiResponse<ProductResponse>>;
    updateProduct(request: ProductRequest): Promise<ApiResponse<ProductResponse>>;
    deleteProduct(id: string): Promise<ApiResponse<ProductResponse>>;

    // Product Image methods
    getProductImages(productId: string): Promise<ApiResponse<ProductImageResponse[]>>;
    addProductImage(request: ProductImageRequest): Promise<ApiResponse<ProductImageResponse>>;
    updateProductImage(request: ProductImageRequest): Promise<ApiResponse<ProductImageResponse>>;
    deleteProductImage(id: number): Promise<ApiResponse<ProductImageResponse>>;
>>>>>>> master
}