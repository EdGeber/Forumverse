export class User {
    public email = "";
    public name = "";
    public password = "";
    public isAdmin = false;
    public adminToken = "";  // not used if isAdmin == false
}
