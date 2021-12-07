/* eslint-disable space-before-blocks */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
import {} from 'react';
import {
  Platform,
  Alert,
  Dimensions,
  PixelRatio,
  LayoutAnimation,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import strings from '../Constants/String';
import images from '../Constants/ImagePath';
import colors from '../Constants/Colors';
// eslint-disable-next-line import/no-cycle
import {
  getCalendarIndex,
  getGroupIndex,
  getUserIndex,
} from '../api/elasticSearch';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;

export const getPageLimit = () => 10;

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const groupMemberGenderItems = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'All', value: 'all' },
];

export const languageList = [
  { language: 'English', id: 1 },
  // { language: 'English(Canada)', id: 2 },
  // { language: 'English(Singapore)', id: 3 },
  // { language: 'English(UK)', id: 4 },
  // { language: 'English(US)', id: 5 },
  { language: 'Deutsch', id: 2 },
  { language: 'Italiano', id: 3 },
  { language: 'Korean', id: 4 },
];

export const groupMembershipFeeTypes = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Biweekly', value: 'biweekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
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

export const capitalize = (word) => word[0].toUpperCase() + word.slice(1).toLowerCase();

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
  console.log('storing in storage');
  const valueString = typeof value === 'object' ? JSON.stringify(value) : value.toString();
  console.log('Storage key/Value', `${key} ${valueString}`);

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

export function logCurrentStorage() {
  AsyncStorage.getAllKeys().then((keyArray) => {
    AsyncStorage.multiGet(keyArray).then((keyValArray) => {
      const myStorage = {};
      for (const keyVal of keyValArray) {
        myStorage[keyVal[0]] = keyVal[1];
      }

      console.log('CURRENT STORAGE: ', myStorage);
    });
  });
}

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
];

export const eventDefaultColor = [
  '#FF3B00',
  '#FF7F00',
  '#FFAE01',
  '#00C168',
  '#0093FF',
];

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
    color: colors.lightYellowColorCard,
    isSelected: false,
  },
  {
    id: 4,
    color: colors.lightGreenColorCard,
    isSelected: false,
  },
  {
    id: 5,
    color: colors.greenColorCard,
    isSelected: false,
  },
  {
    id: 6,
    color: colors.skyColorCard,
    isSelected: false,
  },
  {
    id: 7,
    color: colors.lightBlueColorCard,
    isSelected: false,
  },
  {
    id: 8,
    color: colors.purpleColorCard,
    isSelected: false,
  },
  {
    id: 9,
    color: colors.googleColor,
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
    color: colors.lightYellowColorCard,
    isSelected: false,
  },
  {
    id: 4,
    color: colors.lightGreenColorCard,
    isSelected: false,
  },
  {
    id: 5,
    color: colors.greenColorCard,
    isSelected: false,
  },
  {
    id: 6,
    color: colors.skyColorCard,
    isSelected: false,
  },
  {
    id: 7,
    color: colors.lightBlueColorCard,
    isSelected: false,
  },
  {
    id: 8,
    color: colors.purpleColorCard,
    isSelected: false,
  },
  {
    id: 9,
    color: colors.googleColor,
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
    color: colors.lightYellowColorCard,
    isSelected: false,
  },
  {
    id: 4,
    color: colors.lightGreenColorCard,
    isSelected: false,
  },
  {
    id: 5,
    color: colors.greenColorCard,
    isSelected: false,
  },
  {
    id: 6,
    color: colors.skyColorCard,
    isSelected: false,
  },
  {
    id: 7,
    color: colors.lightBlueColorCard,
    isSelected: false,
  },
  {
    id: 8,
    color: colors.purpleColorCard,
    isSelected: false,
  },
  {
    id: 9,
    color: colors.googleColor,
    isSelected: false,
  },
];
// eslint-disable-next-line no-bitwise
export const getRandomColor = () => backgroundColors[(backgroundColors.length * Math.random()) | 0];

