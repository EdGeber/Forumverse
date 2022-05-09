import { ACK, Ack } from "../../../common/Ack";
import { GetServerUrlFor } from "../../../common/fvUrls";
import { User } from "../../../common/User";
import fetch from 'node-fetch'
import { get, post } from "./FetchUtils";
import { Thread } from "../../../common/Thread";

describe("The Forumverse server's user registration service", () => {

	beforeEach(async () => {
		expect((await get('clear_users')).ok).toEqual(true);
	})

	it("acknowledges new user registration", async () => {
		let user1 = new User('email1', 'name1', 'pass1');

		let response = await post('register', user1);

		expect(response.ok).toEqual(true);

		let ack = Ack.fromAny(await response.json());
		expect(ack).toEqual(ACK.REGISTER_USER.OK);
	});

	it("acknowledges new admin registration", async () => {
		let admin1 = new User('email1', 'name1', 'pass1', true, '123');

		let response = await post('register', admin1);

		expect(response.ok).toEqual(true);

		let ack = Ack.fromAny(await response.json());
		expect(ack).toEqual(ACK.REGISTER_USER.OK);
	});

	it("acknowledges invalid admin token", async () => {
		let admin1 = new User('email1', 'name1', 'pass1', true, 'a');

		let response = await post('register', admin1);

		expect(response.ok).toEqual(true);

		let ack = Ack.fromAny(await response.json());
		expect(ack).toEqual(ACK.REGISTER_USER.INVALID_TOKEN);
	});

	it("acknowledges user with missing field", async () => {
		let user1 = new User('email1', 'name1', '');

		let response = await post('register', user1);

		expect(response.ok).toEqual(true);

		let ack = Ack.fromAny(await response.json());
		expect(ack).toEqual(ACK.REGISTER_USER.MISSING_FIELD);
	});

	it("acknowledges admin with missing field", async () => {
		let admin1 = new User('', 'name1', 'pass1', true, '123');

		let response = await post('register', admin1);

		expect(response.ok).toEqual(true);

		let ack = Ack.fromAny(await response.json());
		expect(ack).toEqual(ACK.REGISTER_USER.MISSING_FIELD);
	});

	it("acknowledges duplicate username", async () => {
		let user1 = new User('email1', 'name1', 'pass1');

		let response1 = await post('register', user1);

		expect(response1.ok).toEqual(true);

		let ack1 = Ack.fromAny(await response1.json());
		expect(ack1).toEqual(ACK.REGISTER_USER.OK);


		let user2 = new User('email2', 'name1', 'pass2');

		let response2 = await post('register', user2);

		expect(response2.ok).toEqual(true);

		let ack = Ack.fromAny(await response2.json());
		expect(ack).toEqual(ACK.REGISTER_USER.DUPLICATE_USERNAME);
	});

	it("acknowledges duplicate email-password", async () => {
		let user1 = new User('email1', 'name1', 'pass1');

		let response1 = await post('register', user1);

		expect(response1.ok).toEqual(true);

		let ack1 = Ack.fromAny(await response1.json());
		expect(ack1).toEqual(ACK.REGISTER_USER.OK);


		let user2 = new User('email1', 'name2', 'pass1');

		let response2 = await post('register', user2);

		expect(response2.ok).toEqual(true);

		let ack = Ack.fromAny(await response2.json());
		expect(ack).toEqual(ACK.REGISTER_USER.DUPLICATE_EMAIL_AND_PASS);
	});
});

describe("The Forumverse server's thread creation service", () => {

	beforeEach(async () => {
		expect((await get('clear_users')).ok).toEqual(true);
		expect((await get('clear_threads')).ok).toEqual(true);
	})

	it("acknowledges new thread creation", async () => {
		let user1 = new User("email1", "username1", "pass1");
		let thread1 = new Thread(0, "name1", user1, true, false, false, "text1");

		let response = await post('thread', thread1);

		expect(response.ok).toEqual(true);

		let ack = Ack.fromAny(await response.json());
		expect(ack).toEqual(ACK.THREAD.OK);
	});

	it("acknowledges missing thread name", async () => {
		let user1 = new User("email1", "username1", "pass1");
		let thread1 = new Thread(0, "", user1, true, false, false, "text1");

		let response = await post('thread', thread1);

		expect(response.ok).toEqual(true);

		let ack = Ack.fromAny(await response.json());
		expect(ack).toEqual(ACK.THREAD.MISSING_NAMEFIELD);
	});

	it("acknowledges missing thread topics", async () => {
		let user1 = new User("email1", "username1", "pass1");
		let thread1 = new Thread(0, "name1", user1, false, false, false, "text1");

		let response = await post('thread', thread1);

		expect(response.ok).toEqual(true);

		let ack = Ack.fromAny(await response.json());
		expect(ack).toEqual(ACK.THREAD.MISSING_TOPICFIELD);
	});

	it("acknowledges duplicate thread name", async () => {
		let user1 = new User("email1", "username1", "pass1");
		let thread1 = new Thread(0, "name1", user1, true, false, false, "text1");

		let response1 = await post('thread', thread1);

		expect(response1.ok).toEqual(true);

		let ack1 = Ack.fromAny(await response1.json());
		expect(ack1).toEqual(ACK.THREAD.OK);


		let user2 = new User("email2", "username2", "pass2");
		let thread2 = new Thread(0, "name1", user2, false, false, true, "text2");

		let response2 = await post('thread', thread2);

		expect(response2.ok).toEqual(true);

		let ack = Ack.fromAny(await response2.json());
		expect(ack).toEqual(ACK.THREAD.DUPLICATE_THREADNAME);
	});
})
