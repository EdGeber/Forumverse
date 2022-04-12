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
import { HomeDiscussionsComponent } from '../home-discussions/home-discussions';

@Component({
  selector: 'home-right-bar',
  templateUrl: './home-right-bar.html',
  styleUrls: ['./home-right-bar.css']
})

export class HomeRightBarComponent implements OnInit {
  constructor(private route: ActivatedRoute,  private homecomp: HomeDiscussionsComponent){ };
  loggedUser: User | null = null;
  threads: Thread[] = [];
  public que: string = "";
  public tags: boolean[] = [false, false, false];
  
  ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    this.islogged();

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

  private removeallbut()
  {
    var i = this.homecomp.threads.length
    while(i--)
    {
      if(!((this.homecomp.threads[i].topic1 && this.tags[0]) || (this.homecomp.threads[i].topic2  && this.tags[1]) || (this.homecomp.threads[i].topic3  && this.tags[2]))){
        this.homecomp.threads.splice(i, 1);
      };
    }
  }

  public async filterbyTags(){
    this.removeallbut();
  }
}
