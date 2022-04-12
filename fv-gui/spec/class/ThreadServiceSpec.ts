import { UserService } from '../../src/app/services/user.service'
import { ACK, Ack } from '../../../common/Ack'
import { last, lastValueFrom, of } from 'rxjs';
import { Thread } from '../../../common/Thread';
import { User } from '../../../common/User';
import { ThreadService } from '../../src/app/services/thread.service';


describe("ThreadService's tryCreateThread", () => {

    it("tells when a thread name is missing on creation", async () => {
        let user1 = new User("email1", "username1", "pass1");
        let thread1 = new Thread("name1", user1, true, false, false, "text1"); // ok
        let thread2 = new Thread("", user1, true, false, false, "text2");      // missing name

        let ack1 = await lastValueFrom(ThreadService.tryCreateThread(thread1));
        let ack2 = await lastValueFrom(ThreadService.tryCreateThread(thread2));

        expect(ack1).toEqual(ACK.THREAD.OK);
        expect(ack2).toEqual(ACK.THREAD.MISSING_NAMEFIELD);
    });

});
