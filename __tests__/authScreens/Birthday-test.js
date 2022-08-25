/* eslint-disable no-undef */
import React from 'react';
import {render} from '@testing-library/react-native';
import AddBirthdayScreen from '../../app/screens/authScreens/AddBirthdayScreen';

jest.mock('react-native-fs', () => ({}));

describe('Birthday Screen Test', () => {
  const navigate = jest.fn();
  const setOptions = jest.fn();
  const goBack = jest.fn();

  it('should match the snapshot- AddBirthdayScreen screen', () => {
    const rendered = render(
      <AddBirthdayScreen navigation={{goBack, navigate, setOptions}} />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
