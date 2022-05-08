import { ExpectElementExistsWithName, Setup } from '../utils';
import { GetGuiUrlFor } from '../../common/fvUrls'
import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

defineSupportCode(({ Given, When, Then }) => {
	Given(
	/^There is no registered user in the forum with username "Fred", be it admin or non-admin$/,
	async () => {
		await Setup(browser);
	});

	Given("I am at the sign in page", async () => {
		await browser.get(GetGuiUrlFor('register'));
		await ExpectElementExistsWithName('user-regist-top-bar');
	});	
});
