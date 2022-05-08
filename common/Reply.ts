import { User } from "./User";

export class Reply{
    static totalReplies = 0;
    
    id: number;
    author: User;
    timeSent: Date;
    content: string;
    quoteOf: Reply|null;

    constructor(author:User, content:string, quotedReply:Reply|null = null){
        Reply.totalReplies++;
        this.id = Reply.totalReplies;
        this.author = author;
        this.content = content;
        this.timeSent = new Date();
        this.quoteOf = quotedReply;
    }
}