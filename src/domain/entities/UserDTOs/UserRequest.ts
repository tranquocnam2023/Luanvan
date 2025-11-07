export class UserRequest {
    Username: string;
    Password: string;
    FullName: string;
    RoleId: string;
    
    constructor({ Username, Password, FullName, RoleId }: { Username: string; Password: string; FullName: string; RoleId: string }) {
        this.Username = Username;
        this.Password = Password;
        this.FullName = FullName;
        this.RoleId = RoleId;
    }

}