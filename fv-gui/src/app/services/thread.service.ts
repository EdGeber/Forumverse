import { Observable, Observer, of } from "rxjs";
import { Thread } from "../../../../common/Thread";
import { ACK, Ack } from "../../../../common/Ack";
import { User } from "../../../../common/User";
import { Reply } from "../../../../common/Reply";

export class ThreadService {
    private static _createdThreads: Thread[] = [];

    public static tryCreateThread(thread: Thread): Observable<Ack> {
        let ack: Ack;
        if(this._isMissingNameField(thread)) ack = ACK.THREAD.MISSING_NAMEFIELD;
        else if(this._isMissingTopicField(thread)) ack = ACK.THREAD.MISSING_TOPICFIELD;
        else if(this._isThreadDuplicate(thread)) ack = ACK.THREAD.DUPLICATE_THREADNAME;
        else {
            ack = ACK.THREAD.OK;
            this._createdThreads.push(thread);
            Thread.total++;
        }
        return of(ack);
    }

    public static getThreadsByID(id:number): Observable<Ack<Thread|undefined>>{
        let ack = ACK.GET_THREAD.OK;
        let thread = ThreadService._createdThreads.find(t => t.id == id);
        ack.body = thread;
        return of(ack);
    }
    /* 
    public static tryRemoveLockThread(thread: Thread): Observable<Ack> {
        let ack: Ack;
        if(this._isMissingThread(thread)) ack = ACK.THREAD.MISSING_THREAD;
        else {
            ack = ACK.THREAD.OK
        }
        return of(ack);
    } 

    private static _isMissingThread(thread: Thread): boolean {
        return this.getThreadsByID == undefined;
    }
    */

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
