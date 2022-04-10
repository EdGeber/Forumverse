import { Observable, Observer, of } from "rxjs";
import { Thread } from "../../../../common/Thread";
import { ACK, Ack } from "../../../../common/Ack";

export class ThreadService {
    private static _createdThreads: Thread[] = [];

    public static tryCreateThread(thread: Thread): Observable<Ack> {
        let ack: Ack;
        if(this._isMissingNameField(thread)) ack = ACK.CREATE_THREAD.MISSING_NAMEFIELD;
        else if(this._isMissingTopicField(thread)) ack = ACK.CREATE_THREAD.MISSING_TOPICFIELD;
        else if(this._isThreadDuplicate(thread)) ack = ACK.CREATE_THREAD.DUPLICATE_THREADNAME;
        else {
            ack = ACK.CREATE_THREAD.OK;
            this._createdThreads.push(thread);
        }
        return of(ack);
    }

    private static _isMissingNameField(thread: Thread): boolean {
        return thread.name == ""
    }

    private static _isMissingTopicField(thread: Thread): boolean {
        return thread.topic1 == "" && thread.topic2 == "" && thread.topic3 == ""
    }

    private static _isThreadDuplicate(thread: Thread): boolean {
        return this._createdThreads.find(u => u.name == thread.name) != undefined;
    }
}
