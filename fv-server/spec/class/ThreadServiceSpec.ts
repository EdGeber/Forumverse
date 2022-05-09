import { ThreadService } from '../../threadService';
import { ACK } from '../../../common/Ack';
import { Thread } from '../../../common/Thread';
import { User } from '../../../common/User';
import { Reply } from '../../../common/Reply';


describe("ThreadService's tryCreateThread", () => {

	let threadService = new ThreadService();

	beforeEach(() => {
		threadService._clear();
	});

	it("correctly stores and delivers threads", () => {
		// create user 1
		let user1 = new User("email1", "username1", "pass1");
		// create user 2
		let user2 = new User("email2", "username2", "pass2");
		// create thread 1
		let thread1 = new Thread(0, "name1", user1, true, false, false, "text1");
		// create thread 2
		let thread2 = new Thread(0, "name2", user2, false, true, false, "text2");
		// send thread 1
		let ack1 = threadService.tryCreateThread(thread1);
		// check ack
		expect(ack1).toEqual(ACK.THREAD.OK);
		// send thead 2
		let ack2 = threadService.tryCreateThread(thread2);
		// check ack
		expect(ack2).toEqual(ACK.THREAD.OK);
		// ask for all threads
		let ack3 = threadService.getThreads();
		expect(ack3.code).toEqual(ACK.OK);
		// check length is 2
		let threads = ack3.body;
		expect(threads).not.toEqual(undefined);
		if(threads != undefined) {
			expect(threads.length).toEqual(2);
			// check fields of the two threads
			let receivedThread1 = threads[0];
			expect(receivedThread1.id).toEqual(1);
			expect(receivedThread1.name).toEqual(thread1.name);
			expect(receivedThread1.author.name).toEqual(user1.name);
			expect(receivedThread1.text).toEqual(thread1.text);

			let receivedThread2 = threads[1];
			expect(receivedThread2.id).toEqual(2);
			expect(receivedThread2.name).toEqual(thread2.name);
			expect(receivedThread2.author.name).toEqual(user2.name);
			expect(receivedThread2.text).toEqual(thread2.text);
		}
	});

    it("tells when a thread name is missing on creation", () => {
        let user1 = new User("email1", "username1", "pass1");
        let thread1 = new Thread(0, "name1", user1, true, false, false, "text1"); // ok
        let thread2 = new Thread(0, "", user1, true, false, false, "text2");      // missing name

        let ack1 = threadService.tryCreateThread(thread1);
        let ack2 = threadService.tryCreateThread(thread2);

        expect(ack1).toEqual(ACK.THREAD.OK);
        expect(ack2).toEqual(ACK.THREAD.MISSING_NAMEFIELD);
    });

	it("tells when a tentative reply is empty", () => {
		let user1 = new User("email1", "username1", "pass1");
		let thread1 = new Thread(0, "name1", user1, true, false, false, "text1"); // ok
		threadService.tryCreateThread(thread1);

		let reply1 = new Reply(user1, "content1");
		let reply2 = new Reply(user1, "");

		let ack1 = threadService.trySendReply(reply1, 1);
		expect(ack1).toEqual(ACK.THREAD.OK);

		let ack2 = threadService.trySendReply(reply2, 1);
		expect(ack2).toEqual(ACK.THREAD.EMPTY_REPLY_MSG);
	});

});
