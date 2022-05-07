import { ACK, Ack } from "../common/Ack";
import { Thread } from "../common/Thread";
import { User } from "../common/User";
import { Reply } from "../common/Reply";

export class ThreadService {
    private threads: Thread[] = [];
    
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
            this.threads.push(thread);
            Thread.total++;
        }
        
        return ack;
    }

    public trySendReply(reply:Reply, thread_id:number): Ack{
        let ack: Ack;
        if(this._emptyReplyText(reply)){
            ack = ACK.THREAD.EMPTY_REPLY_MSG;
        }
        else{
            let threadOnArray = this.getThreadByID(thread_id)
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
        return ack;
    }

    public getThreadByID(id:number): Thread|undefined{
        return this.threads.find(t => t.id == id);
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
}   