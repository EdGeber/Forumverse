import { Reply } from "./Reply";
import { User } from "./User";

export class Thread{
    name: string;
    author: User;
    topics: string[];
    timeCreated: Date;
    replies: Reply[];
    isLocked: Boolean = false;
    text: string[];

    constructor(){
        this.name = "";
        this.author = new User();
        this.topics = [];
        this.timeCreated = new Date();
        this.text = [];
        this.replies = [];
        this.isLocked = false; 
       }
       
    // Used to fill the thread fields
    populateThread(name:string, author:User, topics:string[], text:string[]){
        this.name = name;
        this.author = author;
        this.topics = topics;
        this.text = text;
        this.timeCreated = new Date();
        this.replies = [];
    }
}