import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { find, lastValueFrom } from "rxjs";
import { Ack, ACK } from "../../../../common/Ack";
import { Reply } from "../../../../common/Reply";
import { Thread } from "../../../../common/Thread"; 
import { User }   from "../../../../common/User"; 
import { ThreadService } from "../services/thread.service";
import { UserService } from "../services/user.service";

@Component({
    selector: 'thread-page',
    templateUrl: './thread-page.component.html',
    styleUrls: ['./thread-page.component.css']
})
export class ThreadPageComponent implements OnInit{ 
    thread: Thread = new Thread();
    replyText: string = "";
    loggedUser: User|null = null;

    constructor(
		private route: ActivatedRoute,
		private _userService: UserService,
		private _threadService: ThreadService) { }

    ngOnInit(): void {
        let routeParams = this.route.snapshot.paramMap;
        let threadId = routeParams.get('id');
        this.setLoggedUser();

        if(threadId){
            threadId = threadId.substring(1)
            this.setThread(parseInt(threadId));
        }
    }

    async setThread(id:number){
        let ack = await lastValueFrom(this._threadService.getThreadsByID(id));
        this.thread = <Thread>ack.body;
    }

    get LastActivity(){
        let replies = this.thread.replies;
        if(replies.length > 0){
            let lastActivity = replies[replies.length-1].timeSent;
            return lastActivity;
        } else {
            return this.thread.timeCreated;
        }
    }

    async sendReply(){
        if(this.loggedUser){
            let reply = new Reply(this.loggedUser,this.replyText)
            this.replyText = "";

            let replyAck = await lastValueFrom(this._threadService.trySendReply(reply,this.thread))

            if(replyAck.code == ACK.THREAD.EMPTY_REPLY_MSG.code){
                alert("Reply cannot be empty!");
            } else if(replyAck.code == ACK.THREAD.LOCKED_THREAD.code){
                alert("This thread is locked and don't accept new replies!")
            } else if(replyAck.code == ACK.THREAD.UNEXPECTED_ERROR.code){
                alert("An unexpect error ocurred");
            }
        }
        else{
            alert("You need to be logged in to send a reply!")
        }
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

    async deleteReply(reply: Reply){
        let ack:Ack;
        ack = await lastValueFrom(this._threadService.DeleteReplyById(reply.id,this.thread,this.loggedUser));

        if(ack.code == ACK.THREAD.UNEXPECTED_ERROR.code){
            alert("Could not delete reply. Please try again!");
        } else if(ack.code == ACK.THREAD.DELETE_PERMISSION_DENIED.code){
            alert("You don't has permission to delete this reply!")
        }
    }
}
