import { Injectable, NgModule } from '@angular/core';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { find, lastValueFrom, Subscription } from "rxjs";
import { Ack, ACK } from "../../../../../common/Ack";
import { Reply } from "../../../../../common/Reply";
import { Thread } from "../../../../../common/Thread"; 
import { User }   from "../../../../../common/User"; 
import { ThreadService } from "../../services/thread.service";
import { UserService } from "../../services/user.service";
import { Util } from '../../Util';

@Component({
  selector: 'home-discussions',
  templateUrl: './home-discussions.html',
  styleUrls: ['./home-discussions.css']
})

export class HomeDiscussionsComponent implements OnInit{ 

  public threads: Thread[] = [];
  public allThreads: Thread[] = [];
  public onlyUserThread: Thread[] = [];
  loggedUser: User | null = null;
  public sortType: number = 1;
  public filterType: number = 1;
  private threadsub: Subscription; 
  private mobilesub: Subscription;
  selected: string = '';
  mobile: boolean = true;
  constructor(
	private route: ActivatedRoute,
	private _userService: UserService,
  private _threadService: ThreadService){ 
    this.sovai();
    this.islogged();
    this.threadsub= this._threadService.getUpdate().subscribe
    (threads => { //message contains the data sent from service
      this.threads = threads;
    });
    this.mobilesub = this._threadService.getWidth().subscribe
    (bool => { //message contains the data sent from service
      this.mobile = bool;
    });
  }
  
  ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    //window.onresize = () => this.mobile = window.innerWidth >= 920
  }

  public async sovai()
  {
    let ack = await lastValueFrom(this._threadService.getThreadsArray());
    let threadss = <Thread[]>ack.body;
    this._threadService.sendUpdate(threadss);
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
    //await this._threadService.uptTDC();
    this.allThreads = this.threads
    //this.threads = await this._threadService.getTDC();
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
        this.threads[randomIndex],this.threads[currentIndex]];
    }
  
    return this.threads;
  };
/*   
  public async updatethreads(){
    this.threads = await this._threadService.getTDC();
  } */

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
    let ack = await lastValueFrom(this._threadService.getThreadsArray());
    
    this.allThreads = <Thread[]>ack.body;
    if(User && this.filterType==2)
    {
      this.onlyUserThread = [];
      
      this.allThreads.forEach(t => {
        if(t.author?.name==user?.name){
          this.onlyUserThread.push(t);
        };
      })
      this.threads = this.onlyUserThread;
    }else{
      console.log("poirra")
      this.threads = this.allThreads;
    }
  }
  public async islogged(){
    this.loggedUser = this._userService.loggedUser;
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

  public formatTime(time:Date):string{
    return Util.formatTime(time);
  }

  public getLastActivity(thread:Thread):string{
    let time = Util.getThreadLastActivity(thread);
    return this.formatTime(time);
  }
  public async logout()
  {
    let ack = await lastValueFrom(this._userService.tryLogoutUser());
  }

}