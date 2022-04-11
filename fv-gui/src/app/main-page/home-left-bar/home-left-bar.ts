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
  selector: 'home-left-bar',
  templateUrl: './home-left-bar.html',
  styleUrls: ['./home-left-bar.css']
})

export class HomeLeftBarComponent implements OnInit {
  constructor(private route: ActivatedRoute){ };
  loggedUser: User | null = null;
  
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
}
