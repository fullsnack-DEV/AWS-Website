/* eslint-disable no-promise-executor-return */
/* eslint-disable no-undef */

const {loginFlow} = require('../../app/utils/testCaseHelper');

const loginInputData = {
  email: 'makani20+12@gmail.com',
  password: '123456',
  sportName: 'Soccer',
  teamName: 'Auto Test Soccer',
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
  it('Create team', async () => {
    await element(by.label('Teams')).tap();
    await element(by.text('Create Team')).tap();
  });
  it('sport selected', async () => {
    await element(by.id('choose-sport')).tap();
    await element(by.text(loginInputData.sportName)).tap();
  });
  it('Team name', async () => {
    await element(by.id('team-name-input')).clearText();
    await element(by.id('team-name-input')).typeText(loginInputData.teamName);
  });
  it('Choose city', async () => {
    await element(by.id('choose-location-button')).tap();
    await element(by.id('choose-location-input')).typeText('surat');
    await element(by.text('Surat, Gujarat, India')).tap();
    await element(by.text('NEXT')).tap();
  });
  it('Choose team gender', async () => {
    await element(by.id('gender-button')).tap();
    await element(by.text('Male')).tap();
  });
  it('Choose players age', async () => {
    await element(by.id('min-age-picker')).tap();
    await element(by.text('10')).tap();
    await element(by.text('Done')).tap();

    await element(by.id('max-age-picker')).tap();
    await element(by.text('50')).tap();
    await element(by.text('Done')).tap();
  });
});
