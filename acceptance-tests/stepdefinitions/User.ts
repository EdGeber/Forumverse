import { ExpectButtonExistsWithText, ExpectElementExistsWithName, Setup, SuccessfulGoToPage, TryLoginUser, TryRegisterUser } from '../utils';
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
		await SuccessfulGoToPage('register', browser);
	});

	When(
	`I try to create an account with username "{username}", email "{email}" and password "{pass}"`,
	async (username: string, email: string, pass: string) => {
		await TryRegisterUser(email, username, pass);
	});

	Then(`The system acknowledges successful account creation`, async () => {
		await ExpectElementExistsWithName('main-top-bar');
	});

	When(`I go to the log in page`, async () => {
		await SuccessfulGoToPage('login', browser);
	});

	When(
	`I input "{email}" for the email and "{pass}" for the password`,
	async (email: string, pass: string) => {
		await TryLoginUser(email, pass);
	});

	Then(`I am able to authenticate successfully`, async () => {
		await ExpectElementExistsWithName('main-top-bar');
		await ExpectButtonExistsWithText('Log out');
	});

	Then(`I am at the forum's initial page`, async () => {
		await ExpectElementExistsWithName('main-top-bar');
	});
});
