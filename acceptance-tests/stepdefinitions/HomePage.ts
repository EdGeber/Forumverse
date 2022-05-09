import { AsyncHoldsForEach, Click, ExpectAtPage, ExpectThreadDoesNotExist, ExpectThreadExists, FilterThreadsByName, Setup, SetupTestUser, SuccessfulCreateThread, SuccessfulGoToPageByClicking, testUserName, topicNames } from '../utils';
import { defineSupportCode } from 'cucumber';
import { browser, element, by, } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

defineSupportCode(({ Given, When, Then }) => {
	Given(`I am at the "Home" page.`, async () => {
		await Setup(browser);
	});

	Given(
	`I see a discussion with title "{title}" and topic "{topic}"`,
	async (title: string, topic: string) => {
		await SetupTestUser(browser);
		await SuccessfulCreateThread(testUserName, title, [topic], "lorem ipsum");
	});

	When(`I filter the threads by name "{name}"`, async (name: string) => {
		await FilterThreadsByName(name);
	});

	Then(
	`I can see a discussion with title "{title}" and topic "{topic}"`,
	async (title: string, topic: string) => {
		await ExpectThreadExists(title, null, [topic]);
	});

	Then(
	`I can't see any discussion with title "{title}"`,
	async (title: string) => {
		await ExpectThreadDoesNotExist(title, null, null);
	});
})
