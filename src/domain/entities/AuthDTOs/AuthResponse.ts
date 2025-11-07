export class AuthResponse {
    Username: string;
    FullName: string;
    RoleId: string;

    constructor({ Username, FullName, RoleId }: { Username: string; FullName: string; RoleId: string }) {
        this.Username = Username;
        this.FullName = FullName;
        this.RoleId = RoleId;
    }   

    static fromJSON(json:any): AuthResponse {
        return new AuthResponse({
            Username: json.userName,
            FullName: json.fullName,
            RoleId: json.roleId
        });
    }
}