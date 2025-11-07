
// src/infrastructure/repositories/ProductRepository/ProductRepository.ts (assuming path)

import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { IProductRepository } from "./IProductRepository";
import { ApiResponse } from "@/domain/values-objects/ApiResponse";
import { http } from "@/infrastructure/api/http";
import { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import { ProductResponse } from "@/domain/entities/ProductDTOs/ProductResponse";
import { ProductImageResponse } from "@/domain/entities/ProductImageDTOs/ProductImageResponse";
// Removed: import type { FormData } from 'formdata-node'; — Use browser's global FormData

import type { ProductImageRequest } from "@/domain/entities/ProductImageDTOs/ProductImageRequest";

export class ProductRepository implements IProductRepository {
  /**
   * Lấy danh sách products với phân trang.
   */
  async getAllProducts(params: PaginationParams): Promise<ApiResponse<PaginationResponse<ProductResponse>>> {
    try {

      // Default to page 1, size 9 as per UI
      const requestParams = { ...params, pageIndex: params.pageIndex ?? 1, pageSize: params.pageSize ?? 9 };
      const response = await http.post("/Product/GetAllProduct", requestParams);

      const apiResponse = ApiResponse.fromJson<PaginationResponse<ProductResponse>>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Lấy danh sách products thất bại");
      }

      // FIX: Ensure rawItems is always array before map
      let rawItems = apiResponse.data?.data ?? [];

      const items = rawItems.map((item: any) => ProductResponse.fromJSON(item));

      // Since BE response is flat array without pagination metadata,
      // wrap it in PaginationResponse assuming all data is on current page
      // (totalPages = 1, totalCounts = data.length)
      const paginatedData = new PaginationResponse<ProductResponse>(
        items,
        items.length,
        requestParams.pageIndex,
        requestParams.pageSize
      );

      // Return wrapped in ApiResponse<PaginationResponse<ProductResponse>>
      return {
        ...apiResponse,
        data: paginatedData,
      } as ApiResponse<PaginationResponse<ProductResponse>>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi lấy danh sách products");
    }
  }

  /**
   * Lấy thông tin product theo id.
   */
  async getProductById(id: string): Promise<ApiResponse<ProductResponse>> {
    try {
      const response = await http.get(`/Product/${id}/GetProductById`);


      const apiResponse = ApiResponse.fromJson<ProductResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Lấy thông tin product thất bại");
      }

      // FIX: Map raw plain data to ProductResponse instance
      const mappedData = apiResponse.data ? ProductResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<ProductResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi lấy thông tin product");
    }
  }

  /**
   * Thêm product mới.
   */

  async addProduct(request: FormData): Promise<ApiResponse<ProductResponse>> { // Browser's FormData (global)
    try {
      const response = await http.post("/Product/AddNewProduct", request); // http handles FormData


      const apiResponse = ApiResponse.fromJson<ProductResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Thêm product thất bại");
      }

      // FIX: Map raw plain data to ProductResponse instance
      const mappedData = apiResponse.data ? ProductResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<ProductResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi thêm product");
    }
  }

  /**
   * Xóa product theo id.
   */
  async deleteProduct(id: string): Promise<ApiResponse<ProductResponse>> {
    try {

      const response = await http.delete(`/Product/${id}/DeleteProduct`);


      const apiResponse = ApiResponse.fromJson<ProductResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Xóa product thất bại");
      }

      // FIX: Map raw plain data to ProductResponse instance (safe if data null/empty after delete)
      const mappedData = apiResponse.data ? ProductResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<ProductResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi xóa product");
    }
  }

  /**
   * Cập nhật product.
   */

  async updateProduct(request: FormData): Promise<ApiResponse<ProductResponse>> { // Browser's FormData (global)
    try {
      const response = await http.put("/Product/UpdateProduct", request); // http handles FormData


      const apiResponse = ApiResponse.fromJson<ProductResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Cập nhật product thất bại");
      }

      // FIX: Map raw plain data to ProductResponse instance
      const mappedData = apiResponse.data ? ProductResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<ProductResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi cập nhật product");
    }
  }

  /**
   * Lấy danh sách product images theo product id.
   */
  async getProductImages(productId: string): Promise<ApiResponse<ProductImageResponse[]>> {
    try {
      const response = await http.get(`/ProductImage/GetProductImages?productId=${productId}`);

      const apiResponse = ApiResponse.fromJson<ProductImageResponse[]>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Lấy danh sách product images thất bại");
      }

      // FIX: Map raw plain data (lowercase keys) to ProductImageResponse instances (capitalized properties)
      const rawItems = apiResponse.data ?? [];
      const items = rawItems.map((item: any) => ProductImageResponse.fromJSON(item));

      return {
        ...apiResponse,
        data: items,
      } as ApiResponse<ProductImageResponse[]>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi lấy danh sách product images");
    }
  }

  /**
   * Thêm product image mới.
   */
  async addProductImage(request: FormData): Promise<ApiResponse<ProductImageResponse>> { // Browser's FormData (global)
    try {
      const response = await http.post("/ProductImage/AddProductImage", request); // http handles FormData


      const apiResponse = ApiResponse.fromJson<ProductImageResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Thêm product image thất bại");
      }

      // FIX: Map raw plain data to ProductImageResponse instance
      const mappedData = apiResponse.data ? ProductImageResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<ProductImageResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi thêm product image");
    }
  }

  /**
   * Cập nhật product image.
   */
  async updateProductImage(request: ProductImageRequest): Promise<ApiResponse<ProductImageResponse>> {
    try {
      const response = await http.put("/ProductImage/UpdateProductImage", request);

      const apiResponse = ApiResponse.fromJson<ProductImageResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Cập nhật product image thất bại");
      }

      // FIX: Map raw plain data to ProductImageResponse instance
      const mappedData = apiResponse.data ? ProductImageResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<ProductImageResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi cập nhật product image");
    }
  }

  /**
   * Xóa product image theo id.
   */
  async deleteProductImage(id: number): Promise<ApiResponse<ProductImageResponse>> {
    try {
      const response = await http.delete(`/ProductImage/DeleteProductImage?id=${id}`);

      const apiResponse = ApiResponse.fromJson<ProductImageResponse>(response);

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Xóa product image thất bại");
      }

      // FIX: Map raw plain data to ProductImageResponse instance (safe if data null/empty after delete)
      const mappedData = apiResponse.data ? ProductImageResponse.fromJSON(apiResponse.data) : null;

      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<ProductImageResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi xóa product image");
    }
  }
}