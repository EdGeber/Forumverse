import { $, by, element, ElementArrayFinder } from 'protractor';
import { GetGuiUrlFor, GetServerUrlFor } from "../common/fvUrls";
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

export const topicNames = ["python", "c++", "html"];

export const testUserEmail    = "Naomi@Japan.co";
export const testUserName     = "Naomi";
export const testUserPassword = "111";

/*
Clear server data and asserts being at the home page.
*/
export async function Setup(browser: any) {
	var waitTime = 50;
	await browser.wait(new Promise(function(resolve, reject) {
		setTimeout(() => resolve(true), waitTime);
	}));
	await browser.get(GetServerUrlFor("clear_users"));
	await browser.get(GetServerUrlFor("clear_threads"));
	await browser.get(GetGuiUrlFor("home"));
	await browser.refresh();
	await expect(browser.getTitle()).eventually.equal('Forumverse');
}

export async function ExpectElementExistsWithName(name: string) {
	await expect(element(by.name(name)).isPresent()).eventually.equal(true);
}

export async function ExpectAtPage(pageName: string) {
	var nameOfExpectedExistingElement = {
		'home': 'main-top-bar',
		'register': 'user-regist-top-bar',
		'login': 'login-top-bar',
		'create-thread': 'create-thread-header'
	}

	await ExpectElementExistsWithName(nameOfExpectedExistingElement[pageName]);
}

export async function SuccessfulGoToPage(pageName: string, browser) {
	await browser.get(GetGuiUrlFor(pageName));
	await ExpectAtPage(pageName);
}

export async function Click(clickableName: string) {
	await element(by.name(clickableName)).click();
}

export async function SuccessfulGoToPageByClicking(clickableName: string, pageName: string) {
	await Click(clickableName);
	await ExpectAtPage(pageName);
}

/*
Assumes browser is at the register page.
Leads the browser to the home page.
*/
export async function TryRegisterUser(email: string, username: string, password: string) {
	await element(by.name("emailBox")).sendKeys(email);
	await element(by.name("nameBox")).sendKeys(username);
	await element(by.name("passBox")).sendKeys(password);

	await Click("confirmInput");
}

/*
Assumes browser is at the register page.
Leads the browser to the home page.
*/
export async function SuccessfulRegisterUser(email: string, username: string, password: string) {
	await TryRegisterUser(email, username, password);

	await ExpectElementExistsWithName('main-top-bar');
}

/*
Assumes browser is at the login page.
Leads the browser to the home page.
*/
export async function TryLoginUser(email: string, password: string) {
	await element(by.name("emailBox")).sendKeys(email);
	await element(by.name("passBox")).sendKeys(password);

	await Click("confirmInput");
}

/*
Assumes the browser is at the home page.
*/
export async function IsLoggedAs(username: string) {
	let loggedUserNameElement = element(by.name('logged-user-name'));
	if(!(await loggedUserNameElement.isPresent())) return false;
	return (await loggedUserNameElement.getText()) == username;
}

/*
Assumes the browser is at the home page.
*/
export async function ExpectLoggedAs(username: string) {
	await expect(IsLoggedAs(username)).eventually.equal(true);
}

/*
Assumes browser is at the login page.
Leads the browser to the home page.
*/
export async function SuccessfulLoginUser(email: string, username: string, password: string) {
	await TryLoginUser(email, password);

	await ExpectElementExistsWithName('main-top-bar');
	await ExpectElementExistsWithName('logout-button');
	await ExpectLoggedAs(username);
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
Assumes browser is at the home page.
Leaves the browser at the home page.
*/
export async function SetupTestUser(browser) {
	if (await IsLoggedAs(testUserName)) return;
	await SuccessfulGoToPageByClicking('signup-button', 'register');
	await RegisterTestUser();
	await SuccessfulGoToPageByClicking('login-button', 'login');
	await LoginTestUser();
}

export async function AsyncHoldsForEach(array, predicate): Promise<boolean> {
	for(let x of array) if(!(await predicate(x))) return false;
	return true;
}

/*
Assumes browser is at the main page.
*/
export async function ThreadExists(name: string, author: string|null, topics: string[] | null) {
	let allThreadBoxes = await element.all(by.className("thread-box-wrapper"));

	let threadExists = false;
	for(let finder of allThreadBoxes) {
		threadExists = (((await finder.element(by.name("thread-name")).getText()) == name)
		&& (author == null || (await finder.element(by.name("thread-author-name")).getText()) == author)
		&& (topics == null || (await AsyncHoldsForEach(topics, async (topic) => finder.element(by.name(`${topic}-topic`)).isPresent()))));
		if(threadExists) break;
	}

	return threadExists;
}

/*
Assumes browser is at the main page.
*/
export async function ExpectThreadExists(name: string, author: string|null, topics: string[] | null) {
	await expect(ThreadExists(name, author, topics)).eventually.equal(true);
}

/*
Assumes browser is at the main page.
*/
export async function ExpectThreadDoesNotExist(name: string, author: string|null, topics: string[] | null) {
	await expect(ThreadExists(name, author, topics)).eventually.equal(false);
}

/*
Assumes browser is logged in and at the main page.
*/
export async function SuccessfulCreateThread(author: string, title: string, topics: string[], body: string) {
	await SuccessfulGoToPageByClicking('create-thread-button', 'create-thread');
	await element(by.name("threadNameBox")).sendKeys(title);
	for(let topic of topics) await element(by.id(topic)).click();
	await element(by.name("threadBodyBox")).sendKeys(body);

	await Click("confirmInput");

	await ExpectAtPage('home');

	await ExpectThreadExists(title, author, topics);
}

/*
Assumes browser is at the main page.
*/
export async function FilterThreadsByName(name: string) {
	await element(by.id("topbar-search-bar")).sendKeys(name);
	await Click("searchByNameButton");
}
