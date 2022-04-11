import { Observable, Observer, of } from "rxjs";
import { Thread } from "../../../../common/Thread";
import { ACK, Ack } from "../../../../common/Ack";
import { User } from "../../../../common/User";
import { Reply } from "../../../../common/Reply";

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
            Thread.total++;
        }
        return of(ack);
    }

    public static trySendReply(reply:Reply, thread:Thread){
        let ack: Ack;
        if(this._emptyReplyText(reply)){
            ack = ACK.CREATE_THREAD.EMPTY_REPLY_MSG;
        }
        else{
            let threadOnArray = this._getThreadByID(thread.id)
            if(threadOnArray != undefined){
                threadOnArray.addReply(reply);
                ack = ACK.CREATE_THREAD.OK;
            } else {
                ack = ACK.CREATE_THREAD.UNEXPECTED_ERROR;
            }
        }
        return of(ack);
    }

    private static _getThreadByID(id:number): Thread|undefined{
        return ThreadService._createdThreads.find(t => t.id == id);
    }

    public static getThreadsByID(id:number): Observable<Ack<Thread|undefined>>{
        let ack = ACK.GET_THREAD.OK;
        let thread = ThreadService._getThreadByID(id);
        ack.body = thread;
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

    private static _emptyReplyText(reply:Reply): boolean {
        return reply.content == "";
    }
}
