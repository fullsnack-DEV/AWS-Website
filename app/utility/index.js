import {Platform, Alert} from 'react-native';
import {Dimensions, PixelRatio} from 'react-native';
export var deviceHeight = Dimensions.get('window').height;
export var deviceWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-community/async-storage';

export const getPageLimit = () => {
  return 10;
};

export const isFieldEmpty = (text) => {
  console.log('text', text);
  if (text == '') {
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
  var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(email) != true) {
    return true;
  }
  return false;
};

export let isValidOtp = (otp) => {
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
  if (newpassword != confirmPassword) {
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
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    {cancelable: false},
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

export const setInLocalStorge = async (key, token) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(token));
    console.log('setInLocalStorge');
  } catch (err) {
    console.log('setInLocalStorge Error', err);
  }
  console.log('setInLocalStorge Done.');
};

export const getFromLocalStorge = async (key) => {
  try {
    const token = await AsyncStorage.getItem(key);
    return token ? JSON.parse(token) : null;
    // console.log("console chal nahi",);
  } catch (err) {
    console.log('getFromLocalStorge Error', err);
  }
};

export const removeAuthKey = async (key) => {
  try {
    let res = await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log('removeToken Error', err);
  }
};
// New Utility Method for set any kind of value
export const setStorage = async (key, value) => {
  if (typeof value === 'Object') {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log('setObjectInLocalStorge Error', err);
    }
  } else {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.log('setInLocalStorge Error', err);
    }
  }
  console.log('setObjectInLocalStorge Done.');
};

//New Utility Method for get any kind of value
export const getStorage = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
    // console.log("console chal nahi",);
  } catch (err) {
    console.log('getFromLocalStorge Error', err);
  }
  if (typeof jsonValue === 'Object') {
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } else {
    return jsonValue;
  }
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
