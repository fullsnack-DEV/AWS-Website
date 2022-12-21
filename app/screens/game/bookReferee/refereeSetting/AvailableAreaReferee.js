/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable guard-for-in */
/* eslint-disable array-callback-return */
import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';

// import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AuthContext from '../../../../auth/context';

import ActivityLoader from '../../../../components/loader/ActivityLoader';

import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';

import TCThinDivider from '../../../../components/TCThinDivider';
import LocationSearchModal from '../../../../components/Home/LocationSearchModal';
import * as Utility from '../../../../utils';
import {patchPlayer} from '../../../../api/Users';
import Verbs from '../../../../Constants/Verbs';
import {searchCityState, searchNearByCityState} from '../../../../api/External';
import {
  getPlaceNameFromPlaceID,
  getGeocoordinatesWithPlaceName,
} from '../../../../utils/location';
import images from '../../../../Constants/ImagePath';
import Separator from '../../../../components/Separator';

export default function AvailableAreaReferee({navigation, route}) {
  const [comeFrom] = useState(route?.params?.comeFrom);
  const [sportName] = useState(route?.params?.sportName);
  const authContext = useContext(AuthContext);

  const [loading, setloading] = useState(false);
  const [areaRadio, setAreaRadio] = useState(0);
  const [addressType, setAddressType] = useState();
  const [searchAddress, setSearchAddress] = useState(
    route?.params?.settingObj?.available_area,
  );
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addressListIndex, setAddressListIndex] = useState();

  const [distancePopup, setDistancePopup] = useState(false);
  const [selectedDistanceOption, setSelectedDistanceOption] = useState(
    route?.params?.settingObj?.available_area?.distance_type &&
      route?.params?.settingObj?.available_area?.distance_type === 'Mi'
      ? 0
      : 1,
  );

  const [addressList, setAddressList] = useState(
    route?.params?.settingObj?.available_area?.address_list
      ? route?.params?.settingObj?.available_area?.address_list
      : [
          {
            id: 0,
            address: '',
          },
        ],
  );

  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cityData, setCityData] = useState([]);
  const [nearbyCities, setNearbyCities] = useState([]);
  const [locationFetch, setLocationFetch] = useState(false);
  const [userDeniedLocPerm, setUserDeniedLocPerm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [loadings, setLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.saveButtonStyle}
          onPress={() => {
            if (areaRadio === 0) {
              const addresses = addressList.filter(
                (obj) => obj?.address === '',
              );

              if (addresses.length > 0) {
                Alert.alert(strings.fillAddressFieldValidation);
              } else {
                onSavePressed();
              }
            } else if (selectedDistanceOption === undefined) {
              Alert.alert(strings.typeDistanceValidation);
            } else if (
              searchAddress?.address === '' ||
              searchAddress?.description === ''
            ) {
              Alert.alert(strings.selectAddressValidation);
            } else {
              onSavePressed();
            }
          }}>
          {strings.save}
        </Text>
      ),
    });
  }, [
    navigation,
    areaRadio,
    selectedDistanceOption,
    searchAddress,
    addressList,
    route?.params?.settingObj?.available_area?.address,
  ]);

  const onSavePressed = () => {
    let availableArea = {};
    if (areaRadio === 0) {
      const list = addressList.map((v) => {
        const o = v;
        delete o.id;
        return o;
      });

      availableArea = {
        is_specific_address: areaRadio === 0,
        address_list: list,
      };
    }

    const refereeSetting = (
      authContext?.entity?.obj?.referee_data ?? []
    ).filter((obj) => obj.sport === sportName)?.[0]?.setting;

    const modifiedSetting = {
      ...refereeSetting,
      available_area: availableArea,
      sport: sportName,
      entity_type: 'referee',
    };

    setloading(true);

    const registerdRefereeData = authContext?.entity?.obj?.referee_data?.filter(
      (obj) => obj?.sport !== sportName,
    );

    let selectedSport = authContext?.entity?.obj?.referee_data?.filter(
      (obj) => obj?.sport === sportName,
    )[0];

    selectedSport = {
      ...selectedSport,
      setting: modifiedSetting,
    };
    registerdRefereeData.push(selectedSport);

    const body = {
      ...authContext?.entity?.obj,
      referee_data: registerdRefereeData,
    };

    patchPlayer(body, authContext)
      .then(async (response) => {
        if (response.status === true) {
          setloading(false);
          const entity = authContext.entity;
          entity.auth.user = response.payload;
          entity.obj = response.payload;
          authContext.setEntity({...entity});
          authContext.setUser(response.payload);
          await Utility.setStorage('authContextUser', response.payload);
          await Utility.setStorage('authContextEntity', {...entity});
          navigation.navigate(comeFrom, {
            settingObj: response.payload.referee_data.filter(
              (obj) => obj.sport === sportName,
            )[0].setting,
          });
        } else {
          Alert.alert(strings.appName, response.messages);
        }
        setloading(false);
      })
      .catch((e) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.alertmessagetitle, e.message);
        }, 10);
      });
  };

  const addAddress = () => {
    if (addressList.length < 10) {
      const obj = {
        id: addressList.length === 0 ? 0 : addressList.length,
        address: '',
      };
      setAddressList([...addressList, obj]);
    } else {
      Alert.alert(strings.titleBasic, strings.maxPeriod);
    }
  };

  const renderAddress = useCallback(
    ({index}) => (
      <View>
        <TouchableOpacity
          style={styles.detailsSingleContainer}
          onPress={() => {
            setAddressModalVisible(true);
            setAddressType('short');
            setAddressListIndex(index);
          }}>
          <TextInput
            editable={false}
            pointerEvents="none"
            style={styles.detailsSingleText}
            placeholder={strings.searchCityStatePlaceholder}
            value={addressList[index].address}
          />
        </TouchableOpacity>
        {index !== 0 && (
          <Text
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                '',
                strings.deleteAvailableArea,
                [
                  {
                    text: strings.cancel,
                    style: Verbs.cancelVerb,
                  },
                  {
                    text: strings.delete,
                    onPress: () => {
                      const tempEmail = [...addressList];
                      tempEmail.splice(index, 1);
                      setAddressList([...tempEmail]);
                    },
                    style: 'destructive',
                  },
                ],
                {cancelable: false},
              );
            }}>
            {strings.delete}
          </Text>
        )}
      </View>
    ),
    [addressList],
  );

  const onCloseLocationModal = () => {
    setAddressModalVisible(false);
  };

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
        console.log('searchNearByCityState', response);
        const list = response.filter(
          (obj) =>
            !(
              obj.city === currentLocation?.city &&
              obj.country === currentLocation?.country
            ),
        );
        setNearbyCities(list);
        console.log('list', list);
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
    setLoading(true);
    setUserDeniedLocPerm(false);
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((location) => {
        setLocationFetch(true);
        if (location.position) {
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
          console.log('userD denied the to fetch GPS Location');
        } else {
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        }
      });
  }, []);

  const onSelectCurrentLocation = async () => {
    setLoading(true);
    if (addressType === 'short') {
      const obj = [...addressList];
      obj[
        addressListIndex
      ].address = `${currentLocation.city}, ${currentLocation.state}, ${currentLocation.country}`;
      setAddressList(obj);
      onCloseLocationModal();
    } else {
      setSearchAddress(
        `${currentLocation.city}, ${currentLocation.state}, ${currentLocation.country}`,
      );
      onCloseLocationModal();
    }
    // setLoading(true);
    // const userData = {
    //   city: currentLocation?.city,
    //   state_abbr: currentLocation?.stateAbbr,
    //   country: currentLocation?.country,
    // };

    // navigateToChooseSportScreen(userData);
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
    if (addressType === 'short') {
      const obj = [...addressList];
      obj[addressListIndex].address = item.description;
      setAddressList(obj);
      onCloseLocationModal();
    } else {
      setSearchAddress(item);
      onCloseLocationModal();
    }
  };

  const onSelectNearByLocation = async (item) => {
    if (addressType === 'short') {
      const obj = [...addressList];
      obj[addressListIndex].address = item.description;
      setAddressList(obj);
      onCloseLocationModal();
    } else {
      setSearchAddress(item);
      onCloseLocationModal();
    }
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => onSelectLocation(item)}>
      <Text style={styles.cityList}>{cityData[index].description}</Text>
      <Separator />
    </TouchableOpacity>
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
          {/* <Separator /> */}
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
    <SafeAreaView>
      <ActivityLoader visible={loading} />

      <View>
        <TouchableOpacity
          style={[
            styles.checkBoxContainer,
            {
              marginTop: 10,
            },
          ]}
          onPress={() => {
            setAreaRadio(0);
            setAddressType('short');
          }}>
          <Text style={[styles.radioTitleText, {flex: 0.9}]}>
            {strings.addAreaText}
          </Text>
        </TouchableOpacity>

        <View pointerEvents={areaRadio === 0 ? 'auto' : 'none'}>
          <FlatList
            data={addressList}
            renderItem={renderAddress}
            keyExtractor={(item, index) => index.toString()}
            style={{marginBottom: 10}}
          />

          <TouchableOpacity
            style={styles.buttonView}
            onPress={() => addAddress()}>
            <Text style={styles.textStyle} numberOfLines={1}>
              {strings.addArea}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Distance modal modal */}
      <Modal
        onBackdropPress={() => setDistancePopup(false)}
        backdropOpacity={0.2}
        animationType="slide"
        hasBackdrop
        style={{
          margin: 0,
          backgroundColor: colors.whiteOpacityColor,
        }}
        visible={distancePopup}>
        <View style={styles.bottomPopupContainer}>
          <View style={styles.viewsContainer}>
            <Text
              onPress={() => setDistancePopup(false)}
              style={styles.cancelText}>
              {strings.cancel}
            </Text>
            <Text style={styles.locationText}>{strings.range}</Text>
            <Text style={styles.cancelText}>{'       '}</Text>
          </View>
          <TCThinDivider width={'100%'} marginBottom={15} />
          <TouchableOpacity
            onPress={() => {
              setSelectedDistanceOption(0);
              setTimeout(() => {
                setDistancePopup(false);
              }, 600);
            }}>
            {selectedDistanceOption === 0 ? (
              <LinearGradient
                colors={[colors.yellowColor, colors.orangeGradientColor]}
                style={styles.backgroundView}>
                <Text
                  style={[
                    styles.curruentLocationText,
                    {color: colors.whiteColor},
                  ]}>
                  {strings.mi}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.curruentLocationText}>{strings.mi}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedDistanceOption(1);
              setTimeout(() => {
                setDistancePopup(false);
              }, 600);
            }}>
            {selectedDistanceOption === 1 ? (
              <LinearGradient
                colors={[colors.yellowColor, colors.orangeGradientColor]}
                style={styles.backgroundView}>
                <Text style={[styles.myCityText, {color: colors.whiteColor}]}>
                  {strings.km}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.backgroundView}>
                <Text style={styles.myCityText}>{strings.km}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Distance modal */}

      {/* Address modal */}

      <Modal
        onBackdropPress={() => onCloseLocationModal}
        backdropOpacity={0.2}
        animationType="slide"
        hasBackdrop
        style={{
          margin: 0,
          backgroundColor: colors.whiteOpacityColor,
        }}
        visible={addressModalVisible}>
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          style={{height: Dimensions.get('window').height}}>
          <View
            style={[
              styles.bottomPopupContainer,
              {
                height: Dimensions.get('window').height - 250,
                maxHeight: Dimensions.get('window').height - 250,
              },
            ]}>
            <View style={styles.viewsContainer}>
              <Text
                onPress={() => onCloseLocationModal()}
                style={styles.cancelText}>
                {strings.cancel}
              </Text>
            </View>
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
            {noData && searchText.length > 0 && (
              <Text style={styles.noDataText}>{strings.enter3CharText}</Text>
            )}
            {noData && searchText.length === 0 && nearbyCities.length > 0 && (
              <SafeAreaView style={{flex: 1}}>
                <FlatList
                  data={nearbyCities}
                  renderItem={({item}) => (
                    <TouchableWithoutFeedback
                      style={styles.listItem}
                      onPress={() => onSelectNearByLocation(item)}>
                      <Text style={styles.cityList}>
                        {[item.city, item.state, item.country]
                          .filter((v) => v)
                          .join(', ')}
                      </Text>
                      {/* <Separator /> */}
                    </TouchableWithoutFeedback>
                  )}
                  ListHeaderComponent={renderCurrentLocation}
                  keyExtractor={(index) => index.toString()}
                />
              </SafeAreaView>
            )}
            {noData &&
              searchText.length === 0 &&
              locationFetch &&
              !currentLocation && (
                <TouchableOpacity
                  style={styles.noLocationViewStyle}
                  onPress={() => onSelectNoCurrentLocation()}>
                  <View>
                    <Text style={styles.currentLocationTextStyle}>
                      {strings.currentLocationText}
                    </Text>
                    <Separator />
                  </View>
                  <Text
                    style={[styles.currentLocationTextStyle, {marginTop: 15}]}>
                    {strings.noLocationText}
                  </Text>
                </TouchableOpacity>
              )}
            {cityData.length > 0 && (
              <FlatList
                data={cityData}
                renderItem={renderItem}
                keyExtractor={(item) => item.place_id}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* <LocationSearchModal
        visible={addressModalVisible}
        addressType={addressType}
        onSelect={(data) => {
          if (addressType === 'short') {
            const obj = [...addressList];
            obj[addressListIndex].address = data.description;
            setAddressList(obj);
          } else {
            setSearchAddress(data);
          }
        }}
        onClose={onCloseLocationModal}
      /> */}
    </SafeAreaView>
    // {/* Address modal */}
  );
}
const styles = StyleSheet.create({
  saveButtonStyle: {
    fontFamily: fonts.RMedium,
    fontSize: 16,
    marginRight: 10,
  },

  radioTitleText: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
  },

  checkBoxContainer: {
    flex: 1,
    width: '92%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },

  detailsSingleContainer: {
    height: 40,
    fontSize: 16,
    fontFamily: fonts.RRegular,
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 15,
    color: colors.lightBlackColor,
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 3,
    marginLeft: 25,
    marginRight: 25,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailsSingleText: {
    alignSelf: 'center',
    color: colors.lightBlackColor,
    fontSize: 16,
    height: 40,
    fontFamily: fonts.RRegular,
    justifyContent: 'center',
    flex: 1,
  },

  buttonView: {
    width: '30%',
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    height: 25,
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
    paddingHorizontal: 5,
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 5,
  },
  textStyle: {
    alignSelf: 'center',
    fontFamily: fonts.RMedium,
    fontSize: 12,
    textAlign: 'center',
    color: colors.lightBlackColor,
  },
  deleteButton: {
    fontSize: 12,
    fontFamily: fonts.RRegular,
    color: colors.darkThemeColor,
    alignSelf: 'flex-end',
    marginRight: 15,
  },

  bottomPopupContainer: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',

    ...Platform.select({
      ios: {
        shadowColor: colors.googleColor,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  backgroundView: {
    alignSelf: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    height: 50,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '86%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  myCityText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  curruentLocationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },

  locationText: {
    fontSize: 16,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.requestConfirmColor,
  },
  viewsContainer: {
    height: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    // NEW MODAL STYLES
  },

  LocationText: {
    color: colors.grayColor,
    fontFamily: fonts.RBold,
    fontSize: wp('6%'),
    // marginTop: hp('12%'),
    paddingLeft: 30,
    textAlign: 'left',
  },
  LocationDescription: {
    color: colors.grayColor,
    fontFamily: fonts.RMedium,
    fontSize: wp('4%'),
    marginTop: hp('1%'),
    paddingLeft: 30,
    paddingRight: 30,
    textAlign: 'left',
  },
  cityList: {
    color: colors.grayColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RMedium,
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },
  curruentLocationText: {
    color: colors.grayColor,
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
  noDataText: {
    // alignSelf: 'center',
    color: colors.grayColor,
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
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 10,
  },
  noLocationViewStyle: {
    flexDirection: 'column',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  currentLocationTextStyle: {
    color: colors.grayColor,
    fontSize: 14,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    textAlignVertical: 'center',
    marginBottom: 16,
    marginTop: 21,
  },
});
