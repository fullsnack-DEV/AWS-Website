/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable react-native/split-platform-components */
/* eslint-disable no-nested-ternary */
import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  Platform,
  Linking,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

import {searchCityState, searchNearByCityState} from '../../api/External';

import {
  getPlaceNameFromPlaceID,
  getGeocoordinatesWithPlaceName,
} from '../../utils/location';

import images from '../../Constants/ImagePath';
import {strings} from '../../../Localization/translation';
import Separator from '../../components/Separator';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';

import {getAppSettingsWithoutAuth} from '../../api/Users';
import * as Utility from '../../utils';
import ActivityLoader from '../../components/loader/ActivityLoader';
import Verbs from '../../Constants/Verbs';
import locationModalStyles from '../../Constants/LocationModalStyle';
import AuthScreenHeader from './AuthScreenHeader';

const windowHeight = Dimensions.get('window').height;

export default function ChooseLocationScreen({navigation, route}) {
  const [cityData, setCityData] = useState([]);
  const [nearbyCities, setNearbyCities] = useState([]);

  const [currentLocation, setCurrentLocation] = useState();
  const [userDeniedLocPerm, setUserDeniedLocPerm] = useState(false);

  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const [locationFetch, setLocationFetch] = useState(false);

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
  }, [searchText]);

  const getNearbyCityData = (lat, long, radius) => {
    searchNearByCityState(radius, lat, long)
      .then((response) => {
        const list = response.filter(
          (obj) =>
            !(
              obj.city === currentLocation?.city &&
              obj.country === currentLocation?.country
            ),
        );
        setNearbyCities(list);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
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

  useEffect(() => {
    setLoading(true);
    setUserDeniedLocPerm(false);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((location) => {
        setLocationFetch(true);
        setLoading(false);
        if (location.position) {
          setLoading(false);
          setCurrentLocation(location);
          getNearbyCityData(
            location.position.coords.latitude,
            location.position.coords.longitude,
            100,
          );
        } else {
          setLoading(false);
          setCurrentLocation(null);
        }
      })
      .catch((e) => {
        setLoading(false);
        setLocationFetch(true);
        if (e.name === Verbs.gpsErrorDeined) {
          setCurrentLocation(null);
          setUserDeniedLocPerm(true);
        } else {
          setLoading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        }
      });
  }, []);

  const onSelectCurrentLocation = async () => {
    setLoading(true);

    const userData = {
      city: currentLocation?.city,
      state_abbr: currentLocation?.state,
      country: currentLocation?.country,
      state: currentLocation.state_full,
    };
    navigateToChooseSportScreen(userData);
  };

  const onSelectNoCurrentLocation = async () => {
    if (userDeniedLocPerm) {
      Alert.alert(
        strings.locationSettingTitleText,
        strings.locationSettingText,
        [
          {
            text: strings.cancel,
            style: 'cancel',
          },
          {
            text: strings.settingsTitleText,
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
    } else {
      Alert.alert(strings.noGpsErrorMsg, '', [
        {
          text: strings.OkText,
          style: 'cancel',
        },
      ]);
    }
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

  const onSelectLocation = async (item) => {
    setLoading(true);
    getPlaceNameFromPlaceID(item.place_id).then((location) => {
      setLoading(false);
      if (location) {
        let userData = {};
        userData = {
          city: location.city,
          state_abbr: location.state,
          country: location.country,
          state: location.state_full,
        };
        navigateToChooseSportScreen(userData);
      }
    });
  };

  const onSelectNearByLocation = async (item) => {
    let userData = {};
    userData = {
      city: item.city,
      state_abbr: item.state_abbr,
      country: item.country,
      state: item.state,
    };
    navigateToChooseSportScreen(userData);
  };

  const renderItem = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => onSelectLocation(item)}>
      <Text style={styles.cityList}>{cityData[index].description}</Text>
      <Separator />
    </TouchableWithoutFeedback>
  );

  const renderCurrentLocation = () => {
    let renderData;
    if (currentLocation && currentLocation.city) {
      renderData = (
        <TouchableWithoutFeedback
          style={styles.listItem}
          onPress={() => onSelectCurrentLocation()}>
          <View>
            <Text style={[styles.cityList, {marginBottom: 3}]}>
              {[
                currentLocation?.city,
                currentLocation?.state,
                currentLocation?.country,
              ]
                .filter((v) => v)
                .join(', ')}
            </Text>
            <Text style={styles.curruentLocationText}>
              {strings.currentLocationText}
            </Text>
          </View>
          <Separator />
        </TouchableWithoutFeedback>
      );
    } else {
      renderData = <View />;
    }
    return renderData;
  };

  const removeExtendedSpecialCharacters = (str) =>
    str.replace(/[^\x20-\x7E]/g, '');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.kHexColorFF8A01}}>
      <ActivityLoader visible={loading} />
      <FastImage style={styles.background} source={images.loginBg} />

      <AuthScreenHeader
        title={strings.locationText}
        onBackPress={() => navigation.pop()}
        onNextPress={() => {}}
        showNext={false}
      />

      <View style={styles.locationTextContainer}>
        <Text style={styles.LocationDescription}>
          {strings.locationDescription}
        </Text>
      </View>

      <View style={styles.sectionStyle}>
        <Image source={images.searchLocation} style={styles.searchImg} />
        <TextInput
          // Indiër - For Test
          testID="location-search-input"
          value={searchText}
          autoCorrect={false}
          spellCheck={false}
          style={styles.textInput}
          placeholder={strings.searchByCity}
          clearButtonMode="always"
          placeholderTextColor={colors.themeColor}
          onChangeText={(text) =>
            setSearchText(removeExtendedSpecialCharacters(text))
          }
        />
      </View>
      {searchText.length < 3 && (
        <Text style={locationModalStyles.noDataText}>
          {strings.threeCharToSeeAddress}
        </Text>
      )}
      {noData && searchText.length === 0 && nearbyCities.length > 0 && (
        <FlatList
          data={nearbyCities}
          style={{marginTop: -10}}
          renderItem={({item}) => (
            <TouchableWithoutFeedback
              style={styles.listItem}
              onPress={() => onSelectNearByLocation(item)}>
              <Text style={styles.cityList}>
                {[item.city, item.state_abbr, item.country]
                  .filter((v) => v)
                  .join(', ')}
              </Text>
              <Separator />
            </TouchableWithoutFeedback>
          )}
          ListHeaderComponent={renderCurrentLocation}
          keyExtractor={(index) => index.toString()}
        />
      )}
      {noData &&
        searchText.length === 0 &&
        locationFetch &&
        !currentLocation && (
          <TouchableWithoutFeedback
            style={styles.noLocationViewStyle}
            onPress={() => onSelectNoCurrentLocation()}>
            <View>
              <Text style={styles.currentLocationTextStyle}>
                {strings.currentLocationText}
              </Text>
              <Separator />
            </View>
            <Text style={[styles.currentLocationTextStyle, {marginTop: 15}]}>
              {strings.noLocationText}
            </Text>
          </TouchableWithoutFeedback>
        )}
      {cityData.length > 0 && (
        <FlatList
          data={cityData}
          renderItem={renderItem}
          keyExtractor={(item) => item.place_id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  LocationDescription: {
    color: colors.whiteColor,
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginTop: 5,
    marginLeft: 25,
    marginRight: 25,
    textAlign: 'left',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: windowHeight,
    resizeMode: 'cover',
  },
  cityList: {
    color: colors.whiteColor,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 10,
    textAlignVertical: 'center',
  },
  curruentLocationText: {
    color: colors.whiteColor,
    fontSize: 12,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    margin: 15,
    marginTop: 2,
    textAlignVertical: 'center',
  },
  listItem: {
    flexDirection: 'row',
    marginHorizontal: 30,
  },

  searchImg: {
    alignSelf: 'center',
    height: 13,
    resizeMode: 'contain',
    width: 13,
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 25,

    paddingLeft: 17,
    paddingRight: 5,
    marginTop: 25,
  },
  textInput: {
    color: colors.darkYellowColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 19,
  },
  noLocationViewStyle: {
    flexDirection: 'column',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  currentLocationTextStyle: {
    color: colors.whiteColor,
    fontSize: 14,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    textAlignVertical: 'center',
    marginBottom: 16,
    marginTop: 21,
  },
  locationTextContainer: {
    marginTop: 15,
  },
});
