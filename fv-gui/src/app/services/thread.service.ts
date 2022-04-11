import { lastValueFrom, Observable, Observer, of } from "rxjs";
import { Thread } from "../../../../common/Thread";
import { ACK, Ack } from "../../../../common/Ack";
import { User } from "../../../../common/User";
import { Reply } from "../../../../common/Reply";
import { UserService } from "./user.service";

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

    public static trySendReply(reply:Reply, thread:Thread){
        let ack: Ack;
        if(this._emptyReplyText(reply)){
            ack = ACK.THREAD.EMPTY_REPLY_MSG;
        }
        else{
            let threadOnArray = this._getThreadByID(thread.id)
            if(threadOnArray != undefined){
                if(threadOnArray.isLocked){
                    ack = ACK.THREAD.LOCKED_THREAD;
                } else {
                    threadOnArray.addReply(reply);
                    ack = ACK.THREAD.OK;
                }
            } else {
                ack = ACK.THREAD.UNEXPECTED_ERROR;
            }
        }
        return of(ack);
    }

    public static DeleteReplyById(id: number, thread: Thread, user:User|null){
        let ack: Ack;

        if(!user){
            ack = ACK.THREAD.DELETE_PERMISSION_DENIED;
            return of(ack)
        }

        let threadOnArray = this._getThreadByID(thread.id);

        if (threadOnArray != undefined){
            let replies = threadOnArray.replies;
            let removed = null;

            for (let i = 0; i < replies.length; i++) {
                if(replies[i].id == id){
                    if((user != replies[i].author) && (!user.isAdmin)){
                        ack = ACK.THREAD.DELETE_PERMISSION_DENIED
                        return of(ack)
                    }

                    removed = replies.splice(i,1) 
                    break;
                }
            }
            if(removed){
                ack = ACK.THREAD.OK;
            } else {
                ack = ACK.THREAD.UNEXPECTED_ERROR;
            }

        } else{
            ack = ACK.THREAD.UNEXPECTED_ERROR;
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

    /* Não é pra retornar todas as threads, mas como vão ter poucas... */
    public static getThreadsArray(): Observable<Ack<Thread[]|undefined>>
    {
        let ack = ACK.GET_THREAD_ARRAY.OK;
        ack.body = this._createdThreads;
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
        return thread.topic1 && thread.topic2 && thread.topic3;
    }

    private static _isThreadDuplicate(thread: Thread): boolean {
        return this._createdThreads.find(u => u.name == thread.name) != undefined;
    }

    private static _emptyReplyText(reply:Reply): boolean {
        return reply.content == "";
    }
}
