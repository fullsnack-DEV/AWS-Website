/* eslint-disable no-undef */
/* eslint-disable import/extensions */
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
jest.mock('@react-native-community/google-signin', () => {});
jest.mock('@invertase/react-native-apple-authentication', () => {});
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({children}) => children;
  return {KeyboardAwareScrollView};
});
jest.mock('./app/utils/QuickBlox.js', () => {});

jest.mock('./app/components/TCKeyboardView', () =>
  jest.genMockFromModule('./app/components/TCKeyboardView'),
);

jest.mock('quickblox-react-native-sdk', () => ({
  addListener: jest.fn(),
}));
