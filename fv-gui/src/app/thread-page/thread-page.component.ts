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

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {

        let routeParams = this.route.snapshot.paramMap;
        let threadId = routeParams.get('id');

        if(threadId){
            threadId = threadId.substring(1)
            this.setThread(parseInt(threadId));
            console.log(this.thread)
        }
    }

    async setThread(id:number){
        let ack = await lastValueFrom(ThreadService.getThreadsByID(id));
        this.thread = <Thread>ack.body;
    }

    async sendReply(){
        let ack = await lastValueFrom(UserService.loggedUser);
        let user: User|null = null;

        if(ack.code == ACK.OK){
            console.log(ack.body)
            
            if(ack.body){
                user = <User>ack.body;
                let reply = new Reply(user,this.replyText)
                this.replyText = "";

                //TODO: Adicionar ACK para simular resposta do servidor
                let replyAck = await lastValueFrom(ThreadService.trySendReply(reply,this.thread))

                if(replyAck == ACK.THREAD.EMPTY_REPLY_MSG){
                    alert("Reply cannot be empty!");
                } else if(replyAck == ACK.THREAD.UNEXPECTED_ERROR){
                    alert("An unexpect error ocurred");
                }
            }
            else{
                alert("You need to be logged in to send a reply!")
            }
        }
    }
}
