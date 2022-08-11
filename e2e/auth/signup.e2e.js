/* eslint-disable no-promise-executor-return */
/* eslint-disable no-undef */

import {expectToBeVisibleById} from '../../app/utils/testCaseHelper';

const signUpInputData = {
  email: 'makani20+11@gmail.com',
  password: '123456',
  cpassword: '123456',
  fname: 'Kishan',
  lname: 'Eleven',
  birthday: '1991-01-01',
  location: 'Surat',
};
describe('TownsCup signup flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('Basic information filled', async () => {
    await element(by.id('signup-button')).tap();
    await element(by.id('email-signup-input')).typeText(signUpInputData.email);
    await element(by.id('password-signup-input')).typeText(
      signUpInputData.password,
    );
    await element(by.id('cpassword-signup-input')).typeText(
      signUpInputData.cpassword,
    );
    await element(by.id('signup-nav-text')).tap();
  });

  it('Email verified', async () => {
    await new Promise((resolve) => setTimeout(resolve, 20000));
    await element(by.id('verify-email-button')).tap();
  });

  it('First and Last name information', async () => {
    await element(by.id('fname-signup-input')).typeText(signUpInputData.fname);
    await element(by.id('lname-signup-input')).typeText(signUpInputData.lname);
    await element(by.id('next-signup-button')).tap();
  });

  it('Birthday information', async () => {
    await expect(element(by.id('birthday-signup-picker'))).toBeVisible();
    await element(by.id('birthday-signup-picker')).setDatePickerDate(
      signUpInputData.birthday,
      'yyyy-MM-dd',
    );
    await element(by.id('next-signupBirthday-button')).tap();
  });

  it('Gender information', async () => {
    await element(by.id('next-signupGender-button')).tap();
  });

  it('Location information', async () => {
    await element(by.id('location-search-input')).typeText(
      signUpInputData.location,
    );
    await element(by.text('Surat, Gujarat, India')).tap();
  });

  it('Sport selection done', async () => {
    await element(by.text('Karate')).tap();
    await element(by.text('Soccer')).tap();
    await element(by.text('Tennis')).tap();
    await element(by.id('next-signupSport-button')).tap();
  });

  it('follow groups available ?', async () => {
    const screenVisible = await expectToBeVisibleById('followteam-signup-text');

    if (screenVisible) {
      await element(by.id('followteam-nav-button')).tap();
    }
  });
});
