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
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})

export class TopBarComponent implements OnInit {
  constructor(
	private route: ActivatedRoute,
	private _userService: UserService,
	private _threadService: ThreadService){ 
  };
  loggedUser: User | null = null;
  public que: string = "";

  ngOnInit(): void {
    let routeParams = this.route.snapshot.paramMap;
    this.islogged();
  }
  
  public async islogged(){
    this.loggedUser = this._userService.loggedUser;
  }

  public async search(){
    await this._threadService.search(this.que);
    this.que = "";
  }

  public async logout()
  {
    let ack = await lastValueFrom(this._userService.tryLogoutUser());
  }

}
