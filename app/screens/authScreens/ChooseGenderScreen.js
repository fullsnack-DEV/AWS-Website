import React, {
  useContext,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  // eslint-disable-next-line react-native/split-platform-components
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';

import {Tooltip} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {getLocationNameWithLatLong, searchNearByCity} from '../../api/External';

export default function ChooseGenderScreen({navigation, route}) {
  const [currentLocation, setCurrentLocation] = useState();
  const [latLong, setlatLong] = useState();
  const [nearCity, setNearCity] = useState([]);
  const [enableNext, setEnableNext] = useState(false);

  const authContext = useContext(AuthContext);
  console.log('authContextauthContext', authContext);
  const [selected, setSelected] = useState(
    authContext?.entity?.obj?.gender
      ? (authContext?.entity?.obj?.gender === 'male' && 0) ||
          (authContext?.entity?.obj?.gender === 'female' && 1) ||
          (authContext?.entity?.obj?.gender === 'other' && 2)
      : 0,
  );
  const [loading, setLoading] = useState(false);
  const navigateToChooseLocationScreen = useCallback(
    (genderParam) => {
      setLoading(false);
      console.log('basicInfo=====>', route?.params?.signupInfo);
      const uniqueObjArray = [
        ...new Map(nearCity.map((item) => [item.description, item])).values(),
      ];
      console.log('uniqueObjArray===>', uniqueObjArray);
      setTimeout(() => {
        navigation.navigate('ChooseLocationScreen', {
          signupInfo: {
            ...route?.params?.signupInfo,
            gender: genderParam,
            location: currentLocation,
            locationPosition: latLong,
            nearCity: [...uniqueObjArray],
          },
        });
      }, 100);
    },
    [currentLocation, latLong, navigation, nearCity, route?.params?.signupInfo],
  );
  const fetchNearestCity = useCallback(
    (gender) => {
      console.log('Latlong', latLong.coords);
      searchNearByCity(
        latLong.coords.latitude,
        latLong.coords.longitude,
        2000000,
        authContext,
      )
        .then((response) => {
          const places = []; // This Array WIll contain locations received from google
          const cities = [];
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
              // eslint-disable-next-line array-callback-return
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
              const data = {};
              const desc = `${city},${stateAbbr},${country}`.toString();
              data.description = desc;
              cities.push(data);
            });
            place.placeTypes = googlePlace.types;
            place.coordinate = coordinate;
            place.placeId = googlePlace.place_id;
            place.placeName = googlePlace.name;
            places.push(place);
            console.log('places--->', places);

            // const position = { coords: { latitude: 49.11637199697782, longitude: -122.7776695216056 } }
          }
          setNearCity(cities);
          setLoading(false);

          console.log('nearCity--->', nearCity);
          // navigation.navigate('ChooseLocationScreen', {
          //   signupInfo: {
          //     ...route?.params?.signupInfo,
          //     gender,
          //     location: currentLocation,
          //     locationPosition: latLong,
          //     nearCity,
          //   },
          // });
          navigateToChooseLocationScreen(gender);
        })
        .catch((e) => {
          console.log('cathh ---error', e);
          navigateToChooseLocationScreen(gender);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [authContext, navigateToChooseLocationScreen, nearCity],
  );

  useLayoutEffect(() => {
    console.log('000000', nearCity);
    navigation.setOptions({
      headerRight: () =>
        enableNext ? (
          <Text
            testID={'next-signupGender-button'}
            style={styles.nextButtonStyle}
            onPress={async () => {
              let gender = {};
              if (selected === 0) gender = 'male';
              else if (selected === 1) gender = 'female';
              else if (selected === 2) gender = 'other';

              check(
                PERMISSIONS.IOS.LOCATION_ALWAYS,
                PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
              )
                .then((result) => {
                  switch (result) {
                    case RESULTS.UNAVAILABLE:
                      console.log(
                        'This feature is not available (on this device / in this context)',
                      );
                      navigateToChooseLocationScreen(gender);
                      break;
                    case RESULTS.DENIED:
                      console.log(
                        'The permission has not been requested / is denied but requestable',
                      );
                      navigateToChooseLocationScreen(gender);
                      break;
                    case RESULTS.LIMITED:
                      console.log(
                        'The permission is limited: some actions are possible',
                      );
                      navigateToChooseLocationScreen(gender);
                      break;
                    case RESULTS.GRANTED:
                      console.log('The permission is granted');
                      setLoading(true);
                      fetchNearestCity(gender);

                      break;
                    case RESULTS.BLOCKED:
                      console.log(
                        'The permission is denied and not requestable anymore',
                      );
                      navigateToChooseLocationScreen(gender);
                      break;
                    default:
                      navigateToChooseLocationScreen(gender);
                  }
                })
                .catch((error) => {
                  console.log('error', error);
                  // …
                });
            }}>
            Next
          </Text>
        ) : (
          <View></View>
        ),
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
  }, [
    navigation,
    nearCity,
    selected,
    enableNext,
    navigateToChooseLocationScreen,
    fetchNearestCity,
  ]);
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermission();
    } else {
      console.log('111');
      request(
        PERMISSIONS.IOS.LOCATION_ALWAYS,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ).then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            setEnableNext(true);
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            setEnableNext(true);
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            setEnableNext(true);
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setLoading(true);
            getLocation();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            setEnableNext(true);
            break;
          default:
        }
      });
    }
  }, []);

  const getLocation = async () => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('Lat/long to position::=>', position);
        console.log('222');

        setlatLong(position);
        getLocationNameWithLatLong(
          position?.coords?.latitude,
          position?.coords?.longitude,
          authContext,
        ).then((res) => {
          console.log(
            'Lat/long to address::=>',
            res.results[0].address_components,
          );
          let stateAbbr, city, country;
          // eslint-disable-next-line array-callback-return
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
          setLoading(false);
          setEnableNext(true);
        });
        console.log('444');
        setLoading(false);
      },
      (error) => {
        console.log('555');
        setLoading(false);
        setEnableNext(true);
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
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
  const RenderRadio = ({isSelected, onRadioPress}) => (
    <View
      style={{
        flex: 0.1,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          borderColor: colors.whiteColor,
          height: 22,
          width: 22,
          borderWidth: 1,
          borderRadius: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={onRadioPress}>
        {isSelected && (
          <View
            style={{
              height: 13,
              width: 13,
              borderRadius: 50,
              backgroundColor: colors.whiteColor,
            }}></View>
        )}
      </TouchableOpacity>
    </View>
  );
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

  return (
    <LinearGradient
      colors={[colors.themeColor1, colors.themeColor3]}
      style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <View style={{flex: 1}}>
        <FastImage
          resizeMode={'stretch'}
          style={styles.background}
          source={images.loginBg}
        />
        <Text style={styles.checkEmailText}>{strings.addGenderText}</Text>
        <Text style={styles.resetText}>{strings.notDisplayGenderText}</Text>

        <Tooltip
          popover={
            <Text style={{color: colors.themeColor, fontSize: 14}}>
              {strings.genderText}
            </Text>
          }
          backgroundColor={colors.parrotColor}
          height={hp('22%')}
          width={wp('75%')}
          overlayColor={'transparent'}
          skipAndroidStatusBar={true}>
          <Text style={styles.whyAskingText}>
            {strings.whyAskingGenderText}
          </Text>
        </Tooltip>

        <View style={{marginTop: 40, marginLeft: 20}}>
          <View style={styles.radioButtonView}>
            <RenderRadio
              isSelected={selected === 0}
              onRadioPress={() => setSelected(0)}
            />
            <Text style={styles.radioText}>{strings.maleRadioText}</Text>
          </View>
          <View style={styles.radioButtonView}>
            <RenderRadio
              isSelected={selected === 1}
              onRadioPress={() => setSelected(1)}
            />
            <Text style={styles.radioText}>{strings.femaleRadioText}</Text>
          </View>
          <View style={styles.radioButtonView}>
            <RenderRadio
              isSelected={selected === 2}
              onRadioPress={() => setSelected(2)}
            />
            <Text style={styles.radioText}>{strings.otherRadioText}</Text>
          </View>
        </View>

        {/* <TCButton
        title={strings.continueCapTitle}
        onPress={async () => {
          let gender = {};
          if (selected === 0) gender = 'male';
          else if (selected === 1) gender = 'female';
          else if (selected === 2) gender = 'other';
          navigateToChooseLocationScreen(gender);
        }}
        extraStyle={{bottom: hp('4%'), position: 'absolute'}}
      /> */}
      </View>
      <SafeAreaView>
        <View
          style={{
            // flex: 1,
            // justifyContent: 'flex-end',
            // marginBottom: 100,
            bottom: 16,
          }}>
          <Text style={styles.canNotChangeGender}>
            {strings.canNotChangeGender}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  background: {
    height: hp('100%'),
    position: 'absolute',
    width: wp('100%'),
  },
  checkEmailText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginLeft: 20,
    marginTop: wp('25%'),
    textAlign: 'left',
  },
  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  radioButtonView: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 15,
    marginTop: 20,
  },
  radioText: {
    alignSelf: 'center',
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  resetText: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'left',
  },
  whyAskingText: {
    color: colors.parrotColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    textAlign: 'left',
  },
  canNotChangeGender: {
    color: colors.parrotColor,
    fontFamily: fonts.RRegular,
    fontSize: 14,
    marginLeft: 25,
    marginRight: 25,
    textAlign: 'left',
  },
  nextButtonStyle: {
    fontFamily: fonts.RBold,
    fontSize: 16,
    marginRight: 15,
    color: colors.whiteColor,
  },
});
