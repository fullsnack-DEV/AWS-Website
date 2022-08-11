/* eslint-disable no-undef */
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import axios from 'axios';

import LoginScreen from '../../app/screens/authScreens/LoginScreen';
import TCTextField from '../../app/components/TCTextField';
import TCButton from '../../app/components/TCButton';

const email = 'test@example.com';
const password = '123456';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Login  Screen Test ', () => {
  jest.mock('axios');
  axios.get = jest.fn();
  const navigate = jest.fn();
  const setOptions = jest.fn();
  const goBack = jest.fn();

  it('should match the snapshot', () => {
    const rendered = render(
      <LoginScreen
        navigation={{goBack, navigate, setOptions}}
        testID={'password-input'}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('email not blank ', () => {
    const {getByTestId} = render(
      <TCTextField testID="email-input" value={email} />,
    );
    const wrapperComponent = getByTestId('email-input');
    expect(wrapperComponent.props.value).not.toBe('');
  });

  //   test('password not blank ', () => {
  //     const {getByTestId} = render(
  //       <LoginScreen navigation={{goBack, navigate, setOptions}} />,
  //     );
  //     const input = getByTestId('password-input');
  //     expect(input.props.value).not.toBe('');
  //   });

  it('Login mock api call', async () => {
    const handleClick = jest.fn();
    const {getByTestId} = render(
      <TCButton testID="login-button" onPress={handleClick} />,
    );
    const loginButton = getByTestId('login-button');
    fireEvent.press(loginButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
    axios.get
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: {
            email,
            password,
          },
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 400,
          data: null,
        }),
      );
  });
});
