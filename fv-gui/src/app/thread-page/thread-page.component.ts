import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { find, lastValueFrom } from "rxjs";
import { Ack, ACK } from "../../../../common/Ack";
import { Reply } from "../../../../common/Reply";
import { Thread } from "../../../../common/Thread"; 
import { User }   from "../../../../common/User"; 
import { ThreadService } from "../services/thread.service";
import { UserService } from "../services/user.service";
import { Util } from "../Util";

@Component({
    selector: 'thread-page',
    templateUrl: './thread-page.component.html',
    styleUrls: ['./thread-page.component.css']
})
export class ThreadPageComponent implements OnInit{ 
    thread: Thread = new Thread();
    replyText: string = "";
    loggedUser: User|null = null;
    quotedReply: Reply|null = null;
    errorMsg: string = "";

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

        this.thread.replies.forEach(r => console.log(r));
    }

    isReplyOnArray(reply: Reply|null){
        if (!reply){
            return false
        } 
        return this.thread.replies.find(r => r.id == reply.id) != undefined;
    }

    get LastActivity(){
        return Util.getThreadLastActivity(this.thread);
    }

    async sendReply(){
        if(this.loggedUser){
            let reply = new Reply(this.loggedUser,this.replyText,this.quotedReply)

            let replyAck = await lastValueFrom(this._threadService.trySendReply(reply,this.thread))

            if(replyAck.code == ACK.THREAD.EMPTY_REPLY_MSG.code){
                this.errorMsg = "Reply cannot be empty!";
            } else if(replyAck.code == ACK.THREAD.LOCKED_THREAD.code){
                this.errorMsg = "This thread is locked and don't accept new replies!";
            } else if(replyAck.code == ACK.THREAD.UNEXPECTED_ERROR.code){
                this.errorMsg = "An unexpect error ocurred";
            } else if(replyAck.code == ACK.THREAD.OK.code){
                this.errorMsg = ''
                this.replyText = "";
                this.quotedReply = null;

                this.setThread(this.thread.id)
            }
        }
        else{
            this.errorMsg = "You need to be logged in to send a reply!";
        }
    }

    async setLoggedUser(){
        // let ack = await lastValueFrom(this._userService.loggedUser);

        // if(ack.code == ACK.OK){
        //     if(ack.body){
        //         this.loggedUser = <User>ack.body;
        //     } else{
        //         this.loggedUser = null;
        //     }
        // }
        this.loggedUser = this._userService.loggedUser;
    }

    isLoggedUserOrAdmin(user:User) : boolean{
        if(!this.loggedUser){
            return false;
        }
        return this.loggedUser.name == user.name || this.loggedUser.isAdmin;
    }

    async deleteReply(reply: Reply){
        let ack:Ack;
        ack = await lastValueFrom(this._threadService.DeleteReplyById(reply.id,this.thread,this.loggedUser));

        if(ack.code == ACK.THREAD.UNEXPECTED_ERROR.code){
            alert("Could not delete reply. Please try again!");
        } else if(ack.code == ACK.THREAD.DELETE_PERMISSION_DENIED.code){
            alert("You don't has permission to delete this reply!")
        } else if(ack.code == ACK.THREAD.OK.code){
            this.setThread(this.thread.id);
        }
    }

    //TODO: fix removed quoted message 
    quoteReply(reply: Reply){
        this.quotedReply = reply;
    }

    stopQuoting(){
        this.quotedReply = null;
    }

    isQuoting(): Boolean{
        return this.quotedReply != null;
    }

    errorOcurred():Boolean{
        return this.errorMsg !='';
    }

    formatTime(time:Date):string{
        return Util.formatTime(time);
    }
}
