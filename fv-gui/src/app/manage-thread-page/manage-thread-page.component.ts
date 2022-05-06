import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { find, lastValueFrom } from "rxjs";
import { Ack, ACK } from "../../../../common/Ack";
import { Thread } from "../../../../common/Thread"; 
import { User }   from "../../../../common/User"; 
import { ThreadService } from "../services/thread.service";
import { UserService } from "../services/user.service";


@Component({
    selector: 'manage-thread-page',
    templateUrl: './manage-thread-page.component.html',
    styleUrls: ['./manage-thread-page.component.css']
})
export class ManageThreadComponent implements OnInit{
    threads: Thread[] = [];
    thread: Thread = new Thread();
    loggedUser: User|null = null;
    

    constructor(
		private route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService) {}

    ngOnInit(): void {
        let routeParams = this.route.snapshot.paramMap;
        let threadId = routeParams.get('id');
        this.setLoggedUser();
        this.setThreads();
    }

    public async setThreads(){
        let ack = await lastValueFrom(ThreadService.getThreadsArray());
        this.threads = <Thread[]>ack.body;
    }

    async setThread(id:number){
        let ack = await lastValueFrom(ThreadService.getThreadsByID(id));
        this.thread = <Thread>ack.body;
    }


    async setLoggedUser(){
        let ack = await lastValueFrom(this._userService.loggedUser);

        if(ack.code == ACK.OK){
            if(ack.body){
                this.loggedUser = <User>ack.body;
            } else{
                this.loggedUser = null;
            }
        }
    }

    isLoggedUserOrAdmin(user:User) : boolean{
        if(!this.loggedUser){
            return false;
        }
        return this.loggedUser == user || this.loggedUser.isAdmin;
    }

    async lockThread(thread: Thread){
        let ack:Ack;
        ack = await lastValueFrom(ThreadService.LockThreadById(thread.id,this.loggedUser));
        
        if(ack.code == ACK.OK) {
            alert("Thread locked successfully!");
        } else if(ack.code == ACK.THREAD.UNEXPECTED_ERROR.code){
            alert("Could not lock the thread. Please try again!");
        } else if(ack.code == ACK.THREAD.LOCK_PERMISSION_DENIED.code){
            alert("You don't has permission to lock this thread!");
        } else if(ack.code == ACK.THREAD.LOCKED_THREAD.code){
            alert("Thread already locked!")
        }
    }
    
    async unlockThread(thread: Thread){
        let ack:Ack;
        ack = await lastValueFrom(ThreadService.UnlockThreadById(thread.id,this.loggedUser));
        
        if(ack.code == ACK.OK) {
            alert("Thread unlocked successfully!");
        } else if(ack.code == ACK.THREAD.UNEXPECTED_ERROR.code){
            alert("Could not unlock the thread. Please try again!");
        } else if(ack.code == ACK.THREAD.UNLOCK_PERMISSION_DENIED.code){
            alert("You don't has permission to unlock this thread!");
        } else if(ack.code == ACK.THREAD.UNLOCKED_THREAD.code){
            alert("Thread already unlocked!")
        }
    }
    

    async deleteThread(thread: Thread){
        let ack:Ack;
        ack = await lastValueFrom(ThreadService.DeleteThreadById(thread.id,this.loggedUser));

        if(ack.code == ACK.OK) {
            alert("Thread removed successfully!");
        } else if(ack.code == ACK.THREAD.UNEXPECTED_ERROR.code){
            alert("Could not delete thread. Please try again!");
        } else if(ack.code == ACK.THREAD.DELETE_PERMISSION_DENIED.code){
            alert("You don't has permission to delete this thread!");
        } else if(ack.code == ACK.THREAD.MISSING_THREAD.code){
            alert("Thread doesn't exist!")
        }
         
    }
}
