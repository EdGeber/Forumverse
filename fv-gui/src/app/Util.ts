import { Thread } from "../../../common/Thread";

export class Util{
    public static formatTime(time:Date): string{
        time = new Date(time)
        return time.toLocaleDateString() + " " + time.toLocaleTimeString('en-US')
    }

    public static getThreadLastActivity(thread: Thread): Date{
        let replies = thread.replies;
        if(replies.length > 0){
            let lastActivity = replies[replies.length-1].timeSent;
            return lastActivity;
        } else {
            return thread.timeCreated;
        }
    }
}