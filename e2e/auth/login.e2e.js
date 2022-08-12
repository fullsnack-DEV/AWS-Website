/* eslint-disable no-promise-executor-return */
/* eslint-disable no-undef */

const {loginFlow} = require('../../app/utils/testCaseHelper');

const loginInputData = {
  email: 'vineetpatidar@gmail.com',
  password: '123456',
};

describe('TownsCup login flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  loginFlow(loginInputData);
});
