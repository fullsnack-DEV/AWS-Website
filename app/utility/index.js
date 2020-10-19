import {
  Platform, Alert, Dimensions, PixelRatio,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;

export const getPageLimit = () => 10;

export const isFieldEmpty = (text) => {
  console.log('text', text);
  if (text === '') {
    return true;
  }
  return false;
};
export const passwordPattern = (password) => {
  const reg = /.*[0-9]+.*/i;
  if (reg.test(password) === true) {
    return true;
  }
  return false;
};

export const isValidEmail = (email) => {
  // var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(email) !== true) {
    return true;
  }
  return false;
};

export const isValidOtp = (otp) => {
  if (otp.length < 4) {
    return false;
  }
  return true;
};

export const isValidPhoneNumber = (phone) => {
  if (phone.length > 8) {
    return false;
  }
  return true;
};

export const isValidComparedPassword = (newpassword, confirmPassword) => {
  if (newpassword !== confirmPassword) {
    return true;
  }
  return false;
};
export const getOS = () => {
  if (Platform.OS === 'ios') {
    return 'ios';
  }
  return 'android';
};

export const showAlert = (message) => {
  Alert.alert(
    titles.APP_NAME,
    message,
    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
    { cancelable: false },
  );
};

export const showAlertWithCallBack = (msg, onOkClick) => {
  Alert.alert(
    '',
    msg,
    [
      {
        text: 'OK',
        onPress: () => {
          console.log(' CLICK CALLED ');
          onOkClick();
        },
      },
    ],
    {
      cancelable: false,
    },
  );
};

export const removeAuthKey = async () => {

};
// New Utility Method for set any kind of value
export const setStorage = async (key, value) => {
  const valueString = typeof value === 'object' ? JSON.stringify(value) : value.toString()
  console.log('valueString', valueString)
  await AsyncStorage.setItem(key, valueString);
  console.log('valueString', valueString)
};

export const getStorage = async (key) => {
  let value = await AsyncStorage.getItem(key);
  try {
    value = JSON.parse(value)
    return value
  } catch (e) {
    // Do nothing. Its null or or plain string
  }
  return value
};

export const widthPercentageToDP = (widthPercent) => {
  const screenWidth = Dimensions.get('window').width;
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
export const heightPercentageToDP = (heightPercent) => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
export const AuthToken = async (key) => {
  try {
    const token = await AsyncStorage.getItem(key);
    return token ? JSON.parse(token) : null;
  } catch (err) {
    console.log('authToken Error', err);
  }
};
