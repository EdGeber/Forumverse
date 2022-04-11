import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Thread } from '../../../../common/Thread'
import { lastValueFrom } from 'rxjs';
import { Ack, ACK, ErrorHandlers } from '../../../../common/Ack';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'remove-discus-page',
  templateUrl: './remove-thread-page.component.html',
  styleUrls: ['./remove-thread-page.component.css']
})

export class RemoveThreadComponent {
    /* 
    // private properties
    private readonly _ERROR_HANDLING: ErrorHandlers = {};

    // public properties
    public title = "Remove Thread";
    public threadRemove = new Thread();
    public isMissingThread = false;

    // private methods
    private _handleError(ack: Ack) {
        this._ERROR_HANDLING[ack.code]();
    }

    // public methods
    constructor(private _router: Router) {

        this._ERROR_HANDLING[ACK.THREAD.MISSING_NAMEFIELD.code] =
            () => this.isMissingThread = true;

    }

    public removeMissingThread() {
        this.isMissingThread = false;
    }


    public async removeThread() {
        var ack = await
            lastValueFrom(ThreadService.tryRemoveLockThread(this.threadRemove));
        
        if(ack.code == ACK.OK) this._router.navigateByUrl("/home");
        else this._handleError(ack);
    } */
}
