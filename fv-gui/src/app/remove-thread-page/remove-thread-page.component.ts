import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { find, lastValueFrom } from "rxjs";
import { Ack, ACK } from "../../../../common/Ack";
import { Thread } from "../../../../common/Thread"; 
import { User }   from "../../../../common/User"; 
import { ThreadService } from "../services/thread.service";
import { UserService } from "../services/user.service";


@Component({
    selector: 'remove-thread-page',
    templateUrl: './remove-thread-page.component.html',
    styleUrls: ['./remove-thread-page.component.css']
})
export class RemoveThreadComponent implements OnInit{
    threads: Thread[] = [];
    thread: Thread = new Thread();
    loggedUser: User|null = null;
    

    constructor(private route: ActivatedRoute, private _router: Router) {}

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
        let ack = await lastValueFrom(UserService.loggedUser);

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

    async deleteThread(thread: Thread){
        let ack:Ack;
        ack = await lastValueFrom(ThreadService.DeleteThreadById(thread.id,this.thread,this.loggedUser));
        


        if(ack.code == ACK.OK) {
            this._router.navigateByUrl("/home");
        } else if(ack.code == ACK.THREAD.UNEXPECTED_ERROR.code){
            alert("Could not delete thread. Please try again!");
        } else if(ack.code == ACK.THREAD.DELETE_PERMISSION_DENIED.code){
            alert("You don't has permission to delete this thread!")
        }
         
    }
}
