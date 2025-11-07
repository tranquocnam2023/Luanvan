// src/domain/usecases/AuthUseCase.ts
import type { AuthRequest } from "@/domain/entities/AuthDTOs/AuthRequest";
import type { AuthResponse } from "@/domain/entities/AuthDTOs/AuthResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { IAuthRepository } from "@/infrastructure/repositories/AuthRepository/IAuthRepository";

export class AuthUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(authRequest: AuthRequest): Promise<ApiResponse< AuthResponse>> {
    return await this.authRepository.login(authRequest);
  }
}