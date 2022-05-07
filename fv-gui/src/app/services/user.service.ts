import { Observable, Observer, of } from "rxjs";
import { User } from "../../../../common/User";
import { ACK, Ack } from "../../../../common/Ack";
import { Injectable } from "@angular/core";

@Injectable()
export class UserService {
    // this property will be kept because the server
    // won't hold login information
    private _loggedUser: User|null = null;

    private _registeredUsers: User[] = [];

    // TODO: change to '_availableTokens'
    private _tokens: string[] = ["123", "456"]; // never remove "123" or "456"


    public get loggedUser(): Observable<Ack<User|null>> {
        let ack = ACK.GET_LOGGED_USER.OK;
        ack.body = this._loggedUser;
        return of(ack);  // observable that returns ack
    };

    public tryRegisterUser(user: User): Observable<Ack> {
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

        return of(ack);
    }

    public tryLoginUser(user: User): Observable<Ack> {
        // this must be true if logIn is called. If it isn't,
        // then there is a bug in the code. A person must not
        // be able to try to log in if they are already logged in.
        if(this._loggedUser != null) throw Error("User already logged in");
        
        let ack: Ack;

        if(this._isMissingFieldLogin(user)) ack = ACK.LOGIN.MISSING_FIELD;

        else {
            // the user passed in only has fields email and password filled in
            let fullUser = this._getFullUserFromLoginInfo(user);
            if(fullUser == undefined) ack = ACK.LOGIN.USER_NOT_FOUND;
            else {
                this._loggedUser = fullUser;
                ack = ACK.LOGIN.OK;
            }
        }        
        return of(ack);
    }

    // not implemented by the server
    public tryLogoutUser() {
        if(this.loggedUser == null) throw Error("Logout is not possible because the user is not logged in");

        this._loggedUser = null;
        return of(ACK.LOGOUT.OK);
    }

    private _isMissingFieldRegister(user: User): boolean {
        let isMissing = user.name == "" || user.email == "" || user.password == "";
        if(user.isAdmin) 
            isMissing = isMissing || user.adminToken == "";
        return isMissing;
    }

    private _isEmailAndPasswordDuplicate(user: User): boolean {
        return this._registeredUsers
            .find(u =>
                u.email == user.email &&
                u.password == user.password) != undefined;
    }

    private _isMissingFieldLogin(user: User): boolean {
        return user.email == "" || user.password == "";
    }

    private _isNameDuplicate(user: User): boolean {
        return this._registeredUsers.find(u => u.name == user.name) != undefined;
    }

    private _isAdminTokenInvalid(user: User): boolean {
        return user.isAdmin && !(this._tokens.includes(user.adminToken));
    }

    private _getFullUserFromLoginInfo(user: User): User | undefined {
        return this._registeredUsers.find(u => u.password == user.password && u.email == user.email);
    }

    // ONLY USED FOR TESTING
    public _clearRegisteredUsers(): void {
        this._registeredUsers.length = 0;
    }
}
