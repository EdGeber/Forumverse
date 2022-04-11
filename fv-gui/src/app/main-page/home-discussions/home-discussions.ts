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
  selector: 'home-discussions',
  templateUrl: './home-discussions.html',
  styleUrls: ['./home-discussions.css']
})


export class HomeDiscussionsComponent implements OnInit{ 
  
  threads: Thread[] = [];
  id: number = 0;
  name: string = '';
  author: User = new User();
  timeCreated: Date = new Date();
  topic1: string = '';
  topic2: string = '';
  topic3: string = '';
  
  constructor(private route: ActivatedRoute){ }

  ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    this.setThreads();
  }

  async setThreads(){
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

  // 0: Latest
  // 1: Relevant
  // 2: Popular
  public async sortby(type: number){
    if(type == 1)
    {
      this.threads.sort((a,b)=>a.timeCreated.getTime()-b.timeCreated.getTime());
    } 
    else if (type == 2) {
      this.shuffle();
    } else {
      this.shuffle();
    }
  };
  // 0: all
  // 1: mine
  public async filterby(type: number){
    // nope
    // nope
    // nope
    // :D
  }

  public async filterbyTags(topics: string[]){
    
  }

  public async search(q: string){
    
  }
}