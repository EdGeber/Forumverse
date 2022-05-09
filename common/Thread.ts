import { Reply } from "./Reply";
import { User } from "./User";

export class Thread{
    
    public id = -1;
    public timeCreated = new Date();
    public lastReply = this.timeCreated.getSeconds();
    public replies: Reply[] = [];
    public isLocked = false;
    
    constructor(
        public relevantRatio = 0,
        public name = "",
        public author = new User(),
        public topic1 = false,
        public topic2 = false,
        public topic3 = false,
        public text = "",
    ) { }   
}
