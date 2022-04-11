import { User } from "./User";

export class Reply{
    id: number = -1;
    author: User;
    timeSent: Date;
    content: string;

    constructor(author:User, content:string){
        this.author = author;
        this.content = content;
        this.timeSent = new Date();
    }
}