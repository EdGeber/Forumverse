import { Injectable, NgModule } from '@angular/core';
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
  selector: 'home-discussions',
  templateUrl: './home-discussions.html',
  styleUrls: ['./home-discussions.css']
})

@Injectable({providedIn: 'root'})
export class HomeDiscussionsComponent implements OnInit{ 

  public threads: Thread[] = [];
  public allThreads: Thread[] = [];
  public onlyUserThread: Thread[] = [];
  id: number = 0;
  name: string = '';
  author: User = new User();
  timeCreated: Date = new Date();
  topic1: string = '';
  topic2: string = '';
  topic3: string = '';
  length: number = 0;
  
  public sortType: number = 1;
  public filterType: number = 1;

  selected: string = '';

  constructor(
	private route: ActivatedRoute,
	private _userService: UserService,
	private _threadService: ThreadService){ }

  ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    this.setThreads();
  }

  selectFilterBy (event: any) {
    //update the ui
    this.filterType = event.target.value;
  }
  selectSortBy (event: any) {
    //update the ui
    this.sortType = event.target.value;
  }
  public async setThreads(){
    let ack = await lastValueFrom(this._threadService.getThreadsArray());
    this.allThreads = <Thread[]>ack.body;
    this.threads = this.allThreads;
    this.sortby();
  }
   
  private shuffle(): Thread[]{
    let currentIndex = this.threads.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [this.threads[currentIndex], this.threads[randomIndex]] = [
        this.threads[randomIndex], this.threads[currentIndex]];
    }
  
    return this.threads;
  };
  public updatethreads(t: Thread[]){
    this.threads = t;
  }
  // 1: Latest
  // 2: Relevant
  // 3: Popular
  public async sortby(){
    /*  console.log(typeof(this.threads[0].timeCreated))
    console.log(this.sortType); */
    
    if(this.sortType == 1){
      this.threads.sort(function comp(a,b){
        let temp1 = new Date(a.timeCreated);
        let temp2 = new Date(b.timeCreated);
        return temp2.getTime()-temp1.getTime()
      });
    }else if(this.sortType == 2){
      this.threads.sort(function compRelevant(a,b){
        return b.replies.length-a.replies.length;
      });
    }else{
      this.threads.sort(function compPopular(a,b){
        return -(a.relevantRatio-b.relevantRatio);
      });
    }
  };
  // 1: all
  // 2: mine
  // fazer loop while
  public async filterby(){
    // let ack: Ack<User|null> = await lastValueFrom(this._userService.loggedUser);
    // let user: User | null = ack.body as (User|null);
    let user = this._userService.loggedUser;

    if(user && this.filterType==2)
    {
      this.onlyUserThread = [];
      this.allThreads.forEach(t => {
        if(t.author==user){
          this.onlyUserThread.push(t);
        };
      })
      this.threads = this.onlyUserThread;
    }else{
      this.threads = this.allThreads;
    }
  }

  public async isLogged(){
    // let ack: Ack<User|null> = await lastValueFrom(this._userService.loggedUser);
    // let user: User | null = ack.body as (User|null);
    let user = this._userService.loggedUser;
    if(user){
      return true;
    }
    return false;
  }
}