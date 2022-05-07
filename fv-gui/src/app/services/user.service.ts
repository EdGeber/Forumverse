import { lastValueFrom, Observable, Observer, of, retry } from "rxjs";
import { User } from "../../../../common/User";
import { ACK, Ack } from "../../../../common/Ack";
import { Injectable } from "@angular/core";
import { getUrlFor } from "../../../../common/fvUrls";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class UserService {
	
	private static readonly _headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private _http: HttpClient) {}
	
	// this property will be kept because the server
    // won't hold login information
    private _loggedUser: User|null = null;

    private _registeredUsers: User[] = [];

    // TODO: change to '_availableTokens'
    private _tokens: string[] = ["123", "456"]; // never remove "123" or "456"


    // public get loggedUser(): Observable<Ack<User|null>> {
    //     let ack = ACK.GET_LOGGED_USER.OK;
    //     ack.body = this._loggedUser;
    //     return of(ack);  // observable that returns ack
    // };
    
    
    public get loggedUser(): User|null {
        return this._loggedUser;
    };

    public getUserByName( name : string ): User|undefined{
        return this._registeredUsers.find(usr => usr.name == name);
    }
    
    public tryRegisterUser(user: User): Observable<Ack> {
        return this._http
			.post<Ack>(
				getUrlFor('register'),
				user,
				{headers: UserService._headers})
			.pipe(retry(2));
    }

    public async tryLoginUser(user: User): Promise<Ack<User|null>> {
        let response: Observable<Ack<User|null>> = this._http
			.put<Ack<User|null>>(
				getUrlFor('login'),
				user,
				{headers: UserService._headers})
			.pipe(retry(2));
		let ack_promise = lastValueFrom(response);
		let ack = (await ack_promise) as Ack<User|null>;
		if(ack.code == ACK.OK) this._loggedUser = ack.body == undefined? null : ack.body;
		return ack_promise;
    }

    public tryLogoutUser() {
        if(this.loggedUser == null) throw Error("Logout is not possible because the user is not logged in");

        this._loggedUser = null;
        return of(ACK.LOGOUT.OK);
    }
}
