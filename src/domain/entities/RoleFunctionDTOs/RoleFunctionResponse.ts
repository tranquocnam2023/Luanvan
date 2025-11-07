import type { fromJSON } from "postcss";

export class RoleFunctionResponse{
    FunctionId: string;
    FunctionName: string;
    IsActive: boolean;

    constructor({ FunctionId, FunctionName, IsActive }: { FunctionId: string; FunctionName: string; IsActive: boolean }) {
        this.FunctionId = FunctionId;
        this.FunctionName = FunctionName;
        this.IsActive = IsActive;
    }

    static fromJSON(json:any): RoleFunctionResponse {
        return new RoleFunctionResponse({
            FunctionId: json.functionId,
            FunctionName: json.functionName,
            IsActive: json.isActive
        });
    }
}