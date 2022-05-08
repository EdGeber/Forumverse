import { $, element, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;
import { GetGuiUrlFor, GetServerUrlFor } from "../common/fvUrls"

export async function Setup(browser: any) {
	await browser.get(GetServerUrlFor("clear_users"));
	await browser.get(GetServerUrlFor("clear_threads"));
	await browser.get(GetGuiUrlFor("home"));
	await browser.refresh();
	await expect(browser.getTitle()).eventually.equal('Forumverse');
}

export async function ExpectElementExistsWithName(name: string) {
	await expect(element(by.name(name)).isPresent()).eventually.equal(true);
}
