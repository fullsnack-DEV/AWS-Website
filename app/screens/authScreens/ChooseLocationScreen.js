/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-native/split-platform-components */
/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';

import {useNavigationState} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import bodybuilder from 'bodybuilder';
import {
  searchLocations,
  getLocationNameWithLatLong,
  getLatLongFromPlaceID,
  searchNearByCity,
  searchCityState,
  searchLocationPlaceDetail,
} from '../../api/External';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import Separator from '../../components/Separator';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import {updateUserProfile, getAppSettingsWithoutAuth} from '../../api/Users';
import * as Utility from '../../utils';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {getGroupIndex} from '../../api/elasticSearch';

export default function ChooseLocationScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [cityData, setCityData] = useState([]);
  const [nearbyCities, setNearbyCities] = useState([]);

  const [currentLocation, setCurrentLocation] = useState(
    route.params?.signupInfo?.location,
  );
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 20,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (searchText.length >= 3) {
      searchCityState(searchText)
        .then((response) => {
          setNoData(false);
          setCityData(
            response.predictions.filter((obj) => obj.terms.length === 3),
          );
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    } else {
      setNoData(true);
      setCityData([]);
    }
  }, [searchText]);

  useEffect(() => {
    // TODO: why not using nearby cities sent from previous screen
    if (
      currentLocation?.position?.coords?.latitude &&
      currentLocation?.position?.coords?.longitude
    ) {
      getNearbyCityData(
        currentLocation.position.coords.latitude,
        currentLocation.position.coords.longitude,
        100,
      );
    }
  }, []);

  const getNearbyCityData = (lat, long, radius) => {
    // TODO: move this to api common file
    axios({
      method: 'get',
      url: `http://getnearbycities.geobytes.com/GetNearbyCities?radius=${radius}&latitude=${lat}&longitude=${long}&limit=500`,
    })
      .then((response) => {
        const cityList = response.data.map((obj) => ({
          description: obj[1],
          city: obj[1],
          state_abbr: obj[2],
          country: obj[3],
        }));
        const list = cityList.filter(
          (obj) => obj?.city !== currentLocation?.city,
        );
        setNearbyCities(
          cityList.filter((obj) => obj?.city !== currentLocation?.city),
        );
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  useEffect(() => {
    getAppSettingsWithoutAuth()
      .then(async (response) => {
        await Utility.setStorage('appSetting', response.payload.app);
      })
      .catch((e) => {
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, []);

  const getTeamsDataByCurrentLocation = async () => {
    setLoading(true);
    const userData = {
      city: currentLocation?.city,
      state_abbr: currentLocation?.stateAbbr,
      country: currentLocation?.country,
    };

    navigateToChooseSportScreen(userData);
  };

  const navigateToChooseSportScreen = (params) => {
    setLoading(false);
    navigation.navigate('ChooseSportsScreen', {
      locationInfo: {
        ...route?.params?.signupInfo,
        ...params,
      },
    });
  };

  const getTeamsData = async (item) => {
    setLoading(true);

    let userData = {};

    userData = {
      ...userData,
      city: item?.city ?? item?.terms?.[0]?.value,
      state_abbr: item?.state_abbr ?? item?.terms?.[1]?.value,
      country: item?.country ?? item?.terms?.[2]?.value,
    };
    navigateToChooseSportScreen(userData);
  };

  const renderItem = ({item, index}) => {
    console.log('Render city item:=>', item);
    return (
      <TouchableWithoutFeedback
        style={styles.listItem}
        onPress={() => getTeamsData(item)}>
        <Text style={styles.cityList}>{cityData[index].description}</Text>
        <Separator />
      </TouchableWithoutFeedback>
    );
  };

  const removeExtendedSpecialCharacters = (str) =>
    str.replace(/[^\x20-\x7E]/g, '');
  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <FastImage
        resizeMode={'stretch'}
        style={styles.background}
        source={images.loginBg}
      />
      <Text style={styles.LocationText}>{strings.locationText}</Text>
      <Text style={styles.LocationDescription}>
        {strings.locationDescription}
      </Text>

      <View style={styles.sectionStyle}>
        <Image source={images.searchLocation} style={styles.searchImg} />
        <TextInput
          // Indiër - For Test
          testID="location-search-input"
          value={searchText}
          autoCorrect={false}
          spellCheck={false}
          style={styles.textInput}
          placeholder={strings.locationPlaceholderText}
          clearButtonMode="always"
          placeholderTextColor={colors.themeColor}
          onChangeText={(text) =>
            setSearchText(removeExtendedSpecialCharacters(text))
          }
        />
      </View>
      {noData && searchText?.length > 0 && (
        <Text style={styles.noDataText}>{strings.enter3CharText}</Text>
      )}
      {noData && searchText?.length === 0 && nearbyCities?.length > 0 && (
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            data={nearbyCities}
            renderItem={({item}) => (
              <TouchableWithoutFeedback
                style={styles.listItem}
                onPress={() => getTeamsData(item)}>
                <Text style={styles.cityList}>
                  {item?.city}, {item?.state_abbr}, {item?.country}
                </Text>
                <Separator />
              </TouchableWithoutFeedback>
            )}
            ListHeaderComponent={() => (
              <TouchableWithoutFeedback
                style={styles.listItem}
                onPress={() => getTeamsDataByCurrentLocation()}>
                <View>
                  <Text style={[styles.cityList, {marginBottom: 3}]}>
                    {currentLocation?.city}, {currentLocation?.stateAbbr},{' '}
                    {currentLocation?.country}
                  </Text>
                  <Text style={styles.curruentLocationText}>
                    {strings.currentLocationText}
                  </Text>
                </View>
                <Separator />
              </TouchableWithoutFeedback>
            )}
            keyExtractor={(index) => index.toString()}
          />
        </SafeAreaView>
      )}
      {cityData.length > 0 && (
        <FlatList
          data={cityData}
          renderItem={renderItem}
          keyExtractor={(item) => item.place_id}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  LocationText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
  },
  LocationDescription: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
    paddingLeft: 30,
    paddingRight: 30,
    textAlign: 'left',
  },
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  cityList: {
    color: colors.whiteColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RMedium,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },
  curruentLocationText: {
    color: colors.whiteColor,
    fontSize: wp('3%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    marginTop: wp('0%'),
    textAlignVertical: 'center',
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  noDataText: {
    // alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 40,
    marginTop: 8,

    // marginTop: hp('1%'),
    // textAlign: 'center',
    // width: wp('55%'),
  },
  searchImg: {
    alignSelf: 'center',
    height: hp('4%'),

    resizeMode: 'contain',
    width: wp('4%'),
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    margin: wp('8%'),
    marginBottom: wp('1%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  textInput: {
    color: colors.darkYellowColor,
    flex: 1,
    fontFamily: fonts.RBold,
    fontSize: 16,
    paddingLeft: 10,
  },
});
