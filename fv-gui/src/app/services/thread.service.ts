import { lastValueFrom, Observable, Observer, of, retry } from "rxjs";
import { Thread } from "../../../../common/Thread";
import { ACK, Ack } from "../../../../common/Ack";
import { User } from "../../../../common/User";
import { Reply } from "../../../../common/Reply";
import { UserService } from "./user.service";
import { ManageThreadComponent } from "../manage-thread-page/manage-thread-page.component"
import { Injectable } from "@angular/core";
import { getUrlFor } from "../../../../common/fvUrls";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class ThreadService {
    private _createdThreads: Thread[] = [];
    constructor(private _http: HttpClient) {}
	private static readonly _headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    public tryCreateThread(thread: Thread): Observable<Ack> {
        return this._http
            .post<Ack>(
                getUrlFor('thread'),
                thread,
                {headers: ThreadService._headers}
            ).pipe(retry(2));
    }

    public trySendReply(reply:Reply, thread:Thread){
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

    public DeleteReplyById(id: number, thread: Thread, user:User|null){
        return this._http
            .delete<Ack>(
                getUrlFor('thread/:'+thread.id+'/:'+id),
                {headers: ThreadService._headers}
            ).pipe(retry(2));
        /* let ack: Ack;

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
        return of(ack); */
    }

    public DeleteThreadById(id: number, user:User|null): Observable<Ack>{
        return this._http
            .delete<Ack>(
                getUrlFor('thread/:'+id +"/:"+ user.name),
                {headers: ThreadService._headers}
            ).pipe(retry(2));
        
        /* let ack: Ack;
        
        if(!user){
            ack = ACK.THREAD.DELETE_PERMISSION_DENIED;
            return of(ack)
        }
        
        console.log(this._getThreadByID(id))
        let threadOnArray = this._getThreadByID(id);

        if (threadOnArray != undefined){
            let threads = this._createdThreads;
            let removed = null;

            for (let i = 0; i < threads.length; i++) {
                if(threads[i].id == id){
                    if((user != threads[i].author) && (!user.isAdmin)){
                        ack = ACK.THREAD.DELETE_PERMISSION_DENIED
                        return of(ack)
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
        return of(ack); */
    }

    public toggleLockThreadById(id: number, user: User|null, wannaLock: string)
    {
        return this._http
        .put<Ack>(
            getUrlFor('thread/:' + id + '/:' + wannaLock),
            user,
            {headers: ThreadService._headers}
        ).pipe(retry(2));
    }

    private _getThreadByID(id:number): Thread|undefined{
        return this._createdThreads.find(t => t.id == id);
    }

    public getThreadsByID(id:number): Observable<Ack<Thread|undefined>>{
        return this._http.
        get<Ack<Thread|undefined>>(
            getUrlFor('thread/:'+id),
            {headers: ThreadService._headers}
        ).pipe(retry(2));
    }

    /* Não é pra retornar todas as threads, mas como vão ter poucas... */
    public getThreadsArray(): Observable<Ack<Thread[]|undefined>>
    {
        return this._http
        .get<Ack<Thread[]|undefined>>(
            getUrlFor('threads'),
            {headers: ThreadService._headers}
        ).pipe(retry(2));
        // let ack = ACK.GET_THREAD_ARRAY.OK;
        // /* To-do criar função deep copy array[thready] */
        // ack.body = <Array<Thread>>this._createdThreads.map(a => {return {...a}});
        // return of(ack);
    }
    
    private _isMissingNameField(thread: Thread): boolean {
        return thread.name == ""
    }

    private _isMissingTopicField(thread: Thread): boolean {
        return !thread.topic1 && !thread.topic2 && !thread.topic3;
    }

    private _isThreadDuplicate(thread: Thread): boolean {
        return this._createdThreads.find(u => u.name == thread.name) != undefined;
    }

    private _emptyReplyText(reply:Reply): boolean {
        return reply.content == "";
    }
}
