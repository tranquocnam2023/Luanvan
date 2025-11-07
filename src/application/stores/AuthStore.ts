// src/infrastructure/stores/authStore.ts (using Pinia)
import { defineStore } from 'pinia'
import type { AuthResponse } from '@/domain/entities/AuthDTOs/AuthResponse'
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository/AuthRepository'
import { AuthUseCase } from '../usecases/AuthUsecase'
import type { ApiResponse } from '@/domain/values-objects/ApiResponse'
import { useRoleStore } from './RoleStore'

const authRepository = new AuthRepository()
const authUseCase = new AuthUseCase(authRepository)

export const useAuthStore = defineStore('auth', {
  state: () => {
    const savedUserJson = localStorage.getItem('user')
    let initialUser: ApiResponse<AuthResponse> | null = null
    let initialAuthenticated = false
    let initialRole: any = null // Để lưu role nếu có trong localStorage

    if (savedUserJson) {
      try {
        const parsed = JSON.parse(savedUserJson)
        const userName = parsed?.data?.Username

        if (typeof userName === 'string' && userName.trim().length > 0) {
          initialUser = parsed as ApiResponse<AuthResponse>
          initialAuthenticated = true
          // Lấy role từ localStorage nếu có
          initialRole = parsed.role || null
        } else {
          throw new Error('Invalid user data')
        }
      } catch (e) {
        console.warn('Failed to parse user from localStorage:', e)
        localStorage.removeItem('user')
      }
    }

    return {
      user: initialUser,
      role: initialRole, // Thêm state cho role
      isAuthenticated: initialAuthenticated,
      loading: false,
      error: null as string | null,
    }
  },

  actions: {
    async login(username: string, password: string) {
      this.loading = true
      this.error = null

      try {
        const authRequest = { Username: username, Password: password }
        this.user = await authUseCase.login(authRequest)

        if (this.user.success && this.user.data) {
          // Lấy RoleId từ AuthResponse
          const roleId = this.user.data.RoleId
          if (roleId) {
            // Gọi getRoleById từ RoleStore
            const roleStore = useRoleStore()
            const roleData = await roleStore.getRoleById(roleId)
            if (roleData) {
              this.role = roleData // Lưu role vào state
            } else {
              console.warn('Không thể lấy thông tin role')
              this.role = null
            }
          }

          this.isAuthenticated = true
          // Lưu toàn bộ user object kèm role vào localStorage
          const dataToSave = {
            ...this.user,
            role: this.role // Thêm role vào object cần lưu
          }
          localStorage.setItem('user', JSON.stringify(dataToSave))
        } else {
          throw new Error('Đăng nhập thất bại: Không nhận được dữ liệu user')
        }
      } catch (error: any) {
        this.error = error.message || 'Đăng nhập thất bại'
        this.isAuthenticated = false
        this.user = null
        this.role = null
        localStorage.removeItem('user')
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.role = null // Xóa role khi logout
      this.isAuthenticated = false
      this.error = null
      // Xóa user khỏi localStorage
      localStorage.removeItem('user')
      // Optionally clear token from localStorage or cookies
    },
  },

  getters: {
    getUser: (state) => state.user,
    getRole: (state) => state.role, // Getter cho role
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
  },
})
