import { Reply } from "./Reply";
import { User } from "./User";

export class Thread{
    static total: number = 0;

    id: number;
    name: string;
    author: User;
    topic1: boolean;
    topic2: boolean;
    topic3: boolean;
    text: string;
    timeCreated: Date;
    replies: Reply[];
    isLocked: Boolean = false;
    
    constructor(){
        this.id = Thread.total;

        this.name = "";
        this.author = new User();
        this.topic1 = false;
        this.topic2 = false;
        this.topic3 = false;
        this.timeCreated = new Date();
        this.text = "";
        this.replies = [];
        this.isLocked = false; 
       }

    // Used to fill the thread fields
    populateThread(name:string, author:User, topic1:boolean, 
                    topic2:boolean, topic3:boolean, text:string) {
        this.name = name;
        this.author = author;
        this.topic1 = topic1;
        this.topic2 = topic2;
        this.topic3 = topic3;
        this.text = text;
        this.timeCreated = new Date();
        this.replies = [];
    }

    addReply(reply: Reply){
        reply.id = this.replies.length;
        this.replies.push(reply);
    }
}