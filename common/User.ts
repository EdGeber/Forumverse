export class User {
    public email = "";
    public name = "";
    public password = "";
    public adminToken = "";  // not used if isAdmin == false

    constructor(public isAdmin=false) { }
}
