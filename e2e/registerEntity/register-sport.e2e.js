/* eslint-disable no-promise-executor-return */
/* eslint-disable no-undef */

const {loginFlow} = require('../../app/utils/testCaseHelper');

const loginInputData = {
  email: 'makani20+11@gmail.com',
  password: '123456',
  sportName: 'Tennis Singles',
  language: ['English', 'Korean'],
  description:
    'This is test description of register player please enjoy auto text input description.',
};
describe('TownsCup register sport flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  loginFlow(loginInputData);
  it('click on account tab', async () => {
    await element(by.id('account-tab')).tap();
  });
  it('Register sport', async () => {
    await element(by.label('Playing')).tap();
    await element(by.text('Add a sport')).tap();
  });
  it('sport selected', async () => {
    await element(by.id('choose-sport')).tap();
    await element(by.text(loginInputData.sportName)).tap();
    await element(by.text('NEXT')).tap();
  });
  it('Choose language and write description', async () => {
    await element(by.id('choose-language')).tap();
    await element(by.text(loginInputData.language[0])).tap();
    await element(by.text(loginInputData.language[1])).tap();
    await element(by.text('Apply')).tap();
    await element(by.id('register-player-description')).clearText();
    await element(by.id('register-player-description')).typeText(
      loginInputData.description,
    );
    await element(by.text('DONE')).tap();
    await element(by.text('OK')).tap();
  });
});
