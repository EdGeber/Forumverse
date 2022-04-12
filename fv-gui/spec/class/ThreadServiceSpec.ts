import { UserService } from '../../src/app/services/user.service'
import { ACK, Ack } from '../../../common/Ack'
import { lastValueFrom, of } from 'rxjs';
import { Thread } from '../../../common/Thread';


describe("ThreadService's tryCreateThread", () => {

    it("tells when a thread field is missing on creation", async () => {
        let thread1 = new Thread()
    })

});
