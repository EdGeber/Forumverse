import { Component } from '@angular/core';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';

import { User } from '../../../../../common/User'
import { lastValueFrom } from 'rxjs';
import { Ack, ACK, ErrorHandlers } from '../../../../../common/Ack';

@Component({
  selector: 'user-regist-fields',
  templateUrl: './user-regist-fields.component.html',
  styleUrls: ['./user-regist-fields.component.css']
})

export class UserRegistFieldsComponent {
    
    // private properties
    private readonly _ERROR_HANDLING: ErrorHandlers = {};

    // public properties
    public title = "User registration";
    public newUser = new User();
    public isMissingField = false;
    public isNameDuplicate = false;
    public isEmailPassDuplicate = false;

    // private methods
    private _handleError(ack: Ack) {
        this._ERROR_HANDLING[ack.code]();
    }

    // public methods
    constructor(
		private _router: Router,
		private _userService: UserService) {

        this._ERROR_HANDLING[ACK.REGISTER_USER.MISSING_FIELD.code] =
            () => this.isMissingField = true;

        this._ERROR_HANDLING[ACK.REGISTER_USER.DUPLICATE_USERNAME.code] =
            () => this.isNameDuplicate = true;

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
    public removeAllWarnings() {
        this.removeMissingFieldWarning();
        this.removeDuplicateEmailPassWarning();
        this.removeDuplicateEmailPassWarning();
    }

    public async registerUser() {
        this.removeAllWarnings();
        
        var ack = await
            lastValueFrom(this._userService.tryRegisterUser(this.newUser));
        
        if(ack.code == ACK.OK) {
            this.newUser = new User();
            this.removeAllWarnings();
            this._router.navigateByUrl("/home");
        }
        else this._handleError(ack);
    }
}
