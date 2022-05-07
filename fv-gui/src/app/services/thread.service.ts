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
    }

    public DeleteThreadById(id: number, user:User|null): Observable<Ack>{
        return this._http
            .delete<Ack>(
                getUrlFor('thread/:'+id +"/:"+ user?.name),
                {headers: ThreadService._headers}
            ).pipe(retry(2));
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
