import {
  Platform, Alert, Dimensions, PixelRatio, LayoutAnimation,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import strings from '../Constants/String'
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';

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

export const eventDefaultColor = [
'#FF3B00',
'#FF7F00',
'#FFAE01',
'#00C168',
'#0093FF']

export const createdEventData = [
  {
    id: 0,
    color: colors.redColorCard,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.orangeColorCard,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.yellowColorCard,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.greenColorCard,
    isSelected: false,
  },
  {
    id: 4,
    color: colors.blueColorCard,
    isSelected: false,
  },
  {
    id: 5,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 6,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 7,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 8,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 9,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 10,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },

];
export const importedEventData = [
  {
    id: 0,
    color: colors.redColorCard,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.orangeColorCard,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.yellowColorCard,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.greenColorCard,
    isSelected: false,
  },
  {
    id: 4,
    color: colors.blueColorCard,
    isSelected: false,
  },
  {
    id: 5,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 6,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 7,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 8,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 9,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 10,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },

];
export const gamesEventData = [
  {
    id: 0,
    color: colors.redColorCard,
    isSelected: true,
  },
  {
    id: 1,
    color: colors.orangeColorCard,
    isSelected: false,
  },
  {
    id: 2,
    color: colors.yellowColorCard,
    isSelected: false,
  },
  {
    id: 3,
    color: colors.greenColorCard,
    isSelected: false,
  },
  {
    id: 4,
    color: colors.blueColorCard,
    isSelected: false,
  },
  {
    id: 5,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 6,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 7,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 8,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 9,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },
  {
    id: 10,
    color: colors.darkBlueColorCard,
    isSelected: false,
  },

];
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

export const getRegionFromMarkers = (markers, delta = 0.025, offset = 2.5) => {
  let minLat = 0, maxLat = 0, minLng = 0, maxLng = 0;
  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    if (i === 0) {
      minLat = marker.latitude;
      maxLat = marker.latitude;
      minLng = marker.longitude;
      maxLng = marker.longitude;
    } else {
      if (marker.latitude <= minLat) minLat = marker.latitude;
      if (marker.latitude >= maxLat) maxLat = marker.latitude;
      if (marker.longitude <= minLng) minLng = marker.longitude;
      if (marker.longitude >= maxLng) maxLng = marker.longitude;
    }
  }
  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  const latDelta = (Math.abs(minLat - maxLat) || delta) * offset;
  const lngDelta = (Math.abs(minLng - maxLng) || delta) * offset;
  return {
    latitude, longitude, latitudeDelta: latDelta, longitudeDelta: lngDelta,
  };
}

export const escapeRegExp = (str) => {
  if (!_.isString(str)) {
    return '';
  }
  return str.replace(/[-[\]\\/{}()*+?.^$|]/g, '\\$&');
};

export const getSearchData = (data = [], field = [], searchString) => {
  const searchData = [];
  const searchStr = escapeRegExp(searchString).replace(' ', '')
  if (searchStr !== '') {
    data.map((item) => {
      let isSearch = false;
      field.map((key) => {
        if (!isSearch
            && item?.[key]
              ?.toLowerCase()
              ?.toString()
              ?.replace(' ', '')
              ?.match(searchStr?.toLowerCase()?.toString())) {
          isSearch = true;
        }
        return true;
      })
      if (isSearch) searchData.push(item);
      return true;
    })
  }
  return searchData;
}

export const round = (value, decimals) => value.toFixed(decimals)

export const getHitSlop = (slopValue) => {
  let hitSlop = {
 top: 0, bottom: 0, right: 0, left: 0,
}
  if (['string', 'number']?.includes(typeof slopValue)) {
 hitSlop = {
 top: slopValue, bottom: slopValue, right: slopValue, left: slopValue,
}
} else if (typeof slopValue === 'object') hitSlop = { ...hitSlop, ...slopValue };
  return hitSlop;
}

export const validURL = (str) => {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
      + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
      + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
      + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

export const stringContainValidURL = (str) => new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(str)
