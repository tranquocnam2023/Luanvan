// Fixed RoleRepository: Use POST with direct params body (not wrapped in { params }), improved mapping and error handling
import { RoleResponse } from '@/domain/entities/RoleDTOs/RoleResponse'
import type { IRoleRepository } from './IRoleRepository'
import { ApiResponse } from '@/domain/values-objects/ApiResponse'
import { http } from '@/infrastructure/api/http'
import type { PaginationParams } from '@/domain/values-objects/PaginationParams'
import { PaginationResponse } from '@/domain/values-objects/PaginationResponse'
import type { RoleRequest } from '@/domain/entities/RoleDTOs/RoleRequest'
import { RoleFunctionResponse } from '@/domain/entities/RoleFunctionDTOs/RoleFunctionResponse'
import axios from 'axios'

export class RoleRepository implements IRoleRepository {
  async getAllRoles(
    params: PaginationParams,
  ): Promise<ApiResponse<PaginationResponse<RoleResponse>>> {
    try {
      // Use POST with direct params as body (e.g., { "pageIndex": 1, "pageSize": 10 })
      const response = await http.post('/Role/GetAllRole', params)
      const apiResponse = ApiResponse.fromJson<PaginationResponse<RoleResponse>>(response)
      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || 'Lấy danh sách vai trò thất bại')
      }
      const rawItems = apiResponse.data?.data ?? []
      const mappedItems = rawItems.map((item: any) => RoleResponse.fromJSON(item))
      const paginatedData = new PaginationResponse<RoleResponse>(
        mappedItems,
        apiResponse.data?.totalCounts ?? mappedItems.length,
        params.pageIndex,
        params.pageSize,
      )

      return {
        ...apiResponse,
        data: paginatedData,
      } as ApiResponse<PaginationResponse<RoleResponse>>
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi lấy danh sách roles',
        data: null,
      } as ApiResponse<PaginationResponse<RoleResponse>>
    }
  }

  async getRoleById(roleId: string): Promise<ApiResponse<RoleResponse>> {
    try {
      const response = await http.get(`/Role/${encodeURIComponent(roleId)}/GetRoleById`)
      const apiResponse = ApiResponse.fromJson<RoleResponse>(response)
      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || 'Lấy thông tin vai trò thất bại')
      }
      const rawItem = apiResponse.data
      const mappedData = rawItem ? RoleResponse.fromJSON(rawItem) : null
      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<RoleResponse>
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi lấy thông tin role',
        data: null,
      } as ApiResponse<RoleResponse>
    }
  }

  async addRole(request: RoleRequest): Promise<ApiResponse<RoleResponse>> {
    try {
      const response = await http.post('/Role/AddRole', request)
      const apiResponse = ApiResponse.fromJson<RoleResponse>(response)
      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || 'Thêm vai trò thất bại')
      }
      const rawItem = apiResponse.data
      const mappedData = rawItem ? RoleResponse.fromJSON(rawItem) : null
      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<RoleResponse>
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi thêm role',
        data: null,
      } as ApiResponse<RoleResponse>
    }
  }

  async deleteRole(roleId: string): Promise<ApiResponse<RoleResponse>> {
    try {
      const response = await http.delete(`/Role/${encodeURIComponent(roleId)}/DeleteRole`)
      const apiResponse = ApiResponse.fromJson<RoleResponse>(response)
      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || 'Xóa vai trò thất bại')
      }
      const rawItem = apiResponse.data
      const mappedData = rawItem ? RoleResponse.fromJSON(rawItem) : null
      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<RoleResponse>
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi xóa role',
        data: null,
      } as ApiResponse<RoleResponse>
    }
  }

  async updateRole(request: RoleRequest): Promise<ApiResponse<RoleResponse>> {
    try {
      const response = await http.put('/Role/UpdateRole', request)
      const apiResponse = ApiResponse.fromJson<RoleResponse>(response)
      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || 'Cập nhật vai trò thất bại')
      }
      const rawItem = apiResponse.data
      const mappedData = rawItem ? RoleResponse.fromJSON(rawItem) : null
      return {
        ...apiResponse,
        data: mappedData,
      } as ApiResponse<RoleResponse>
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi không xác định khi cập nhật role',
        data: null,
      } as ApiResponse<RoleResponse>
    }
  }
  async getAllRoleFunction(): Promise<RoleFunctionResponse[]> {
    try {
      const response = await http.get('/Role/GetAllFunctionRole')
      const mappedData = response.data.map((item: any) => RoleFunctionResponse.fromJSON(item))
      return mappedData
    } catch (error: any) {
      throw new Error(error.message || 'Lỗi không xác định khi lấy danh sách chức năng')
    }
  }
}
