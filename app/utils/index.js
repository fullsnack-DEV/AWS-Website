import {
  Platform, Alert, Dimensions, PixelRatio, LayoutAnimation,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import strings from '../Constants/String'
import images from '../Constants/ImagePath';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;

export const getPageLimit = () => 10;

export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
  'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const groupMemberGenderItems = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'All', value: 'all' },
];

export const groupMembershipFeeTypes = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Biweekly', value: 'biweekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]

export const languages = [
  { language: 'English', id: 1 },
  { language: 'English(Canada)', id: 2 },
  { language: 'English(Singapore)', id: 3 },
  { language: 'English(UK)', id: 4 },
  { language: 'English(US)', id: 5 },
  { language: 'Deutsch', id: 6 },
  { language: 'Italiano', id: 7 },
  { language: 'Korean', id: 8 },
];

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

export const capitalize = (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()

export const isValidEmail = (email) => {
  // var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  // eslint-disable-next-line no-useless-escape
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
    strings.titleBasic,
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

export const removeAuthKey = async () => {};
// New Utility Method for set any kind of value
export const setStorage = async (key, value) => {
  console.log('storing in storage')
  const valueString = typeof value === 'object' ? JSON.stringify(value) : value.toString();
  await AsyncStorage.setItem(key, valueString);
};

export const getStorage = async (key) => {
  let value = await AsyncStorage.getItem(key);
  try {
    value = JSON.parse(value);
    return value;
  } catch (e) {
    // Do nothing. Its null or or plain string
  }
  return value;
};
export const clearStorage = async () => {
  const asyncStorageKeys = await AsyncStorage.getAllKeys();
  if (asyncStorageKeys.length > 0) {
    if (Platform.OS === 'android') {
      await AsyncStorage.clear();
    }
    if (Platform.OS === 'ios') {
      await AsyncStorage.multiRemove(asyncStorageKeys);
    }
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

const backgroundColors = [
  '#53c6a2',
  '#fdd762',
  '#9261d3',
  '#43dce7',
  '#ffcc5a',
  '#ea4398',
  '#4a5de1',
  '#e95555',
  '#7eda54',
  '#f9b647',
]

// eslint-disable-next-line no-bitwise
export const getRandomColor = () => backgroundColors[backgroundColors.length * Math.random() | 0]

export const STAR_COLOR = {
  YELLOW: 'YELLOW',
  GREEN: 'GREEN',
  BLUE: 'BLUE',
  WHITE: 'WHITE',
}

export const STAR_IMAGE = {
  YELLOW: images.yellowRatingStar,
  GREEN: images.greenRatingStar,
  BLUE: images.blueRatingStar,
  WHITE: images.blankRatingStar,
}

export const toggleView = (callbackMethod, duration = 2000) => {
  const CustomLayoutLinear = {
    duration,
    create: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
    delete: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  LayoutAnimation.configureNext(CustomLayoutLinear);
  // eslint-disable-next-line no-unused-expressions
  callbackMethod();
};
