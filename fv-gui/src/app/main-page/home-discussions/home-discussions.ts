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

  constructor(private route: ActivatedRoute, private _userService: UserService){ }

  ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    this.setThreads();
  }

  public async setThreads(){
    let ack = await lastValueFrom(ThreadService.getThreadsArray());
    this.threads = <Thread[]>ack.body;
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
  // 0: Latest
  // 1: Relevant
  // 2: Popular
  public async sortby(){
    this.setThreads();

    if(this.sortType == 1)
    {
      this.threads.sort((a,b)=>b.timeCreated.getTime()-a.timeCreated.getTime());
    } 
    else if (this.sortType == 2) {
      this.shuffle();
    } else {
      this.shuffle();
    }
  };
  // 0: all
  // 1: mine
  // fazer loop while
  public async filterby(){
    let ack: Ack<User|null> = await lastValueFrom(this._userService.loggedUser);
    let user: User | null = ack.body as (User|null);
    

    if(user && this.filterType==2)
    {
      this.threads.forEach(t => {
        if(t.author!=user){
          this.threads.splice(this.threads.indexOf(t), 1);
        };
      })
    }
  }

  public async isLogged(){
    let ack: Ack<User|null> = await lastValueFrom(this._userService.loggedUser);
    let user: User | null = ack.body as (User|null);
    if(user){
      return true;
    }
    return false;
  }
}