// RoleStore: No changes needed, but ensured safe fallback in getter
import { RoleRepository } from '@/infrastructure/repositories/RoleRepository/RoleRepository'
import { RoleUsecase } from '../usecases/RoleUsecase'
import type { RoleResponse } from '@/domain/entities/RoleDTOs/RoleResponse'
import { defineStore } from 'pinia'
import type { PaginationParams } from '@/domain/values-objects/PaginationParams'
import type { PaginationResponse } from '@/domain/values-objects/PaginationResponse'
import type { RoleRequest } from '@/domain/entities/RoleDTOs/RoleRequest'
import type { ApiResponse } from '@/domain/values-objects/ApiResponse'
import type { RoleFunctionResponse } from '@/domain/entities/RoleFunctionDTOs/RoleFunctionResponse'

const roleRepository = new RoleRepository()
const roleUsecase = new RoleUsecase(roleRepository)

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: null as PaginationResponse<RoleResponse> | null,
    roleFunctions: null as RoleFunctionResponse[] | null,
    selectedRole: null as RoleResponse | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async getAllRoles(params: PaginationParams = { pageIndex: 1, pageSize: 1000 }) {
      this.loading = true
      this.error = null
      try {
        const response = await roleUsecase.getAllRoles(params)
        if (response.success == true && response.data) {
          this.roles = response.data
        } else {
          throw new Error(response.message || 'Lấy danh sách vai trò thất bại')
        }
      } catch (error: any) {
        this.error = error.message || 'Lỗi không xác định khi lấy danh sách vai trò'
        this.roles = null
      } finally {
        this.loading = false
      }
    },
    async getAllRoleFunctions() {
      this.loading = true
      this.error = null
      try {
        const response = await roleUsecase.getAllRoleFunction()
        if (response) {
          this.roleFunctions = response
        } else {
          throw new Error('Lấy danh sách chức năng thất bại')
        }
      } catch (error: any) {
        this.error = error.message || 'Lỗi không xác định khi lấy danh sách chức năng'
        this.roleFunctions = []
      } finally {
        this.loading = false
      }
    },

    async getRoleById(roleId: string) {
      this.loading = true
      this.error = null
      try {
        const response = await roleUsecase.getRoleById(roleId)
        if (response.success == true && response.data) {
          return response.data
        } else {
          throw new Error(response.message || 'Lấy thông tin vai trò thất bại')
        }
      } catch (error: any) {
        this.error = error.message || 'Lỗi không xác định khi lấy thông tin vai trò'
        return null
      } finally {
        this.loading = false
      }
    },

    async addRoles(request: RoleRequest): Promise<ApiResponse<RoleResponse>> {
      this.loading = true
      this.error = null
      try {
        const response = await roleUsecase.addRole(request)
        if (response.success == true && response.data) {
          await this.getAllRoles() // Refresh the roles list after adding
          return response
        } else {
          throw new Error(response.message || 'Thêm vai trò thất bại')
        }
      } catch (error: any) {
        this.error = error.message || 'Lỗi không xác định khi thêm vai trò'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateRoles(request: RoleRequest): Promise<ApiResponse<RoleResponse>> {
      this.loading = true
      this.error = null
      try {
        const response = await roleUsecase.updateRole(request)
        if (response.success == true && response.data) {
          await this.getAllRoles() // Refresh the roles list after updating
          return response
        } else {
          throw new Error(response.message || 'Cập nhật vai trò thất bại')
        }
      } catch (error: any) {
        this.error = error.message || 'Lỗi không xác định khi cập nhật vai trò'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteRoles(roleId: string): Promise<ApiResponse<RoleResponse>> {
      this.loading = true
      this.error = null
      try {
        const response = await roleUsecase.deleteRole(roleId)
        if (response.success == true) {
          await this.getAllRoles() // Refresh the roles list after deleting
          return response
        } else {
          throw new Error(response.message || 'Xóa vai trò thất bại')
        }
      } catch (error: any) {
        this.error = error.message || 'Lỗi không xác định khi xóa vai trò'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearSelectedRole() {
      this.roles = null
    },

    clearError() {
      this.error = null
    },
  },
  getters: {
    getRoles: (state) => state.roles?.data || [], // Safe extraction for dropdown
    getPaginationInfo: (state) => state.roles,
    isEmpty: (state) => !state.roles || state.roles.totalCounts === 0,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getSelectedUser: (state) => state.selectedRole,
  },
})
