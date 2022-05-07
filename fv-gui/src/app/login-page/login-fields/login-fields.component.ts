import { Component } from '@angular/core';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';

import { User } from '../../../../../common/User'
import { lastValueFrom } from 'rxjs';
import { Ack, ACK, ErrorHandlers } from '../../../../../common/Ack';

@Component({
  selector: 'login-fields',
  templateUrl: './login-fields.component.html',
  styleUrls: ['../../user-regist-page/user-regist-fields/user-regist-fields.component.css']
})

export class LoginFieldsComponent {
    
    // private properties
    private readonly _ERROR_HANDLING: ErrorHandlers = {};

    // public properties
    public user = new User();
    public isMissingField = false;
    public isUserNotFound = false;

    // private methods
    private _handleError(ack: Ack) {
        this._ERROR_HANDLING[ack.code]();
    }

    // public methods
    constructor(private _router: Router, private _userService: UserService) {

        this._ERROR_HANDLING[ACK.LOGIN.MISSING_FIELD.code] =
            () => this.isMissingField = true;

        this._ERROR_HANDLING[ACK.LOGIN.USER_NOT_FOUND.code] =
            () => this.isUserNotFound = true;

    }

    public removeMissingFieldWarning() {
        this.isMissingField = false;
    }
    public removeUserNotFoundWarning() {
        this.isUserNotFound = false;
    }
    public removeAllWarnings() {
        this.removeMissingFieldWarning();
        this.removeUserNotFoundWarning();
    }

    public async loginUser() {
        this.removeAllWarnings();
        
        var ack = await
            lastValueFrom(this._userService.tryLoginUser(this.user));
        
        if(ack.code == ACK.OK) {
            this.user = new User();
            this.removeAllWarnings();
            this._router.navigateByUrl("/home");
        }
        else this._handleError(ack);
    }
}
