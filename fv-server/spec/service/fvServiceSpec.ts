import { ACK, Ack } from "../../../common/Ack";
import { GetServerUrlFor } from "../../../common/fvUrls";
import { User } from "../../../common/User";
import fetch from 'node-fetch'
import { post } from "./FetchUtils";

describe("The Forumverse server's user registration service", () => {

	beforeEach(async () => {
		expect((await fetch(GetServerUrlFor('clear_users'))).ok).toEqual(true);
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
