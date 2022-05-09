import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { find, lastValueFrom } from "rxjs";
import { Ack, ACK } from "../../../../common/Ack";
import { Thread } from "../../../../common/Thread"; 
import { User }   from "../../../../common/User"; 
import { ThreadService } from "../services/thread.service";
import { UserService } from "../services/user.service";
import { Util } from '../Util';

@Component({
    selector: 'manage-thread-page',
    templateUrl: './manage-thread-page.component.html',
    styleUrls: ['./manage-thread-page.component.css']
})
export class ManageThreadComponent implements OnInit{
    threads: Thread[] = [];
    thread: Thread = new Thread();    

    constructor(
		private route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _threadService: ThreadService) {}

    ngOnInit(): void {
        let routeParams = this.route.snapshot.paramMap;
        let threadId = routeParams.get('id');
        this.setThreads();
    }

    public async setThreads(){
        let ack = await lastValueFrom(this._threadService.getThreadsArray());
        this.threads = <Thread[]>ack.body;
    }

    async setThread(id:number){
        let ack = await lastValueFrom(this._threadService.getThreadsByID(id));
        this.thread = <Thread>ack.body;
    }

    async isLoggedUserOrAdmin(user:User){
        let loggedUser = this._userService.loggedUser;
        if(!loggedUser){
            return false;
        } else {
            return loggedUser == user || loggedUser.isAdmin;
        }
        
    }

    async toggleLockThread(thread: Thread, wannaLock: string)
    {
        let ack: Ack;
        ack = await lastValueFrom(this._threadService.toggleLockThreadById(thread.id,this._userService.loggedUser, wannaLock));
        if(ack.code == ACK.OK) {
            alert("Thread locked successfully!");
        } else if(ack.code == ACK.THREAD.UNEXPECTED_ERROR.code){
            alert("Could not (un)lock the thread. Please try again!");
        } else if(ack.code == ACK.THREAD.TOGGLE_LOCK_PERMISSION_DENIED.code){
            alert("You don't has permission to (un)lock this thread!");
        } else if(ack.code == ACK.THREAD.TOGGLE_LOCK_THREAD.code){
            alert("Thread already (un)locked")
        }
    }

    async deleteThread(thread: Thread){
        let ack:Ack;
        ack = await lastValueFrom(this._threadService.DeleteThreadById(thread.id,this._userService.loggedUser));

        if(ack.code == ACK.OK) {
            alert("Thread removed successfully!");
            this._router.navigateByUrl("/home");
        } else if(ack.code == ACK.THREAD.UNEXPECTED_ERROR.code){
            alert("Could not delete thread. Please try again!");
        } else if(ack.code == ACK.THREAD.DELETE_PERMISSION_DENIED.code){
            alert("You don't has permission to delete this thread!");
        } else if(ack.code == ACK.THREAD.MISSING_THREAD.code){
            alert("Thread doesn't exist!")
        }
         
    }
    
    public formatTime(time:Date):string{
        return Util.formatTime(time);
      }
    
      public getLastActivity(thread:Thread):string{
        let time = Util.getThreadLastActivity(thread);
        return this.formatTime(time);
    }
}
