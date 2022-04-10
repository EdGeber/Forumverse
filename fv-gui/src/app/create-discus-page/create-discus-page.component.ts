import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CreateDiscus } from '../../../../common/CreateDiscus'
import { lastValueFrom } from 'rxjs';
import { Ack, ACK, ErrorHandlers } from '../../../../common/Ack';
import { DiscussionService } from '../services/discussion.service';

@Component({
  selector: 'create-discus-page',
  templateUrl: './create-discus-page.component.html',
  styleUrls: ['./create-discus-page.component.css']
})

export class CreateDiscussionComponent {
    
    // private properties
    private readonly _ERROR_HANDLING: ErrorHandlers = {};

    // public properties
    public title = "Create discussion";
    public discCreate = new CreateDiscus();
    public isMissingField = false;
    public isDiscussionDuplicate = false;

    // private methods
    private _handleError(ack: Ack) {
        this._ERROR_HANDLING[ack.code]();
    }

    // public methods
    constructor(private _router: Router) {

        this._ERROR_HANDLING[ACK.CREATE_DISCUSSION.MISSING_FIELD.code] =
            () => this.isMissingField = true;

        this._ERROR_HANDLING[ACK.CREATE_DISCUSSION.DUPLICATE_DISCUSNAME.code] =
            () => this.isDiscussionDuplicate = true;

    }

    public removeMissingFieldWarning() {
        this.isMissingField = false;
    }
    public removeDuplicateDiscussionWarning() {
        this.isDiscussionDuplicate = false;
    }

    public async createDiscussion() {
        var ack = await
            lastValueFrom(DiscussionService.tryCreateDiscussion(this.discCreate));
        
        if(ack.code == ACK.OK) this._router.navigateByUrl("/home");
        else this._handleError(ack);
    }
}
