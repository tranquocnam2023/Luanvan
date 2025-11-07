// UserUseCase.ts (no changes needed, but confirming return types)
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import type { UserResponse } from "@/domain/entities/UserDTOs/UserResponse";
import type { UserRequest } from "@/domain/entities/UserDTOs/UserRequest";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { IUserRepository } from "@/infrastructure/repositories/UserRepository/IUserRepository";
import type { AddNewUserRequest } from "@/domain/entities/UserDTOs/AddNewUserRequest";

export class UserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers(params: PaginationParams): Promise<ApiResponse<PaginationResponse<UserResponse>>> {
    return await this.userRepository.getAllUsers(params);
  }

  async getUserById(username: string): Promise<ApiResponse<UserResponse>> {
    return await this.userRepository.getUserById(username);
  }

  async addUser(request: AddNewUserRequest): Promise<ApiResponse<UserResponse>> {
    return await this.userRepository.addUser(request);
  }

  async updateUser(request: UserRequest): Promise<ApiResponse<UserResponse>> {
    return await this.userRepository.updateUser(request);
  }

  async deleteUser(username: string): Promise<ApiResponse<UserResponse>> {
    return await this.userRepository.deleteUser(username);
  }
}