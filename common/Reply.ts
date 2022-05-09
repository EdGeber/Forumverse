import { User } from "./User";

export class Reply{    
    public id: number = -1;
    author: User;
    timeSent: Date;
    content: string;
    quoteOf: Reply|null;

    constructor(author:User, content:string, quotedReply:Reply|null = null){
        this.author = author;
        this.content = content;
        this.timeSent = new Date();
        this.quoteOf = quotedReply;
    }
}