export const STAR_COLOR = {
  YELLOW: 'YELLOW',
  GREEN: 'GREEN',
  BLUE: 'BLUE',
  WHITE: 'WHITE',
};

export const STAR_IMAGE = {
  YELLOW: images.yellowRatingStar,
  GREEN: images.greenRatingStar,
  BLUE: images.blueRatingStar,
  WHITE: images.blankRatingStar,
};

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
  callbackMethod();
};

export const getRegionFromMarkers = (markers, delta = 0.025, offset = 2.5) => {
  let minLat = 0,
    maxLat = 0,
    minLng = 0,
    maxLng = 0;
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
    latitude,
    longitude,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
};

export const escapeRegExp = (str) => {
  if (!_.isString(str)) {
    return '';
  }
  return str.replace(/[-[\]\\/{}()*+?.^$|]/g, '\\$&');
};

export const getSearchData = (data = [], field = [], searchString) => {
  const searchData = [];
  const searchStr = escapeRegExp(searchString).replace(' ', '');
  if (searchStr !== '') {
    data?.map((item) => {
      let isSearch = false;
      field?.map((key) => {
        if (
          !isSearch
          && item?._source?.[key]
            ?.toLowerCase()
            ?.toString()
            ?.replace(' ', '')
            ?.match(searchStr?.toLowerCase()?.toString())
        ) {
          isSearch = true;
        }
        return true;
      });
      if (isSearch) searchData.push(item);
      return true;
    });
  }
  return searchData;
};

export const getSearchTags = (data = [], searchString) => data.filter(
    (x) => x.full_name?.toLowerCase().includes(searchString?.toLowerCase())
      || x.group_name?.toLowerCase().includes(searchString?.toLowerCase()),
  );

export const getSearchEntityData = (data = [], field = [], searchString) => {
  const searchData = [];
  const searchStr = escapeRegExp(searchString).replace(' ', '');
  if (searchStr !== '') {
    data?.map((item) => {
      let isSearch = false;
      field?.map((key) => {
        if (
          !isSearch
          && item?.[key]
            ?.toLowerCase()
            ?.toString()
            ?.replace(' ', '')
            ?.match(searchStr?.toLowerCase()?.toString())
        ) {
          isSearch = true;
        }
        return true;
      });
      if (isSearch) searchData.push(item);
      return true;
    });
  }
  return searchData;
};

export const round = (value, decimals) => value.toFixed(decimals);

export const getHitSlop = (slopValue) => {
  let hitSlop = {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  };
  if (['string', 'number']?.includes(typeof slopValue)) {
    hitSlop = {
      top: slopValue,
      bottom: slopValue,
      right: slopValue,
      left: slopValue,
    };
  } else if (typeof slopValue === 'object') {
    hitSlop = { ...hitSlop, ...slopValue };
  }
  return hitSlop;
};

export const validURL = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' // protocol
      + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
      + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
      + '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
};

export const getTaggedEntityData = (
  entity_raw_data,
  entity_item,
  entity_type,
) => {
  let entity = { ...entity_raw_data };
  if (entity_type === 'game') {
    const pickedEntity = _.pick(entity_item, [
      'sport',
      'status',
      'start_datetime',
      'end_datetime',
      'user_challenge',
      'userChallenge',
      'home_team.thumbnail',
      'home_team.group_name',
      'home_team.full_name',
      'away_team.thumbnail',
      'away_team.group_name',
      'away_team.full_name',
      'venue.address',
      'venue.description',
    ]);
    entity = { ...entity, ...pickedEntity };
  } else {
    const pickedEntity = _.pick(entity_item, [
      'group_name',
      'full_name',
      'city',
      'thumbnail',
    ]);
    entity = { ...entity, ...pickedEntity };
  }
  return entity;
};

