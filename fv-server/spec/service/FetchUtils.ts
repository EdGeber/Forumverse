import fetch from 'node-fetch'
import { GetServerUrlFor } from "../../../common/fvUrls";

const HEADERS = { 'Content-Type': 'application/json' };

export async function get(pageName: string) {
	return fetch(GetServerUrlFor(pageName));
}

export async function post(pageName: string, obj: any) {
	return fetch(GetServerUrlFor(pageName), {
		method: 'POST',
		body: JSON.stringify(obj),
		headers: HEADERS
	});
}

export async function put(pageName: string, obj: any) {
	return fetch(GetServerUrlFor(pageName), {
		method: 'PUT',
		body: JSON.stringify(obj),
		headers: HEADERS
	});
}