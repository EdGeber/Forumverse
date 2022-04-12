import { NgModule } from '@angular/core';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { find, lastValueFrom } from "rxjs";
import { Ack, ACK } from "../../../../../common/Ack";
import { Reply } from "../../../../../common/Reply";
import { Thread } from "../../../../../common/Thread"; 
import { User }   from "../../../../../common/User"; 
import { ThreadService } from "../../services/thread.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'home-right-bar',
  templateUrl: './home-right-bar.html',
  styleUrls: ['./home-right-bar.css']
})

export class HomeRightBarComponent implements OnInit {
  constructor(private route: ActivatedRoute){ };
  loggedUser: User | null = null;
  threads: Thread[] = [];
  public que: string = "";
  public tags: boolean[] = [false, false, false];
  
  ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    this.islogged();
    this.setThreads();

  }

  public async setThreads(){
    let ack = await lastValueFrom(ThreadService.getThreadsArray());
    this.threads = <Thread[]>ack.body;
  }
  

  public async islogged(){
    let ack = await lastValueFrom(UserService.loggedUser);

    if(ack.code == ACK.OK){
        if(ack.body){
          this.loggedUser = <User>ack.body;
        } else{
          this.loggedUser = null;
        }
    }
  }

  public async search(){
    var i = this.threads.length
    while(i--)
    {
      if(!this.threads[i].name.includes(this.que.trim())){
        this.threads.splice(i, 1);
      };
    }
  }

  private removeallbut()
  {
    var i = this.threads.length
    while(i--)
    {
      if(!((this.threads[i].topic1 && this.tags[0]) || (this.threads[i].topic2  && this.tags[1]) || (this.threads[i].topic3  && this.tags[2]))){
        this.threads.splice(i, 1);
      };
    }
  }

  public async filterbyTags(){
    this.removeallbut();
  }
}
