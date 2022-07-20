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
import strings from '../../Constants/String';
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
      const uniqueObjArray = [
        ...new Map(nearCity.map((item) => [item.description, item])).values(),
      ];
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
      searchNearByCity(
        latLong.coords.latitude,
        latLong.coords.longitude,
        2000000,
        authContext,
      )
        .then((response) => {
          const places = []; // This Array WIll contain locations received from google
          const cities = [];
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
          }
          setNearCity(cities);
          setLoading(false);

          navigateToChooseLocationScreen(gender);
        })
        .catch((e) => {
          navigateToChooseLocationScreen(gender);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    },
    [authContext, navigateToChooseLocationScreen, nearCity],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        enableNext ? (
          <Text
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
              marginLeft: wp('5.33%'),
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
        setlatLong(position);
        getLocationNameWithLatLong(
          position?.coords?.latitude,
          position?.coords?.longitude,
          authContext,
        ).then((res) => {
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
          setCurrentLocation({stateAbbr, city, country});
          setLoading(false);
          setEnableNext(true);
        });
        setLoading(false);
      },
      (error) => {
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
          containerStyle={{
            left: 25,
          }}
          popover={
            <View style={{flex: 1, padding: 10}}>
              <Text
                style={{
                  color: colors.themeColor,
                  fontSize: 14,
                  fontFamily: fonts.RRegular,
                }}>
                {strings.genderText}
              </Text>
            </View>
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

        <View
          style={{
            marginTop: hp('6.77%'),
            marginLeft: wp('9.3%'),
            marginRight: wp('9.3%'),
          }}>
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

  mainContainer: {
    flex: 1,
    paddingTop: 25,
  },
  radioButtonView: {
    flexDirection: 'row',
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
    marginLeft: wp('6.6%'),
    marginRight: 20,
    marginTop: 5,
    textAlign: 'left',
  },
  whyAskingText: {
    color: colors.parrotColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginLeft: wp('6.6%'),
    marginRight: 20,
    marginTop: hp('1.84%'),
    textAlign: 'left',
  },

  canNotChangeGender: {
    color: colors.parrotColor,
    fontFamily: fonts.RMedium,
    fontSize: 14,
    marginRight: wp('9.33%'),
    marginLeft: wp('9.33%'),
    textAlign: 'left',
  },
  nextButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: wp('4%'),
    color: colors.whiteColor,
  },
  checkEmailText: {
    color: colors.whiteColor,
    fontFamily: fonts.RBold,
    fontSize: 25,
    marginLeft: wp('6.6%'),
    marginTop: hp('11.39%'),
    textAlign: 'left',
  },
});
