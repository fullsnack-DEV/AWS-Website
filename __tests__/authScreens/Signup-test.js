/* eslint-disable no-undef */
import React from 'react';
import {render} from '@testing-library/react-native';
import SignupScreen from '../../app/screens/authScreens/SignupScreen';

jest.mock('react-native-fs', () => ({}));

describe('Signup  Screen Test', () => {
  const navigate = jest.fn();
  const setOptions = jest.fn();
  const goBack = jest.fn();

  it('should match the snapshot- SignupScreen', () => {
    const rendered = render(
      <SignupScreen navigation={{goBack, navigate, setOptions}} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
