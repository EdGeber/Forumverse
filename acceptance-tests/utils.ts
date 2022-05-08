import { $, by, element, ElementArrayFinder } from 'protractor';
import { GetGuiUrlFor, GetServerUrlFor } from "../common/fvUrls";
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

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

export async function ExpectButtonExistsWithText(text: string) {
	await expect(element(by.buttonText(text)).isPresent()).eventually.equal(true);
}

export async function GoToPage(pageName: string, browser) {
	await browser.get(GetGuiUrlFor(pageName));
}

export async function RegisterUser(email: string, username: string, password: string) {
	// assumes browser is at the login page
	await element(by.name("emailBox")).sendKeys(email);
	await element(by.name("nameBox")).sendKeys(username);
	await element(by.name("passBox")).sendKeys(password);

	await element(by.buttonText("Done!")).click();
}

export async function LoginUser(email: string, password: string) {
	await element(by.name("emailBox")).sendKeys(email);
	await element(by.name("passBox")).sendKeys(password);

	await element(by.buttonText("Done!")).click();
}
