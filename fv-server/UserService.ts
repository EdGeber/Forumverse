import { User } from "../common/User";
import { ACK, Ack } from "../common/Ack";

export class UserService {
    private static _registeredUsers: User[] = [];

    // TODO: change to '_availableTokens'
    private static _tokens: string[] = ["123", "456"]; // never remove "123" or "456"

    public static tryRegisterUser(user: User): Ack {
        let ack: Ack;

        if(this._isMissingFieldRegister(user))
            ack = ACK.REGISTER_USER.MISSING_FIELD;

        else if(this._isNameDuplicate(user))
            ack = ACK.REGISTER_USER.DUPLICATE_USERNAME;

        else if(this._isEmailAndPasswordDuplicate(user))
            ack = ACK.REGISTER_USER.DUPLICATE_EMAIL_AND_PASS;

        else if(this._isAdminTokenInvalid(user))
            ack = ACK.REGISTER_USER.INVALID_TOKEN;
            
        else {
            ack = ACK.REGISTER_USER.OK;
            this._registeredUsers.push(user);
        }

        return ack;
    }

    public static tryLoginUser(user: User): Ack<User|null> {
        
        let ack: Ack<User|null>;

        if(this._isMissingFieldLogin(user)) ack = ACK.LOGIN.MISSING_FIELD;

        else {
            // the user passed in only has fields email and password filled in
            let fullUser = this._getFullUserFromLoginInfo(user);
            if(fullUser == undefined) ack = ACK.LOGIN.USER_NOT_FOUND;
            else {
				ack = ACK.LOGIN.OK;
				ack.body = fullUser;
			}
        }        
        return ack;
    }

    private static _isMissingFieldRegister(user: User): boolean {
        let isMissing = user.name == "" || user.email == "" || user.password == "";
        if(user.isAdmin) 
            isMissing = isMissing || user.adminToken == "";
        return isMissing;
    }

    private static _isEmailAndPasswordDuplicate(user: User): boolean {
        return this._registeredUsers
            .find(u =>
                u.email == user.email &&
                u.password == user.password) != undefined;
    }

    private static _isMissingFieldLogin(user: User): boolean {
        return user.email == "" || user.password == "";
    }

    private static _isNameDuplicate(user: User): boolean {
        return this._registeredUsers.find(u => u.name == user.name) != undefined;
    }

    private static _isAdminTokenInvalid(user: User): boolean {
        return user.isAdmin && !(this._tokens.includes(user.adminToken));
    }

    private static _getFullUserFromLoginInfo(user: User): User | undefined {
        return this._registeredUsers.find(u => u.password == user.password && u.email == user.email);
    }

    // ONLY USED FOR TESTING
    public static _clearRegisteredUsers(): void {
        this._registeredUsers.length = 0;
    }
}
