// FunctionUsecase.ts (Similar to SupplierUsecase)
import { FunctionRepository } from '@/infrastructure/repositories/FunctionRepository/FunctionRepository'
import type { FunctionResponse } from '@/domain/entities/FunctionDTOs/FunctionResponse'
import type { PaginationParams } from '@/domain/values-objects/PaginationParams'
import type { FunctionRequest } from '@/domain/entities/FunctionDTOs/FunctionRequest' // Assume exists
import { ApiResponse } from '@/domain/values-objects/ApiResponse'
import { PaginationResponse } from '@/domain/values-objects/PaginationResponse'

export class FunctionUsecase {
  private repository: FunctionRepository

  constructor(repository: FunctionRepository) {
    this.repository = repository
  }

  async getAllFunctions(params: PaginationParams): Promise<ApiResponse<PaginationResponse<FunctionResponse>>> {
    return await this.repository.getAllFunctions(params)
  }

  async getFunctionById(id: string): Promise<ApiResponse<FunctionResponse>> {
    return await this.repository.getFunctionById(id)
  }

  async addFunction(request: FunctionRequest): Promise<ApiResponse<FunctionResponse>> {
    return await this.repository.addFunction(request)
  }

  async updateFunction(request: FunctionRequest): Promise<ApiResponse<FunctionResponse>> {
    return await this.repository.updateFunction(request)
  }

  async deleteFunction(id: string): Promise<ApiResponse<FunctionResponse>> {
    return await this.repository.deleteFunction(id)
  }
}