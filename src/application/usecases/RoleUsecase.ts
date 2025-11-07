import type { RoleRequest } from "@/domain/entities/RoleDTOs/RoleRequest";
import type { RoleResponse } from "@/domain/entities/RoleDTOs/RoleResponse";
import type { RoleFunctionResponse } from "@/domain/entities/RoleFunctionDTOs/RoleFunctionResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";
import type { IRoleRepository } from "@/infrastructure/repositories/RoleRepository/IRoleRepository";

export class RoleUsecase{
    constructor(private readonly roleRepository: IRoleRepository) {}

    async getAllRoles(params: PaginationParams): Promise<ApiResponse<PaginationResponse<RoleResponse>>> {
        return this.roleRepository.getAllRoles(params);
    }

    async getRoleById(roleId: string): Promise<ApiResponse<RoleResponse>> {
        return this.roleRepository.getRoleById(roleId);
    }

    async addRole(request: RoleRequest): Promise<ApiResponse<RoleResponse>> {
        return this.roleRepository.addRole(request);
    }

    async updateRole(request: RoleRequest): Promise<ApiResponse<RoleResponse>> {
        return this.roleRepository.updateRole(request);
    }
    async deleteRole(roleId: string): Promise<ApiResponse<RoleResponse>> {
        return this.roleRepository.deleteRole(roleId);
    }   

    async getAllRoleFunction() : Promise<RoleFunctionResponse[]>{
        return this.roleRepository.getAllRoleFunction();
    }

}