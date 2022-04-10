import { Observable, Observer, of } from "rxjs";
import { CreateDiscus } from "../../../../common/CreateDiscus";
import { ACK, Ack } from "../../../../common/Ack";

export class DiscussionService {
    private static _createdDiscussions: CreateDiscus[] = [];

    public static tryCreateDiscussion(discussion: CreateDiscus): Observable<Ack> {
        let ack: Ack;

        if(this._isMissingField(discussion)) ack = ACK.CREATE_DISCUSSION.MISSING_FIELD;
        else if(this._isDiscussionDuplicate(discussion)) ack = ACK.CREATE_DISCUSSION.DUPLICATE_DISCUSNAME;
        else {
            ack = ACK.CREATE_DISCUSSION.OK;
            this._createdDiscussions.push(discussion);
        }

        return of(ack);
    }

    private static _isMissingField(discussion: CreateDiscus): boolean {
        return discussion.discusName == "" || discussion.discusTopics == []
    }

    private static _isDiscussionDuplicate(discussion: CreateDiscus): boolean {
        return this._createdDiscussions.find(u => u.discusName == discussion.discusName) != undefined;
    }
}
