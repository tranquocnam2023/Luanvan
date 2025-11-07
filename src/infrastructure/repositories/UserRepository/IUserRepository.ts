import type { AddNewUserRequest } from "@/domain/entities/UserDTOs/AddNewUserRequest";
import type { UserRequest } from "@/domain/entities/UserDTOs/UserRequest";
import type { UserResponse } from "@/domain/entities/UserDTOs/UserResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";

export interface IUserRepository {
  getAllUsers(params: PaginationParams): Promise<ApiResponse<PaginationResponse<UserResponse>>>;
  getUserById(username: string): Promise<ApiResponse<UserResponse>>;
  addUser(request: AddNewUserRequest): Promise<ApiResponse<UserResponse>>;
  deleteUser(username: string): Promise<ApiResponse<UserResponse>>;
  updateUser(request: UserRequest): Promise<ApiResponse<UserResponse>>;
}