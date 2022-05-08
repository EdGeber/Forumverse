import { ExpectElementExistsWithName, Setup } from '../utils';
import { GetGuiUrlFor } from '../../common/fvUrls'
import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by, ExpectedConditions } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

defineSupportCode(({ Given, When, Then }) => {
	Given(
	`There is no registered user in the forum with username "{username}", be it admin or non-admin`,
	async (username) => {
		await Setup(browser);
	});

	Given(`I am at the sign in page`, async () => {
		await browser.get(GetGuiUrlFor('register'));
		await ExpectElementExistsWithName('user-regist-top-bar');
	});

	When(
	`I try to create an account with username "{username}", email "{email}" and password "{pass}"`,
	async (username: string, email: string, pass: string) => {
		await element(by.name("emailBox")).sendKeys(email);
		await element(by.name("nameBox")).sendKeys(username);
		await element(by.name("passBox")).sendKeys(pass);

		await element(by.buttonText("Done!")).click();
	});

	Then(`The system acknowledges successful account creation`, async () => {
		await ExpectElementExistsWithName('main-top-bar');
	})
});
