import { Observable, Observer, of } from "rxjs";
import { User } from "../../../../common/User";
import { ACK, Ack } from "../../../../common/Ack";

export class UserService {
    private static _loggedUser: User|null = null;

    private static _registeredUsers: User[] = [];

    // TODO: change to '_availableTokens'
    private static _tokens: string[] = ["123", "456"];

    public static hi = 'hello';


    public static get loggedUser(): Observable<Ack<User|null>> {
        let ack = ACK.GET_LOGGED_USER.OK;
        ack.body = this._loggedUser;
        return of(ack);  // observable that returns ack
    };

    public static tryLoginUser(user: User): Observable<Ack> {
        // this must be true if logIn is called. If it isn't,
        // then there is a bug in the code. A person must not
        // be able to try to log in if they are already logged in.
        if(this._loggedUser != null) throw Error("User already logged in");
        let ack: Ack;

        if(this._isMissingFieldLogin(user)) ack = ACK.LOGIN.MISSING_FIELD;
        else {
            let fullUser =
                this._registeredUsers.find(u => u.password == user.password && u.email == user.email);
            if(fullUser == undefined) ack = ACK.LOGIN.USER_NOT_FOUND;
            else {
                this._loggedUser = fullUser;
                ack = ACK.LOGIN.OK;
            }
        }        
        return of(ack);
    }

    public static tryRegisterUser(user: User): Observable<Ack> {
        let ack: Ack;

        if(this._isMissingFieldRegister(user))
            ack = ACK.REGISTER_USER.MISSING_FIELD;

        else if(this._isNameDuplicate(user))
            ack = ACK.REGISTER_USER.DUPLICATE_USERNAME;

        else if(this._isEmailAndPasswordDuplicate(user))
            ack = ACK.REGISTER_USER.DUPLICATE_EMAIL_AND_PASS;

        else if(user.isAdmin && !(this._tokens.includes(user.adminToken)))
            ack = ACK.REGISTER_USER.INVALID_TOKEN;
            
        else {
            ack = ACK.REGISTER_USER.OK;
            this._registeredUsers.push(user);
        }

        return of(ack);
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
}
