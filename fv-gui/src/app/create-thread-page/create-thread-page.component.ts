import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Thread } from '../../../../common/Thread'
import { lastValueFrom } from 'rxjs';
import { Ack, ACK, ErrorHandlers } from '../../../../common/Ack';
import { ThreadService } from '../services/thread.service';
import { UserService } from '../services/user.service';
import { User } from '../../../../common/User';

@Component({
  selector: 'create-discus-page',
  templateUrl: './create-thread-page.component.html',
  styleUrls: ['./create-thread-page.component.css']
})

export class CreateThreadComponent {
    
    // private properties
    private readonly _ERROR_HANDLING: ErrorHandlers = {};

    // public properties
    public title = "Create Thread";
    public threadCreate = new Thread();
    public isMissingNameField = false;
    public isMissingTopicField = false;
    public isThreadDuplicate = false;
    public isNotLoggedIn = false;

    // private methods
    private _handleError(ack: Ack) {
        this._ERROR_HANDLING[ack.code]();
    }

    // public methods
    constructor(
		private _router: Router,
		private _userService: UserService,
		private _threadService: ThreadService) {

        this._ERROR_HANDLING[ACK.THREAD.MISSING_NAMEFIELD.code] =
            () => this.isMissingNameField = true;
        
        this._ERROR_HANDLING[ACK.THREAD.MISSING_TOPICFIELD.code] =
            () => this.isMissingTopicField = true;

        this._ERROR_HANDLING[ACK.THREAD.DUPLICATE_THREADNAME.code] =
            () => this.isThreadDuplicate = true;

    }

    public removeMissingFieldWarning() {
        this.isMissingNameField = false;
        this.isMissingTopicField = false;
    }

    public removeDuplicateThreadWarning() {
        this.isThreadDuplicate = false;
    }

    public async createThread() {
        let loggedUser = this._userService.loggedUser;
        if (loggedUser){
            this.threadCreate.author = loggedUser;
            var ack = await
                lastValueFrom(this._threadService.tryCreateThread(this.threadCreate));
                if(ack.code == ACK.OK) this._router.navigateByUrl("/home");
                    else this._handleError(ack);
        } else {
            this.isNotLoggedIn = true;
        }
    }
}
