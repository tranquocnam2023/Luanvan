export class RoleFunctionRequest {
    RoleId: string;
    FunctionId: string;
    IsActive: boolean;
    constructor({ RoleId, FunctionId, IsActive }: { RoleId: string; FunctionId: string; IsActive: boolean }) {
        this.RoleId = RoleId;
        this.FunctionId = FunctionId;
        this.IsActive = IsActive;
    }
}