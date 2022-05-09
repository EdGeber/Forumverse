import { ACK, Ack } from "../../../common/Ack";
import { GetServerUrlFor } from "../../../common/fvUrls";
import { User } from "../../../common/User";
import fetch from 'node-fetch'

const HEADERS = { 'Content-Type': 'application/json' };

async function get(pageName: string) {
	return fetch(GetServerUrlFor(pageName));
}

async function post(pageName: string, obj: any) {
	return fetch(GetServerUrlFor(pageName), {
		method: 'POST',
		body: JSON.stringify(obj),
		headers: HEADERS
	});
}

async function put(pageName: string, obj: any) {
	return fetch(GetServerUrlFor(pageName), {
		method: 'PUT',
		body: JSON.stringify(obj),
		headers: HEADERS
	});
}

describe("The Forumverse server's user registration service", () => {

	beforeEach(() => {
		fetch(GetServerUrlFor('/clear_users'));
		fetch(GetServerUrlFor('/clear_threads'));
	})

	it("acknowledges new user registration", async () => {
		let user1 = new User('email1', 'name1', 'pass1');

		let response = await post('register', user1);

		expect(response.ok).toEqual(true);

		let ack = Ack.fromAny(await response.json());
		expect(ack).toEqual(ACK.REGISTER_USER.OK);
	});

	it("acknowledges new admin registration", async () => {

	});

	it("acknowledges invalid admin token", async () => {

	});

	it("acknowledges user with missing field", async () => {

	});

	it("acknowledges admin with missing field", async () => {

	});

	it("acknowledges duplicate username", async () => {

	});

	it("acknowledges duplicate email-password", async () => {

	});
});
