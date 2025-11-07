import { RoleFunctionResponse } from "../RoleFunctionDTOs/RoleFunctionResponse";

export class RoleResponse{
    RoleId: string;
    RoleName: string;
    RoleFunctions: RoleFunctionResponse[];

    constructor({ RoleId, RoleName, RoleFunctions }: { RoleId: string; RoleName: string; RoleFunctions: RoleFunctionResponse[] }) {
        this.RoleId = RoleId;
        this.RoleName = RoleName;
        this.RoleFunctions = RoleFunctions;
    }

    static fromJSON(json:any): RoleResponse {
        return new RoleResponse({
            RoleId: json.roleId,
            RoleName: json.roleName,
            RoleFunctions: json.roleFunctions.map((func:any) => RoleFunctionResponse.fromJSON(func))
        });
    }
}