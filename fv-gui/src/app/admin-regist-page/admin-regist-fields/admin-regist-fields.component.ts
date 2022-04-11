import { Component } from '@angular/core';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';

import { User } from '../../../../../common/User'
import { lastValueFrom } from 'rxjs';
import { Ack, ACK, ErrorHandlers } from '../../../../../common/Ack';

@Component({
  selector: 'admin-regist-fields',
  templateUrl: './admin-regist-fields.component.html',
  styleUrls: ['../../user-regist-page/user-regist-fields/user-regist-fields.component.css']
})

export class AdminRegistFieldsComponent {
    
    // private properties
    private readonly _ERROR_HANDLING: ErrorHandlers = {};

    // public properties
    public title = "User registration";
    public newUser = new User('', '', '', true);
    public isMissingField = false;
    public isNameDuplicate = false;
    public isTokenInvalid = false;
    public isEmailPassDuplicate = false;

    // private methods
    private _handleError(ack: Ack) {
        this._ERROR_HANDLING[ack.code]();
    }

    // public methods
    constructor(private _router: Router) {

        this._ERROR_HANDLING[ACK.REGISTER_USER.MISSING_FIELD.code] =
            () => this.isMissingField = true;

        this._ERROR_HANDLING[ACK.REGISTER_USER.DUPLICATE_USERNAME.code] =
            () => this.isNameDuplicate = true;
        
        this._ERROR_HANDLING[ACK.REGISTER_USER.INVALID_TOKEN.code] =
            () => this.isTokenInvalid = true;
        
        this._ERROR_HANDLING[ACK.REGISTER_USER.DUPLICATE_EMAIL_AND_PASS.code] =
            () => this.isEmailPassDuplicate = true;
    }

    public removeMissingFieldWarning() {
        this.isMissingField = false;
    }
    public removeDuplicateNameWarning() {
        this.isNameDuplicate = false;
    }
    public removeDuplicateEmailPassWarning() {
        this.isEmailPassDuplicate = false;
    }
    public removeTokenInvalidWarning(){
        this.isTokenInvalid = false;
    }
    public removeAllWarnings() {
        this.removeMissingFieldWarning();
        this.removeDuplicateEmailPassWarning();
        this.removeTokenInvalidWarning();
        this.removeDuplicateEmailPassWarning();
    }

    public async registerUser() {
        this.removeAllWarnings();
        
        var ack = await
            lastValueFrom(UserService.tryRegisterUser(this.newUser));
        
        if(ack.code == ACK.OK) {
            this.newUser = new User('', '', '', true);
            this._router.navigateByUrl("/home");
        }
        else this._handleError(ack);
    }
}
