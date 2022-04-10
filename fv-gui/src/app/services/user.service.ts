import { Observable, Observer, of } from "rxjs";
import { User } from "../../../../common/User";
import { ACK, Ack } from "../../../../common/Ack";

export class UserService {
    private static _loggedUser: User|null = null;

    private static _registeredUsers: User[] = [];


    public static get loggedUser(): Observable<Ack<User|null>> {
        let ack = ACK.GET_LOGGED_USER.OK;
        ack.body = this._loggedUser;
        return of(ack);  // observable that returns ack
    };

    /*
    public static tryLogIn(user: User): Observable<Ack> {
        // this must be true if logIn is called. If it isn't,
        // then there is a bug in the code. A person must not
        // be able to try to log in if they are already logged in.
        assert(this._loggedUser == null);
    }
    */

    public static tryRegisterUser(user: User): Observable<Ack> {
        let ack: Ack;

        if(this._isMissingField(user)) ack = ACK.REGISTER_USER.MISSING_FIELD;
        else if(this._isNameDuplicate(user)) ack = ACK.REGISTER_USER.DUPLICATE_USERNAME;
        else {
            ack = ACK.REGISTER_USER.OK;
            this._registeredUsers.push(user);
        }

        return of(ack);
    }

    private static _isMissingField(user: User): boolean {
        let isMissing = user.name == "" || user.email == "" || user.password == "";
        if(user.isAdmin) 
            isMissing = isMissing || user.adminToken == "";
        return isMissing;
    }

    private static _isNameDuplicate(user: User): boolean {
        return this._registeredUsers.find(u => u.name == user.name) != undefined;
    }
}
