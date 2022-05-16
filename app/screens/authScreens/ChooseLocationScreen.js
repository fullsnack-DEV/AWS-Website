/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-native/split-platform-components */
/* eslint-disable no-nested-ternary */
import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';
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
} from 'react-native';
import {useNavigationState} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import bodybuilder from 'bodybuilder';
import {
  searchLocations,
  getLocationNameWithLatLong,
  getLatLongFromPlaceID,
} from '../../api/External'; // getLatLongFromPlaceID
import images from '../../Constants/ImagePath';
import strings from '../../Constants/String';
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
  const [currentLocation, setCurrentLocation] = useState();
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState(authContext?.entity?.obj?.city);
  const [loading, setLoading] = useState(false);
  const routes = useNavigationState((state) => state);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            const routeObj = routes?.routes?.[routes?.index] ?? {};
            const routeName =
              routeObj?.state?.routes?.[routeObj?.state?.index]?.name;
            if (routeName === 'ChooseGenderScreen') {
              navigation.pop(1);
            } else {
              navigation.navigate('ChooseGenderScreen');
            }
          }}>
          <Image
            source={images.backArrow}
            style={{
              height: 20,
              width: 15,
              marginLeft: 15,
              tintColor: colors.whiteColor,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  useEffect(() => {
    getLocationData(searchText);
  }, [searchText]);
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermission();
    } else {
      getLocation();
    }
  }, []);

  useEffect(() => {
    console.log('Settings useEffect clled:=>');

    getAppSettingsWithoutAuth()
      .then(async (response) => {
        console.log('Settings:=>', response);
        await Utility.setStorage('appSetting', response.payload.app);
      })
      .catch((e) => {
        setTimeout(() => {
          console.log('catch -> location screen setting api');
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, []);

  const requestPermission = async () => {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
      .then((result) => {
        console.log('Data :::::', JSON.stringify(result));
        if (
          result['android.permission.ACCESS_COARSE_LOCATION'] &&
          result['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
        ) {
          getLocation();
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Lat/long to position::=>', position);
        // const position = { coords: { latitude: 49.11637199697782, longitude: -122.7776695216056 } }
        getLocationNameWithLatLong(
          position.coords.latitude,
          position.coords.longitude,
          authContext,
        ).then((res) => {
          console.log(
            'Lat/long to address::=>',
            res.results[0].address_components,
          );
          let stateAbbr, city, country;
          res.results[0].address_components.map((e) => {
            if (e.types.includes('administrative_area_level_1')) {
              stateAbbr = e.short_name;
            } else if (e.types.includes('locality')) {
              city = e.short_name;
            } else if (e.types.includes('country')) {
              country = e.long_name;
            }
          });
          setCurrentLocation({stateAbbr, city, country});
        });
        console.log(position.coords.latitude);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getLocationData = async (searchLocationText) => {
    if (searchLocationText.length >= 3) {
      searchLocations(searchLocationText)
        .then((response) => {
          console.log('Response ---8888', response);
          setNoData(false);
          setCityData(response.predictions);
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
  };

  const getTeamsDataByCurrentLocation = async () => {
    setLoading(true);
    console.log('Curruent location data:=>', currentLocation);
    const userData = {
      city: currentLocation.city,
      state_abbr: currentLocation.stateAbbr,
      country: currentLocation.country,
    };
    // updateProfile(userData, () => {
    //   navigation.navigate('ChooseSportsScreen', {
    //     city: currentLocation?.city,
    //     state: currentLocation?.stateAbbr,
    //     country: currentLocation?.country,
    //   });
    // });
    navigateToChooseSportScreen(userData);
  };
  /*
  const updateProfile = async (params, callback) => {
    setLoading(true);
    updateUserProfile(params, authContext)
      .then(async (userResoponse) => {
        const userData = userResoponse?.payload;
        const entity = {...authContext?.entity};
        entity.auth.user = userData;
        entity.obj = userData;
        await Utility.setStorage('loggedInEntity', {...entity});
        await Utility.setStorage('authContextEntity', {...entity});
        await Utility.setStorage('authContextUser', {...userData});
        await authContext.setUser({...userData});
        await authContext.setEntity({...entity});
        setLoading(false);
        callback();
      })
      .catch(() => setLoading(false));
  };
*/
  const navigateToChooseSportScreen = (params) => {
    setLoading(false);
    console.log('route=====>', route);
    console.log('params ====>', params);
    console.log('city===>', params.city);
    console.log('country===>', params.country);
    console.log('state==>', params.state_abbr);
    console.log('profilePicData===>', route.params.profilePicData);
    console.log('birthday===>', route.params.birthday);
    console.log('gender=====>', route.params.gender);

    navigation.navigate('ChooseSportsScreen', {
      city: params.city,
      state: params.state_abbr,
      country: params.country,
      profilePicData: route.params.profilePicData,
      birthday: route.params.birthday,
      gender: route.params.gender,
      emailAddress: route.params.emailAddress,
      first_name: route.params.first_name,
      last_name: route.params.last_name,
    });
  };

  const getTeamsData = async (item) => {
    console.log('item location data:=>', item);
    setLoading(true);
    const userData = {
      city: item?.terms?.[0]?.value,
      state_abbr: item?.terms?.[1]?.value,
      country: item?.terms?.[2]?.value,
    };
    // updateProfile(userData, () => {
    //   setLoading(false);
    //   navigation.navigate('ChooseSportsScreen', {
    //     city: item?.terms?.[0]?.value,
    //     state: item?.terms?.[1]?.value,
    //     country: item?.terms?.[2]?.value,
    //   });

    // });

    navigateToChooseSportScreen(userData);
  };

  const renderItem = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => getTeamsData(item)}>
      <Text style={styles.cityList}>{cityData[index].description}</Text>

      <Separator />
    </TouchableWithoutFeedback>
  );

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

      <View style={styles.sectionStyle}>
        <Image source={images.searchLocation} style={styles.searchImg} />
        <TextInput
          // Indiër - For Test
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
      {noData && (
        <Text style={styles.noDataText}>
          Please, enter at least 3 characters to see cities.
        </Text>
      )}
      {currentLocation && (
        <TouchableWithoutFeedback
          style={styles.listItem}
          onPress={() => getTeamsDataByCurrentLocation()}>
          <View>
            <Text style={[styles.cityList, {marginBottom: 3}]}>
              {currentLocation.city}, {currentLocation.stateAbbr},{' '}
              {currentLocation.country}
            </Text>
            <Text style={styles.curruentLocationText}>Current Location</Text>
          </View>

          <Separator />
        </TouchableWithoutFeedback>
      )}
      <FlatList
        data={cityData}
        renderItem={renderItem}
        keyExtractor={(index) => index.toString()}
      />
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
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  cityList: {
    color: colors.whiteColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

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
