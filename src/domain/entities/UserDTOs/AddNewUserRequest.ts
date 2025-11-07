export class AddNewUserRequest {
    FullName: string;
    RoleId: string;

    constructor({ FullName, RoleId }: { FullName: string; RoleId: string }) {
        this.FullName = FullName;
        this.RoleId = RoleId;
    }
}