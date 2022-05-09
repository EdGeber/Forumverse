import { Click, ExpectAtPage, ExpectThreadExists, Setup, SetupTestUser, SuccessfulGoToPageByClicking, testUserName } from '../utils';
import { defineSupportCode } from 'cucumber';
import { browser, element, by, } from 'protractor';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

defineSupportCode(({ Given, When, Then }) => {
	Given(
	`não há nenhuma lista de discussão chamada "{threadName}" no tópico "{topicName}"`,
	async (threadName: string, topicName: string) => {
		await Setup(browser);
	});

	Given(
	`eu estou na página "Criação de lista de discussão"`, async () => {
		await SetupTestUser(browser);
		await SuccessfulGoToPageByClicking('create-thread-button', 'create-thread')
	});

	When(`eu insiro o nome "{threadName}"`, async (threadName: string) => {
		await element(by.name("threadNameBox")).sendKeys(threadName);
	});

	When(`eu seleciono o tópico "{topicName}"`, async (topicName: string) => {
		await element(by.id(topicName)).click();
	});

	When(`eu confirmo a criação da thread`, async () => {
		await Click("confirmInput")
	})

	Then(
	`recebo uma confirmação de que a lista de discussão foi criada`,
	async () => {
		await ExpectAtPage('home');
	});

	Then(
	`eu vejo que foi criada a lista de discussão de nome "{threadName}" no tópico "{topicName}"`,
	async(threadName: string, topicName: string) => {
		await ExpectThreadExists(threadName, testUserName, [topicName]);
	});
});
