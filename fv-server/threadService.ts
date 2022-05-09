import { ACK, Ack } from "../common/Ack";
import { Thread } from "../common/Thread";
import { User } from "../common/User";
import { Reply } from "../common/Reply";
import { UserService } from "./UserService";
import { lastValueFrom, Observable, of } from "rxjs";

export class ThreadService{

    private threads: Thread[] = [];

    private replyCount: number = 0;
    private threadCount: number = 0;
    
    public getThreads():Ack<Thread[]|undefined> {
        let ack = ACK.GET_THREAD_ARRAY.OK;
        ack.body = <Array<Thread>>this.threads.map(a => {return {...a}});
        return ack;
    }

    public tryCreateThread( thread: Thread): Ack {            
        let ack: Ack;
        if(this._isMissingNameField(thread)) 
            ack = ACK.THREAD.MISSING_NAMEFIELD;
        else if(this._isMissingTopicField(thread)) 
            ack = ACK.THREAD.MISSING_TOPICFIELD;
        else if(this._isThreadDuplicate(thread)) 
            ack = ACK.THREAD.DUPLICATE_THREADNAME;
        else {
            ack = ACK.THREAD.OK;

            this.threadCount++;
            thread.id = this.threadCount;
            this.threads.push(thread);
        }
        return ack;
    }

    public trySendReply(reply:Reply, thread_id:number): Ack{
        let ack: Ack;
        if(this._emptyReplyText(reply)){
            ack = ACK.THREAD.EMPTY_REPLY_MSG;
        }
        else{
            let threadOnArray = this._getThreadByID(thread_id);
            if(threadOnArray != undefined){
                if(threadOnArray.isLocked){
                    ack = ACK.THREAD.LOCKED_THREAD;
                } else {
                    ack = ACK.THREAD.OK;

                    this.replyCount++;
                    reply.id = this.replyCount;
                    this._addReply(threadOnArray,reply);
                }
            } else {
                ack = ACK.THREAD.UNEXPECTED_ERROR;
            }
        }
        return ack;
    }

    public DeleteReplyById(id: number, thread_id: number, user:User|null): Ack{
        let ack: Ack;

        let threadOnArray = this._getThreadByID(thread_id);

        if(!user){
            ack = ACK.THREAD.DELETE_PERMISSION_DENIED;
            return ack;
        }

        //let threadOnArray = this._getThreadByID(thread.id);

        if (threadOnArray != undefined){
            let replies = threadOnArray.replies;
            let removed = null;

            for (let i = 0; i < replies.length; i++) {
                if(replies[i].id == id){
                    if((user.name != replies[i].author.name) && (!user.isAdmin)){
                        ack = ACK.THREAD.DELETE_PERMISSION_DENIED;
                        return ack;
                    }
                    replies[i].content = "This reply was removed";
                    removed = replies.splice(i,1); 
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
        return ack;
    }

    public DeleteThreadById(id: number, user:User|null): Ack{
        let ack: Ack;

        if(!user){
            ack = ACK.THREAD.DELETE_PERMISSION_DENIED;
            return ack;
        }
        
        let threadOnArray = this._getThreadByID(id);

        if (threadOnArray != undefined){
            let threads = this.threads;
            let removed = null;

            for (let i = 0; i < threads.length; i++) {
                if(threads[i].id == id){
                    if((user.name != threads[i].author.name) && (!user.isAdmin)){
                        ack = ACK.THREAD.DELETE_PERMISSION_DENIED;
                        return ack;
                    }

                    removed = threads.splice(i,1) 
                    break;
                }
            }
            if(removed){
                ack = ACK.THREAD.OK;
            } else {
                ack = ACK.THREAD.UNEXPECTED_ERROR;
            }

        } else{
            ack = ACK.THREAD.MISSING_THREAD;
        }
        return ack;
    }


    public toggleLockThreadById(id: number, user: User|null, wannaLock: boolean): Ack
    {
        if(!user){
            return ACK.THREAD.TOGGLE_LOCK_THREAD
        }
        
        let threadOnArray = this._getThreadByID(id);

        if (threadOnArray != undefined){
            let threads = this.threads;
            for (let i = 0; i < threads.length; i++) {
                if(threads[i].id == id){
                    // If user is not the OP or Admin than reject
                    if((user.name != threads[i].author.name) && (!user.isAdmin)){
                        return ACK.THREAD.TOGGLE_LOCK_PERMISSION_DENIED
                    }
                    // If The thread.isLocked is the same as user intention than reject
                    if (threadOnArray.isLocked == wannaLock) {
                        return ACK.THREAD.TOGGLE_LOCK_THREAD;
                    }
                    // Accept
                    threadOnArray.isLocked = !threadOnArray.isLocked;
                    return ACK.THREAD.OK
                }
            }
        } 
        //If threadOnArray is not defined or Thread is not on thread on array
        // Raise unexpected error
        return ACK.THREAD.UNEXPECTED_ERROR;
    }

    private _addReply(thread: Thread, reply: Reply){
        thread.replies.push(reply);
        thread.relevantRatio = thread.lastReply-new Date().getSeconds();
        thread.lastReply = Math.min(thread.lastReply,new Date().getSeconds());
    }

    private _getThreadByID(id:number): Thread|undefined{
        return this.threads.find(t => t.id == id);
    }


    public getThreadByID(id:number): Ack<Thread|undefined>{
        let ack = ACK.GET_THREAD.OK;
        ack.body = this.threads.find(t => t.id == id);
        return ack;
    }

    private _isMissingNameField(thread: Thread): boolean {
        return thread.name == ""
    }

    private _isMissingTopicField(thread: Thread): boolean {
        return !thread.topic1 && !thread.topic2 && !thread.topic3;
    }

    private _isThreadDuplicate(thread: Thread): boolean {
        return this.threads.find(u => u.name == thread.name) != undefined;
    }

    private _emptyReplyText(reply:Reply): boolean {
        return reply.content == "";
    }

	// ONLY USED FOR TESTING
    public _clearThreads(): number {
        this.threads.length = 0;
		return 200;
    }
}   