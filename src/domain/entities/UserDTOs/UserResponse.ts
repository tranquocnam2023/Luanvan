export class UserResponse {
    Username: string;
    FullName: string;
    RoleId: string;
    RoleName: string;

    constructor({ Username, FullName, RoleId, RoleName }: { Username: string; FullName: string; RoleId: string; RoleName: string }) {
        this.Username = Username;
        this.FullName = FullName;
        this.RoleId = RoleId;
        this.RoleName = RoleName;
    }
    static fromJSON(json:any): UserResponse {
        return new UserResponse({
            Username: json.username,
            FullName: json.fullName,
            RoleId: json.roleId,
            RoleName: json.roleName
        });
    }
}