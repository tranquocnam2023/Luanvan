import type { RoleFunctionRequest } from "../RoleFunctionDTOs/RoleFunctionRequest";

export class RoleRequest{
    RoleId:string;
    RoleName:string;
    roleFunctionRequests: RoleFunctionRequest[];

    constructor({RoleId, RoleName, roleFunctionRequests}: {RoleId:string; RoleName:string; roleFunctionRequests: RoleFunctionRequest[]}) {
        this.RoleId = RoleId;
        this.RoleName = RoleName;
        this.roleFunctionRequests = roleFunctionRequests;
    }
}