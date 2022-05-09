import { $, by, element, ElementArrayFinder } from 'protractor';
import { GetGuiUrlFor, GetServerUrlFor } from "../common/fvUrls";
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

const testUserEmail    = "Naomi@Japan.co"
const testUserName     = "Naomi"
const testUserPassword = "111"

/*
Clear server data and asserts being at the home page.
*/
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

export async function SuccessfulGoToPage(pageName: string, browser) {
	var nameOfExpectedExistingElement = {
		'register': 'user-regist-top-bar',
		'login': 'login-top-bar'
	}

	await browser.get(GetGuiUrlFor(pageName));
	await ExpectElementExistsWithName(nameOfExpectedExistingElement[pageName]);
}

/*
Assumes browser is at the register page.
Leads the browser to the home page.
*/
export async function TryRegisterUser(email: string, username: string, password: string) {
	await element(by.name("emailBox")).sendKeys(email);
	await element(by.name("nameBox")).sendKeys(username);
	await element(by.name("passBox")).sendKeys(password);

	await element(by.buttonText("Done!")).click();
}

/*
Assumes browser is at the register page.
Leads the browser to the home page.
*/
export async function SuccessfulRegisterUser(email: string, username: string, password: string) {
	TryRegisterUser(email, username, password);

	await ExpectElementExistsWithName('main-top-bar');
}

/*
Assumes browser is at the login page.
Leads the browser to the home page.
*/
export async function TryLoginUser(email: string, password: string) {
	await element(by.name("emailBox")).sendKeys(email);
	await element(by.name("passBox")).sendKeys(password);

	await element(by.buttonText("Done!")).click();
}

/*
Assumes browser is at the login page.
Leads the browser to the home page.
*/
export async function SuccessfulLoginUser(email: string, username: string, password: string) {
	TryLoginUser(email, password);

	await ExpectElementExistsWithName('main-top-bar');
	await ExpectButtonExistsWithText('Log out');
	await expect(element(by.name('logged-user-name')).getText()).eventually.equal(username);
}

/*
Assumes browser is at the register page.
Leads the browser to the home page.
*/
export async function RegisterTestUser() {
	await SuccessfulRegisterUser(testUserEmail, testUserName, testUserPassword);
}

/*
Assumes browser is at the login page.
Leads the browser to the home page.
*/
export async function LoginTestUser() {
	await SuccessfulLoginUser(testUserEmail, testUserName, testUserPassword);
}

/*
Doesn't assume any initial page.
Leads the browser to the home page.
*/
export async function SetupTestUser(browser) {
	await SuccessfulGoToPage('register', browser);
	await RegisterTestUser();
	await SuccessfulGoToPage('login', browser);
	await LoginTestUser();
}
