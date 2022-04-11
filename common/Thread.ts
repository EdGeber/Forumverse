import { Reply } from "./Reply";
import { User } from "./User";

export class Thread{
    static total: number = 0;

    id: number;
    name: string;
    author: User;
    topic1: string;
    topic2: string;
    topic3: string;
    text: string;
    timeCreated: Date;
    replies: Reply[];
    isLocked: Boolean = false;

    constructor(){
        this.id = Thread.total;

        this.name = "";
        this.author = new User();
        this.topic1 = "";
        this.topic2 = "";
        this.topic3 = "";
        this.timeCreated = new Date();
        this.text = "";
        this.replies = [];
        this.isLocked = false; 
       }

    // Used to fill the thread fields
    populateThread(name:string, author:User, topic1:string, 
                    topic2:string, topic3:string, text:string) {
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
        this.replies.push(reply);
    }
}