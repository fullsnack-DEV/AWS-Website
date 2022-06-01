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
  searchNearByCity,
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
  const [nearByCity, setNearByCity] = useState([]);

  const [currentLocation, setCurrentLocation] = useState(
    route?.params?.signupInfo?.location,
  );
  const [noData, setNoData] = useState(false);
  // const [searchText, setSearchText] = useState(authContext?.entity?.obj?.city);
  const [searchText, setSearchText] = useState('');

  const [loading, setLoading] = useState(false);
  const routes = useNavigationState((state) => state);

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
  }, [navigation, nearByCity, cityData]);
  const fetchNearestCity = useCallback(() => {
    // position.coords.latitude
    searchNearByCity(
      route?.params?.signupInfo?.locationPosition?.coords?.latitude,
      route?.params?.signupInfo?.locationPosition?.coords?.longitude,
      2000000,
      authContext,
    )
      .then((response) => {
        const places = []; // This Array WIll contain locations received from google
        const dataArray = [];
        console.log('Places=====>', response.results);
        for (const googlePlace of response.results) {
          const place = {};
          const lat = googlePlace.geometry.location.lat;
          const lng = googlePlace.geometry.location.lng;
          const coordinate = {
            latitude: lat,
            longitude: lng,
          };
          getLocationNameWithLatLong(
            coordinate.latitude,
            coordinate.longitude,
            authContext,
          ).then((res) => {
            console.log('res====>', res);
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
            // setCurrentLocation({stateAbbr, city, country});
            const desc = `${city},${stateAbbr},${country}`;
            const data = {description: desc};
            dataArray.push(data);

            console.log('desc===', desc);
            console.log('stateAbbr=====>', stateAbbr);
            console.log('city====>', city);
            console.log('country====>', country);
            console.log('desc=====>', desc);
            console.log('data=====>', data);
          });
          place.placeTypes = googlePlace.types;
          place.coordinate = coordinate;
          place.placeId = googlePlace.place_id;
          place.placeName = googlePlace.name;
          places.push(place);
          console.log('places--->', places);

          // const position = { coords: { latitude: 49.11637199697782, longitude: -122.7776695216056 } }
        }
        console.log('dataArray--->', dataArray);
        setNearByCity([...dataArray]);
      })
      .catch((e) => {
        console.log('cathh ---error', e);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  }, [
    authContext,
    route?.params?.signupInfo?.locationPosition?.coords?.latitude,
    route?.params?.signupInfo?.locationPosition?.coords?.longitude,
  ]);
  useEffect(() => {
    console.log('searchText', searchText);

    // getNearestCity();
    getLocationData(searchText);
    fetchNearestCity();
  }, [searchText]);
  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     requestPermission();
  //   } else {
  //     console.log('111');
  //     getLocation();
  //   }
  // }, []);

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
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Lat/long to position::=>', position);
        console.log('222');
        console.log('position.coords.latitude', position.coords.latitude);
        console.log('position.coords.longitude', position.coords.longitude);

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
          console.log('333');
          setCurrentLocation({stateAbbr, city, country});
        });
        console.log('444');
        console.log(position.coords.latitude);
      },
      (error) => {
        console.log('555');
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
      console.log('Response ---9999');

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
    console.log('genderInfo', route?.params?.signupInfo);

    navigation.navigate('ChooseSportsScreen', {
      locationInfo: {
        ...route?.params?.signupInfo,
        city: params.city,
        state: params.state_abbr,
        country: params.country,
      },
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
  const renderItemNearCity = ({item, index}) => {
    console.log('Near city1111 ==>', item.description);

    return (
      <TouchableWithoutFeedback
        style={styles.listItem}
        onPress={() => getTeamsData(item)}>
        <Text style={styles.cityList}>{item.description}</Text>

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
        <Text style={styles.noDataText}>
          Please, enter at least 3 characters to see cities.
        </Text>
      )}

      <View style={{backgroundColor: colors.redColor, flex: 1}}>
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
        <FlatList
          data={nearByCity}
          renderItem={renderItemNearCity}
          keyExtractor={(index) => index.toString()}
          style={{backgroundColor: colors.yellowColor, flex: 1}}
        />
      </View>

      {/* {cityData.length > 0 && (
        <FlatList
          data={cityData}
          renderItem={renderItem}
          keyExtractor={(index) => index.toString()}
          style={{backgroundColor: colors.grayColor}}
        />
      )} */}
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
  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 10,
    color: colors.whiteColor,
  },
});
