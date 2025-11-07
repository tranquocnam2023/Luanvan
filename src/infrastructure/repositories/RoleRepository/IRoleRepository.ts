import type { RoleRequest } from "@/domain/entities/RoleDTOs/RoleRequest";
import type { RoleResponse } from "@/domain/entities/RoleDTOs/RoleResponse";
import type { RoleFunctionResponse } from "@/domain/entities/RoleFunctionDTOs/RoleFunctionResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";

export interface IRoleRepository {
    getAllRoles(params: PaginationParams): Promise<ApiResponse<PaginationResponse<RoleResponse>>>;
    getRoleById(roleId: string): Promise<ApiResponse<RoleResponse>>;
    addRole(request: RoleRequest): Promise<ApiResponse<RoleResponse>>;
    deleteRole(roleId: string): Promise<ApiResponse<RoleResponse>>;
    updateRole(request: RoleRequest): Promise<ApiResponse<RoleResponse>>;
    getAllRoleFunction() :Promise <RoleFunctionResponse[]>;
}