export const getTaggedText = (format_tagged_data) => {
  const gameTagList = format_tagged_data?.filter(
    (item) => item?.entity_type === 'game',
  );
  const entityTagList = format_tagged_data?.filter(
    (item) => item?.entity_type !== 'game',
  );
  const entityTagsListLength = entityTagList?.length ?? 0;
  const gameTagsListLength = gameTagList?.length ?? 0;
  let matchText = '',
    entityText = '',
    betweenText = '',
    lastText = '',
    entityLengthText = '',
    matchLengthText = '';
  if (entityTagsListLength > 0) entityLengthText = `${entityTagsListLength} `;
  if (gameTagsListLength > 0) matchLengthText = `${gameTagsListLength} `;
  if (gameTagsListLength > 0) {
    matchText = gameTagsListLength > 1 ? 'matches ' : 'match ';
  }
  if (entityTagsListLength > 0) {
    entityText = entityTagsListLength > 1 ? 'people  ' : 'person ';
  }
  if (gameTagsListLength > 0 && entityTagsListLength > 0) betweenText = 'and ';
  if (entityTagsListLength + gameTagsListLength > 0) {
    lastText = entityTagsListLength + gameTagsListLength > 1
        ? 'were tagged'
        : 'was tagged';
  }
  return `${entityLengthText}${entityText}${betweenText}${matchLengthText}${matchText}${lastText}`;
};

export const getScreenWidth = ({
  isLandscape,
  screenInsets,
  avoidScreenInsets = null,
  portraitWidth = 100,
  landscapeWidth = portraitWidth,
}) => {
  let avoidInsets = avoidScreenInsets ?? false;
  if (avoidScreenInsets === null) {
    if (!isLandscape && portraitWidth !== 100) avoidInsets = true;
    else if (isLandscape && landscapeWidth !== 100) avoidInsets = true;
  }
  const avoidLength = !avoidInsets ? screenInsets.left + screenInsets.right : 0;
  return (isLandscape ? hp(landscapeWidth) : wp(portraitWidth)) - avoidLength;
};

export const getScreenHeight = ({
  isLandscape,
  screenInsets,
  avoidScreenInsets = null,
  portraitHeight = 100,
  landscapeHeight = portraitHeight,
}) => {
  let avoidInsets = avoidScreenInsets ?? false;
  if (avoidScreenInsets === null) {
    if (!isLandscape && portraitHeight !== 100) avoidInsets = true;
    else if (isLandscape && landscapeHeight !== 100) avoidInsets = true;
  }
  const avoidLength = !avoidInsets ? screenInsets.top + screenInsets.bottom : 0;
  return (isLandscape ? wp(landscapeHeight) : hp(portraitHeight)) - avoidLength;
};

export const stringContainValidURL = (str) => new RegExp(
    '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?',
  ).test(str);

export const getSportIcon = (sport) => {
  switch (sport) {
    case 'soccer':
      return images.soccerIcon;
    case 'tennis':
      return images.tennisIcon;
    default:
      return images.soccerIcon;
  }
};

export const roundValue = (value, decimals) => (value ? parseFloat(+value.toFixed(decimals)) : 0);

export const getFiltersOpetions = (opetions) => {
  const arr = [];
  Object.keys(opetions).forEach((key) => {
    const obj = {};
    obj[key] = opetions[key];
    arr.push(obj);
  });

  return arr;
};

export const getCalendar = async (
  participantId,
  fromDate,
  toDate,
  type,
  blocked,
) => {
  const body = {
    query: {
      bool: {
        must: [
          {
            term: {
              'participants.entity_id.keyword': participantId,
            },
          },
        ],
      },
    },
  };

  if (type) {
    body.query.bool.must.push({
      term: {
        'cal_type.keyword': type,
      },
    });
  }

  if (blocked === true || blocked === false) {
    body.query.bool.must.push({
      match: {
        blocked,
      },
    });
  }

  if (fromDate) {
    body.query.bool.must.push({ range: { end_datetime: { gt: fromDate } } });
  }
  if (toDate) {
    body.query.bool.must.push({ range: { start_datetime: { lt: toDate } } });
  }

  if (blocked === true || blocked === false) {
    body.query.bool.must.push({
      match: {
        blocked,
      },
    });
  }

  return getCalendarIndex(body).then((response) => {
    console.log('elastic search :=>', response);

    return response;
  });
};

