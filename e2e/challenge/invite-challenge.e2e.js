/* eslint-disable no-promise-executor-return */
/* eslint-disable no-undef */

import {
  expectToBeVisibleByLabel,
  loginFlow,
} from '../../app/utils/testCaseHelper';

const loginInputData = {
  email: 'makani20@gmail.com',
  password: '123456',
};

describe('TownsCup login flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  loginFlow(loginInputData);
  it('choose opponent player', async () => {
    await element(by.id('newsfeed-tab')).tap();
    await element(by.id('search-entity-button')).tap();
    await element(by.id('entity-search-input')).typeText('vin');
    await element(by.text('Vineet Patidar')).tap();
    await element(by.text('Tennis Singles')).tap();
  });

  it('check invite or challenge opetions', async () => {
    const inviteVisible = await expectToBeVisibleByLabel('invite-button');
    const bothVisible = await expectToBeVisibleByLabel('both-button');
    const challengeVisible = await expectToBeVisibleByLabel('challenge-button');

    if (inviteVisible) {
      await element(by.label('invite-button')).tap();
      await element(by.id('invite-challenge-scroll')).scroll(500, 'down');
      await element(by.text('CHOOSE DATE & TIME')).tap();
      await element(by.text('17')).tap();
      await element(by.label('0')).tap();
      await element(by.text('Save')).tap();
      await element(by.id('invite-challenge-scroll')).scroll(1000, 'down');
      await element(by.text('NEXT')).tap();
      await element(by.text('NEXT')).tap();
      await element(by.text('SEND INVITE TO CHALLENGE')).tap();
    } else if (bothVisible) {
      await element(by.label('both-button')).tap();
      await element(by.text('Invite to Challenge')).tap();
      await element(by.id('invite-challenge-scroll')).scroll(500, 'down');
      await element(by.text('CHOOSE DATE & TIME')).tap();
      await element(by.text('11')).tap();
      await element(by.label('0')).tap();
      await element(by.text('Save')).tap();
      await element(by.id('invite-challenge-scroll')).scroll(1000, 'down');
      await element(by.text('NEXT')).tap();
      await element(by.text('NEXT')).tap();
      await element(by.text('SEND INVITE TO CHALLENGE')).tap();
    } else if (challengeVisible) {
      await element(by.label('challenge-button')).tap();
      await element(by.text('CHECK AVAILIBILITY')).tap();
      await element(by.text('21')).tap();
      await element(by.label('0')).tap();
      await element(by.text('Save')).tap();
      await element(by.id('challenge-scroll')).scroll(1000, 'down');
      await element(by.text('NEXT')).tap();
      await element(by.text('NEXT')).tap();
      await element(by.text('NEXT')).tap();
      await element(by.id('challenge-payment-scroll')).scroll(1000, 'down');
      await element(by.text('+ Add a payment method')).tap();

      const addCardVisible = await expectToBeVisibleByLabel('add-card-screen');
      console.log('addCardVisible', addCardVisible);

      if (addCardVisible) {
        await new Promise((resolve) => setTimeout(resolve, 20000));
      } else {
        // await element(by.text('+ Add a payment method')).tap();
        // await new Promise((resolve) => setTimeout(resolve, 20000));
        await element(by.label('0')).tap();
        await element(by.text('Done')).tap();
      }
      await element(by.text('CONFIRM AND PAY')).tap();
    }

    await element(by.text('OK')).tap();
    await element(by.id('account-tab')).tap();
    await expect(element(by.id('account-screen'))).toBeVisible();

    await element(by.id('account-scroll')).scroll(1000, 'down');
    await element(by.text('Log out')).tap();
  });
});
