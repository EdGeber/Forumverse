import { Reply } from "./Reply";
import { User } from "./User";

export class Thread{
    
    static total: number = 0;

    public id = Thread.total;
    public timeCreated = new Date();
    public replies: Reply[] = [];
    public isLocked = false;
    
    constructor(
        public name = "",
        public author = new User(),
        public topic1 = false,
        public topic2 = false,
        public topic3 = false,
        public text = "",
    ) { }

    addReply(reply: Reply){
        reply.id = this.replies.length;
        this.replies.push(reply);
    }
}