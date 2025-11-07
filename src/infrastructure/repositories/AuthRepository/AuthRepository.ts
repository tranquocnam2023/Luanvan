// src/infrastructure/repositories/AuthRepository/AuthRepository.ts
import type { AuthRequest } from "@/domain/entities/AuthDTOs/AuthRequest";
import type { IAuthRepository } from "./IAuthRepository";
import { AuthResponse } from "@/domain/entities/AuthDTOs/AuthResponse";
import { http } from "@/infrastructure/api/http";
import { ApiResponse } from "@/domain/values-objects/ApiResponse";

export class AuthRepository implements IAuthRepository {
  async login(authRequest: AuthRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await http.post("/Auth/Login", authRequest);


      // Map JSON -> ApiResponse object
      const apiResponse = ApiResponse.fromJson<AuthResponse>(response);

      if (!apiResponse.isSuccess()) {
        throw new Error(apiResponse.message || "Đăng nhập thất bại");
      }

           const mappedData = apiResponse.data ? AuthResponse.fromJSON(apiResponse.data) : null;
     
           return {
             ...apiResponse,
             data: mappedData,
           } as ApiResponse<AuthResponse>;
    } catch (error: any) {
      throw new Error(error.message || "Lỗi không xác định khi xác thực");
    }
  }
}