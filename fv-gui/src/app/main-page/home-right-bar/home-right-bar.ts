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
  constructor
  	(private route: ActivatedRoute,
	  private _userService: UserService,
    private _threadService: ThreadService)
    { 
    };
  loggedUser: User | null = null;
  threads: Thread[] = [];
  public que: string = "";
  public tags: boolean[] = [false, false, false];
  
  ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    this.islogged();
  }

  public async islogged(){
    this.loggedUser = this._userService.loggedUser;
  }

  public async filterbyTags(){
    await this._threadService.updatethreadsByTag(this.tags);
  }
}
