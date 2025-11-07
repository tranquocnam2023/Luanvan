import type { FunctionRequest } from "@/domain/entities/FunctionDTOs/FunctionRequest";
import type { FunctionResponse } from "@/domain/entities/FunctionDTOs/FunctionResponse";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import type { PaginationResponse } from "@/domain/values-objects/PaginationResponse";

export interface IFunctionRepository {
    getAllFunctions(params: PaginationParams):Promise<ApiResponse<PaginationResponse<FunctionResponse>>>;
    getFunctionById(id: string):Promise<ApiResponse<FunctionResponse>>;
    addFunction(request: FunctionRequest):Promise<ApiResponse<FunctionResponse>>;
    deleteFunction(id: string): Promise<ApiResponse<FunctionResponse>>;
    updateFunction (request: FunctionRequest): Promise<ApiResponse<FunctionResponse>>;
}