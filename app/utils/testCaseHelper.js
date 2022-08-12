/* eslint-disable no-undef */
const expectToBeVisibleById = async (id) => {
  try {
    await expect(element(by.id(id))).toBeVisible();
    return true;
  } catch (e) {
    return false;
  }
};

const expectToBeVisibleByLabel = async (text) => {
  try {
    await expect(element(by.label(text))).toBeVisible();
    return true;
  } catch (e) {
    return false;
  }
};

const expectToBeVisibleScreen = async (id) => {
  try {
    await expect(element(by.id(id))).toBeVisible();
    return true;
  } catch (e) {
    return false;
  }
};

const loginFlow = (loginInputData) => {
  it('login', async () => {
    await element(by.id('login-lable')).tap();
    await element(by.id('email-input')).clearText();

    await element(by.id('email-input')).typeText(loginInputData.email);
    await element(by.id('password-input')).clearText();

    await element(by.id('password-input')).typeText(loginInputData.password);
    await element(by.id('login-button')).tap();
    await expect(element(by.id('local-home-screen'))).not.toExist();
  });
  it('local home screen appear', async () => {
    await waitFor(element(by.id('local-home-screen')))
      .toExist()
      .withTimeout(5000);
  });
};

module.exports = {
  expectToBeVisibleById,
  expectToBeVisibleByLabel,
  expectToBeVisibleScreen,
  loginFlow,
};
