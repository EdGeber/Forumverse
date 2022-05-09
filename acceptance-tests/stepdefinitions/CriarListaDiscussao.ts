import { ExpectButtonExistsWithText, ExpectElementExistsWithName, Setup } from '../utils';
import { GetGuiUrlFor } from '../../common/fvUrls'
import { defineSupportCode } from 'cucumber';
import { browser, $, element, ElementArrayFinder, by, ExpectedConditions } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

// defineSupportCode(({ Given, When, Then }) => {
// 	Given(
// 	`Given não há nenhuma lista de discussão chamada "{threadName}" no tópico "{topicName}"`,
// 	async (threadName: string, topicName: string) => {
// 		await Setup(browser);
// 	});

// 	Given(
// 	`eu estou na página "Criação de lista de discussão"`, async () => {
// 		await GoToPage('login', browser);
// 		await LoginUser()
// 	});
// });
