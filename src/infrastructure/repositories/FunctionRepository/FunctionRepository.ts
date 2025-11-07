import { FunctionResponse } from '@/domain/entities/FunctionDTOs/FunctionResponse'
import { ApiResponse } from '@/domain/values-objects/ApiResponse'
import type { PaginationParams } from '@/domain/values-objects/PaginationParams'
import { PaginationResponse } from '@/domain/values-objects/PaginationResponse'
import type { IFunctionRepository } from './IFunctionRepository'
import { http } from '@/infrastructure/api/http'

export class FunctionRepository implements IFunctionRepository {
  async getAllFunctions(
    params: PaginationParams,
  ): Promise<ApiResponse<PaginationResponse<FunctionResponse>>> {
    try {
      const response = await http.post('/Function/GetAllFunctions', params)
      const apiResponse = ApiResponse.fromJson<PaginationResponse<FunctionResponse>>(response)
      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || 'Lấy danh sách chức năng thất bại')
      }

      const rawItems = apiResponse.data?.data ?? []
      const mappedItems = rawItems.map((item: any) => FunctionResponse.fromJSON(item))
      const paginatedData = new PaginationResponse<FunctionResponse>(
        mappedItems,
        apiResponse.data?.totalCounts ?? mappedItems.length,
        params.pageIndex,
        params.pageSize,
      )
      return {
        ...apiResponse,
        data: paginatedData,
      } as ApiResponse<PaginationResponse<FunctionResponse>>
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi lấy danh sách chức năng ',
        data: null,
      } as ApiResponse<PaginationResponse<FunctionResponse>>
    }
  }

  async getFunctionById(id: string): Promise<ApiResponse<FunctionResponse>> {
    try {
      const response = await http.get(`/Function/${id}/GetFunctionById`)
      const apiResponse = ApiResponse.fromJson<FunctionResponse>(response)
      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || 'Lấy chức năng thất bại')
      }

      const rawItem = apiResponse.data || null
      const mappedItem = rawItem ? FunctionResponse.fromJSON(rawItem) : null
      return {
        ...apiResponse,
        data: mappedItem,
      } as ApiResponse<FunctionResponse>
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi lấy chức năng',
        data: null,
      } as ApiResponse<FunctionResponse>
    }
  }

  async addFunction(request: any): Promise<ApiResponse<FunctionResponse>> { // Assume FunctionRequest type
    try {
      const response = await http.post('/Function/AddNewFunction', request)
      const apiResponse = ApiResponse.fromJson<FunctionResponse>(response)
      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || 'Thêm chức năng thất bại')
      }

      const rawItem = apiResponse.data || null
      const mappedItem = rawItem ? FunctionResponse.fromJSON(rawItem) : null
      return {
        ...apiResponse,
        data: mappedItem,
      } as ApiResponse<FunctionResponse>
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi thêm chức năng',
        data: null,
      } as ApiResponse<FunctionResponse>
    }
  }

  async updateFunction(request: any): Promise<ApiResponse<FunctionResponse>> { // Assume FunctionRequest type
    try {
      const response = await http.put('/Function/UpdateFunction', request)
      const apiResponse = ApiResponse.fromJson<FunctionResponse>(response)
      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || 'Cập nhật chức năng thất bại')
      }

      const rawItem = apiResponse.data || null
      const mappedItem = rawItem ? FunctionResponse.fromJSON(rawItem) : null
      return {
        ...apiResponse,
        data: mappedItem,
      } as ApiResponse<FunctionResponse>
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi cập nhật chức năng',
        data: null,
      } as ApiResponse<FunctionResponse>
    }
  }

  async deleteFunction(id: string): Promise<ApiResponse<FunctionResponse>> {
    try {
      const response = await http.delete(`/Function/${id}/DeleteFunction/`)
      const apiResponse = ApiResponse.fromJson<FunctionResponse>(response)
      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || 'Xóa chức năng thất bại')
      }
      // Assuming the API returns the deleted entity or null; adjust if API returns void
      const rawItem = apiResponse.data || null
      const mappedItem = rawItem ? FunctionResponse.fromJSON(rawItem) : null
      return {
        ...apiResponse,
        data: mappedItem,
      } as ApiResponse<FunctionResponse>
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi xóa chức năng',
        data: null,
      } as ApiResponse<FunctionResponse>
    }
  }
}