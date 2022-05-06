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
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})

export class TopBarComponent implements OnInit {
  constructor(
	private route: ActivatedRoute,
	private homecomp: HomeDiscussionsComponent,
	private _userService: UserService){ 
  };
  loggedUser: User | null = null;
  threads: Thread[] = [];
  public que: string = "";

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
    let ack = await lastValueFrom(this._userService.loggedUser);

    if(ack.code == ACK.OK){
        if(ack.body){
          this.loggedUser = <User>ack.body;
        } else{
          this.loggedUser = null;
        }
    }
  }

  public async search(){
    this.homecomp.setThreads();
    this.setThreads();
    var i = this.threads.length;
    while(i--)
    {
      if(!this.threads[i].name.includes(this.que.trim())){
        this.threads.splice(i, 1);
      };
    }
  }

  public async logout()
  {
    let ack = await lastValueFrom(this._userService.tryLogoutUser());

  }

}