export const getSportName = (object, authContext) => {
  if (object?.sport_type && object?.sport_type !== '') {
    let sportArr = [];
    authContext?.sports?.map((item) => {
      sportArr = [...sportArr, ...item.format];
      return null;
    });
    const filterFormat = sportArr?.filter(
      (item) => item?.sport_type === object?.sport_type
        && item?.sport === object?.sport,
    )[0];
    return filterFormat?.sport_name;
  }
  const filterFormat = authContext?.sports?.filter(
    (obj) => obj?.sport === object?.sport,
  )[0];

  return filterFormat?.sport_name;
};

export const getSportObjectByName = (sportName, authContext) => {
  let sportArr = [];
  authContext?.sports?.map((item) => {
    sportArr = [...sportArr, ...item.format];
    return null;
  });

  const filterObject = sportArr?.filter(
    (item) => item?.sport_name === sportName,
  )[0];
  return filterObject;
};

export const getSportImage = (sportName, type, authContext) => {
  if (type === 'player') {
    const tempObj = authContext.sports.filter(
      (obj) => obj.sport === sportName,
    )[0];
    return tempObj?.player_image;
  } else {
    let sportArr = [];
    authContext.sports.map((item) => {
      sportArr = [...sportArr, ...item.format];
      return null;
    });
    const filterFormat = sportArr?.filter((obj) => obj.sport === sportName)[0];
    if (type === 'referee') {
      return filterFormat?.referee_image;
    }
    if (type === 'scorekeeper') {
      return filterFormat?.scorekeeper_image;
    }
  }
};

export const getGamesList = async (games) => {
  const promiseArr = [];
  let userIDs = [];
  let groupIDs = [];

  games.map((game) => {
    if (game.user_challenge) {
      userIDs.push(game.home_team);
      userIDs.push(game.away_team);
    } else {
      groupIDs.push(game.home_team);
      groupIDs.push(game.away_team);
    }
  });

  userIDs = [...new Set(userIDs)];
  groupIDs = [...new Set(groupIDs)];

  if (userIDs.length > 0) {
    const userQuery = {
      query: {
        terms: {
          _id: userIDs,
        },
      },
    };
    promiseArr.push(getUserIndex(userQuery));
  }
  if (groupIDs.length > 0) {
    const groupQuery = {
      query: {
        terms: {
          _id: groupIDs,
        },
      },
    };
    promiseArr.push(getGroupIndex(groupQuery));
  }

  if (promiseArr.length > 0) {
    return Promise.all(promiseArr).then(([data1, data2]) => {
      let userData, groupData;
      if (userIDs.length > 0 && groupIDs.length > 0) {
        userData = data1;
        groupData = data2;
      } else if (userIDs.length > 0) {
        userData = data1;
      } else {
        groupData = data1;
      }

      if (userData) {
        const userGames = (games || []).filter((game) => game.user_challenge);
        for (const game of userGames) {
          let userObj = userData.find(
            (user) => user.user_id === game.home_team,
          );
          if (userObj) {
            game.home_team = userObj;
          }

          userObj = userData.find((user) => user.user_id === game.away_team);
          if (userObj) {
            game.away_team = userObj;
          }
        }
      }
      if (groupData) {
        const groupGames = (games || []).filter((game) => !game.user_challenge);
        for (const game of groupGames) {
          let groupObj = groupData.find(
            (group) => group.group_id === game.home_team,
          );
          if (groupObj) {
            game.home_team = groupObj;
          }

          groupObj = groupData.find(
            (group) => group.group_id === game.away_team,
          );
          if (groupObj) {
            game.away_team = groupObj;
          }
        }
      }
      return games;
    });
  }
};
