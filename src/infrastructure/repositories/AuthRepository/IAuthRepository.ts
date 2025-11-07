// src/infrastructure/repositories/AuthRepository/IAuthRepository.ts
import type { AuthRequest } from "@/domain/entities/AuthDTOs/AuthRequest";
import type { AuthResponse } from "@/domain/entities/AuthDTOs/AuthResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";

export interface IAuthRepository {
  login(authRequest: AuthRequest): Promise<ApiResponse<AuthResponse>>;
}