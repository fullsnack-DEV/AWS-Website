/* eslint-disable no-promise-executor-return */
/* eslint-disable no-undef */

const {loginFlow} = require('../../app/utils/testCaseHelper');

const loginInputData = {
  email: 'makani20+12@gmail.com',
  password: '123456',
  sportName: 'Tennis Singles',
  matchFee: '15',
  venueName: 'TC Ground',
  venueDescription: 'Superb Ground',
  generalRules: 'This is test general rules.',
  specialRules: 'This is test special rules.',
};
describe('TownsCup register sport flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  loginFlow(loginInputData);
  it('click on account tab', async () => {
    await element(by.id('account-tab')).tap();
  });

  it('Registered sport setting', async () => {
    await element(by.label('Playing')).tap();
    await element(by.text(loginInputData.sportName)).tap();
  });
  it('Choose challenge setting', async () => {
    await element(by.text('Challenge settings')).tap();
  });
  it('Save all setting of challenge', async () => {
    await element(by.text('Availability')).tap();
    await element(by.text('Save')).tap();

    await element(by.text('Game Type')).tap();
    await element(by.text('All')).tap();
    await element(by.text('Save')).tap();

    await element(by.text('Match Fee')).tap();
    await element(by.id('game-fee-input')).clearText();
    await element(by.id('game-fee-input')).typeText(loginInputData.matchFee);
    await element(by.text('Save')).tap();

    await element(by.id('manage-challenge-screen')).scroll(500, 'down');

    await element(by.text('Refund Policy')).tap();
    await element(by.label('1')).tap();
    await element(by.text('Save')).tap();

    await element(by.text('Home & Away')).tap();
    await element(by.text('Save')).tap();

    await element(by.text('Sets, Points & Duration')).tap();
    await element(by.text('Save')).tap();

    await element(by.text('Venue')).tap();
    await element(by.id('venue-name-input')).clearText();
    await element(by.id('venue-name-input')).typeText(loginInputData.venueName);
    await element(by.id('venue-button')).tap();
    await element(by.id('location-input')).typeText('surat');
    await element(by.label('0')).tap();
    await element(by.id('venue-detail-input')).clearText();
    await element(by.id('venue-detail-input')).typeText(
      loginInputData.venueDescription,
    );
    await element(by.text('Save')).tap();
    await element(by.text('Game Rules')).tap();
    await element(by.id('general-rules-input')).clearText();
    await element(by.id('general-rules-input')).typeText(
      loginInputData.generalRules,
    );
    await element(by.id('special-rules-input')).clearText();
    await element(by.id('special-rules-input')).typeText(
      loginInputData.specialRules,
    );
    await element(by.text('Save')).tap();

    await element(by.text('Referees')).tap();
    await element(by.text('Referee(s)')).tap();
    await element(by.text('4')).tap();
    await element(by.text('Save')).tap();

    await element(by.text('Scorekeepers')).tap();
    await element(by.text('Scorekeeper(s)')).tap();
    await element(by.text('4')).tap();
    await element(by.text('Save')).tap();
  });
});
