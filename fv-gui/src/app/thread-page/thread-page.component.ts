import { Component, OnInit } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { ACK } from "../../../../common/Ack";
import { Reply } from "../../../../common/Reply";
import { Thread } from "../../../../common/Thread"; 
import { User }   from "../../../../common/User"; 
import { UserService } from "../services/user.service";

@Component({
    selector: 'thread-page',
    templateUrl: './thread-page.component.html',
    styleUrls: ['./thread-page.component.css']
})
export class ThreadPageComponent implements OnInit{ 
    thread: Thread = new Thread();
    replyText: string = "";

    ngOnInit(): void {
        //testes    
        let sampleUser = new User();
        sampleUser.name = "Paul";

        let thread = new Thread
        thread.populateThread("How to print in Java?", sampleUser, [],"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu egestas leo, quis ornare felis. Vivamus nec erat mi. Aenean hendrerit ut erat in pulvinar. Donec sed est sed tortor vehicula consequat ut eget mi. Phasellus at rhoncus lacus, sit amet suscipit arcu. Duis sed ante posuere arcu ultrices bibendum eget at augue. Integer luctus sem quis elit feugiat facilisis. Maecenas in augue eleifend, semper diam efficitur, convallis mauris. Nullam vehicula egestas ipsum vitae semper. Vestibulum euismod ante quis scelerisque varius. In hac habitasse platea dictumst. Ut eget risus a mi sodales convallis a quis ante.");
        
        thread.addReply(new Reply(sampleUser,"Just search on Google!"))
        thread.addReply(new Reply(sampleUser,"Come on!"))
        
        this.thread = thread;
    }

    async sendReply(){
        let ack = await lastValueFrom(UserService.loggedUser);
        let user: User|null = null;

        if(ack.code == ACK.OK){
            console.log(ack.body)
            
            if(ack.body){
                user = <User>ack.body;
                let reply = new Reply(user,this.replyText)
                console.log(reply);
                this.replyText = "";

                //TODO: Adicionar ACK para simular resposta do servidor
                this.thread.addReply(reply);
            }
            else{
                alert("You need to be logged in to send a reply!")
            }
        }
    }
}
