import React, {
  useLayoutEffect,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
  Platform,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerView from '../../../../components/Schedule/DateTimePickerModal';

import images from '../../../../Constants/ImagePath';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import AuthContext from '../../../../auth/context';

import TCFormProgress from '../../../../components/TCFormProgress';
import {strings} from '../../../../../Localization/translation';
import TCPicker from '../../../../components/TCPicker';
import DataSource from '../../../../Constants/DataSource';
import TCLabel from '../../../../components/TCLabel';
import TCTouchableLabel from '../../../../components/TCTouchableLabel';
import {
  getHitSlop,
  monthNames,
  showAlert,
  widthPercentageToDP,
} from '../../../../utils';
import TCPhoneNumber from '../../../../components/TCPhoneNumber';
import TCMessageButton from '../../../../components/TCMessageButton';
import {
  searchAddressPredictions,
  searchCityState,
  searchNearByCityState,
} from '../../../../api/External';
import LocationView from '../../../../components/LocationView';
import {heightMesurement, weightMesurement} from '../../../../utils/constant';
import {
  getGeocoordinatesWithPlaceName,
  getPlaceNameFromPlaceID,
} from '../../../../utils/location';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import locationModalStyles from '../../../../Constants/LocationModalStyle';
import Verbs from '../../../../Constants/Verbs';

let entity = {};
export default function CreateMemberProfileForm2({navigation, route}) {
  const authContext = useContext(AuthContext);
  entity = authContext.entity;
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const [gender, setGender] = useState();
  const [dominant, setDominant] = useState();

  const [birthday, setBirthday] = useState();
  const [showDate, setShowDate] = useState(false);
  const [postalCode, setPostalCode] = useState();
  const [minDateValue, setMinDateValue] = useState(new Date());
  const [memberInfo, setMemberInfo] = useState({
    height: {
      height_type: 'ft',
    },
    weight: {
      weight_type: 'lb',
    },
  });
  const [location, setLocation] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cityData, setCityData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [visibleCityModal, setVisibleCityModal] = useState(false);

  const [noData, setNoData] = useState(false);
  const [nearbyCities, setNearbyCities] = useState([]);
  const [locationFetch, setLocationFetch] = useState(false);
  const [userDeniedLocPerm, setUserDeniedLocPerm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();

  const addPhoneNumber = () => {
    const obj = {
      id: phoneNumber.length === 0 ? 0 : phoneNumber.length,
      code: '',
      number: '',
    };
    setPhoneNumber([...phoneNumber, obj]);
  };

  const [phoneNumber, setPhoneNumber] = useState([
    {
      id: 0,
      phone_number: '',
      country_code: '',
    },
  ]);

  useEffect(() => {
    if (searchText.length >= 3) {
      if (visibleLocationModal) {
        searchAddressPredictions(searchText)
          .then((response) => {
            console.log('search address:=>', response);
            setLocationData(response.predictions);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.alertmessagetitle, e.message);
            }, 10);
          });
      } else {
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
      }
    } else {
      setNoData(true);
      setCityData([]);
      setLocationData([]);
    }
  }, [searchText]);

  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // setDateValue(mindate);
    setMinDateValue(mindate);
  }, []);

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity;
    };
    getAuthEntity();
  }, []);

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.city) {
        setCity(route?.params?.city);
        setState(route?.params?.state);
        setCountry(route?.params?.country);
      } else {
        setCity('');
        setState('');
        setCountry('');
      }
    }
  }, [isFocused]);

  const validation = useCallback(() => {
    if (
      !city?.length ||
      !state?.length ||
      !country?.length ||
      !postalCode?.length ||
      !location?.length
    ) {
      showAlert(strings.addressValidation);
      return false;
    }
    return true;
  }, [city, country, location, postalCode, state]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.nextButtonStyle} onPress={() => pressedNext()}>
          {strings.next}
        </Text>
      ),
    });
  }, [
    navigation,
    gender,
    location,
    city,
    state,
    country,
    postalCode,
    birthday,
    dominant,
  ]);

  const pressedNext = () => {
    if (validation()) {
      const membersAuthority = {
        ...memberInfo,
        ...route.params.form1,
        group_id: entity.uid,
        is_member: true,
        gender,
        street_address: location,
        city,
        state_abbr: state,
        country,
        postal_code: postalCode,
        birthday,
      };

      if (entity.role === Verbs.entityTypeTeam) {
        navigation.navigate('CreateMemberProfileTeamForm3', {
          form2:
            entity.obj.sport === 'soccer'
              ? {...membersAuthority, dominant_foot: dominant}
              : membersAuthority,
        });
      } else if (entity.role === Verbs.entityTypeClub) {
        navigation.navigate('CreateMemberProfileClubForm3', {
          form2: membersAuthority,
        });
      }
    }
  };

  const handleDonePress = (date) => {
    setBirthday(new Date(date));
    setShowDate(!showDate);
  };
  const handleCancelPress = () => {
    setShowDate(!showDate);
  };

  const renderPhoneNumber = ({item, index}) => (
    <TCPhoneNumber
      marginBottom={2}
      placeholder={strings.selectCode}
      value={item.country_code}
      numberValue={item.phone_number}
      onValueChange={(value) => {
        const tempCode = [...phoneNumber];
        tempCode[index].country_code = value;
        setPhoneNumber(tempCode);
        const filteredNumber = phoneNumber.filter(
          (obj) =>
            ![null, undefined, ''].includes(
              obj.phone_number && obj.country_code,
            ),
        );
        setMemberInfo({
          ...memberInfo,
          phone_numbers: filteredNumber.map(({country_code, phone_number}) => ({
            country_code,
            phone_number,
          })),
        });
      }}
      onChangeText={(text) => {
        const tempPhone = [...phoneNumber];
        tempPhone[index].phone_number = text;
        setPhoneNumber(tempPhone);
        const filteredNumber = phoneNumber.filter(
          (obj) =>
            ![null, undefined, ''].includes(
              obj.phone_number && obj.country_code,
            ),
        );
        setMemberInfo({
          ...memberInfo,
          phone_numbers: filteredNumber.map(({country_code, phone_number}) => ({
            country_code,
            phone_number,
          })),
        });
      }}
    />
  );

  const heightView = () => (
    <View
      style={{
        flexDirection: 'row',
        align: 'center',
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'space-between',
      }}>
      <View style={{...styles.halfMatchFeeView}}>
        <TextInput
          placeholder={'-'}
          style={styles.halffeeText}
          keyboardType={'decimal-pad'}
          onChangeText={(text) => {
            setMemberInfo({
              ...memberInfo,
              height: {
                height: text,
                height_type: memberInfo?.height?.height_type,
              },
            });
          }}
          value={memberInfo?.height?.height}
          maxLength={3}
        />
      </View>
      <RNPickerSelect
        placeholder={{
          label: strings.heightTypeText,
          value: null,
        }}
        items={heightMesurement}
        onValueChange={(value) => {
          setMemberInfo({
            ...memberInfo,
            height: {
              height: memberInfo?.height?.height,
              height_type: value,
            },
          });
        }}
        value={memberInfo?.height?.height_type}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: {
            fontSize: widthPercentageToDP('3.5%'),
            paddingVertical: 12,
            paddingHorizontal: 15,
            width: widthPercentageToDP('45%'),
            color: 'black',
            paddingRight: 30,
            backgroundColor: colors.textFieldBackground,
            borderRadius: 5,
            textAlign: 'center',
            ...styles.shadowStyle,
          },
          inputAndroid: {
            fontSize: widthPercentageToDP('4%'),
            paddingVertical: 12,
            paddingHorizontal: 15,
            width: widthPercentageToDP('45%'),
            color: 'black',
            paddingRight: 30,
            backgroundColor: colors.textFieldBackground,
            borderRadius: 5,
            textAlign: 'center',
            ...styles.shadowStyle,
          },
        }}
        Icon={() => (
          <Image source={images.dropDownArrow} style={styles.miniDownArrow} />
        )}
      />
    </View>
  );

  const weightView = () => (
    <View
      style={{
        flexDirection: 'row',
        align: 'center',
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'space-between',
      }}>
      <View style={{...styles.halfMatchFeeView, ...styles.shadowStyle}}>
        <TextInput
          placeholder={'-'}
          style={styles.halffeeText}
          keyboardType={'decimal-pad'}
          onChangeText={(text) => {
            setMemberInfo({
              ...memberInfo,
              weight: {
                weight: text,
                weight_type: memberInfo?.weight?.weight_type,
              },
            });
          }}
          maxLength={3}
          value={memberInfo?.weight?.weight}
        />
      </View>
      <RNPickerSelect
        placeholder={{
          label: strings.weightTypeText,
          value: null,
        }}
        items={weightMesurement}
        onValueChange={(value) => {
          setMemberInfo({
            ...memberInfo,
            weight: {
              weight: memberInfo?.weight?.weight,
              weight_type: value,
            },
          });
        }}
        value={memberInfo?.weight?.weight_type}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: {
            fontSize: widthPercentageToDP('3.5%'),
            paddingVertical: 12,
            paddingHorizontal: 15,
            width: widthPercentageToDP('45%'),
            color: 'black',
            paddingRight: 30,
            backgroundColor: colors.textFieldBackground,
            borderRadius: 5,
            textAlign: 'center',
            ...styles.shadowStyle,
          },
          inputAndroid: {
            fontSize: widthPercentageToDP('4%'),
            paddingVertical: 12,
            paddingHorizontal: 15,
            width: widthPercentageToDP('45%'),
            color: 'black',
            paddingRight: 30,
            backgroundColor: colors.textFieldBackground,
            borderRadius: 5,
            textAlign: 'center',
            ...styles.shadowStyle,
          },
        }}
        Icon={() => (
          <Image source={images.dropDownArrow} style={styles.miniDownArrow} />
        )}
      />
    </View>
  );

  const locationString = () =>
    [city, state, country].filter((v) => v).join(', ');

  const toggleCityModal = () => {
    if (!visibleCityModal) {
      setLoading(true);
      setUserDeniedLocPerm(false);
      setSearchText('');
      setCityData([]);
      getGeocoordinatesWithPlaceName(Platform.OS)
        .then((_location) => {
          setLocationFetch(true);
          if (_location.position) {
            setCurrentLocation(_location);
            getNearbyCityData(
              _location.position.coords.latitude,
              _location.position.coords.longitude,
              100,
            );
          } else {
            setLoading(false);
            setCurrentLocation(null);
            setVisibleCityModal(!visibleCityModal);
          }
        })
        .catch((e) => {
          setLoading(false);
          setLocationFetch(true);
          if (e.name === Verbs.gpsErrorDeined) {
            setCurrentLocation(null);
            setUserDeniedLocPerm(true);
          } else {
            setTimeout(() => {
              Alert.alert(
                strings.alertmessagetitle,
                `${e.message}(Location fetch`,
              );
            }, 10);
          }
          setVisibleCityModal(!visibleCityModal);
        });
    } else {
      setVisibleCityModal(!visibleCityModal);
    }
  };

  const renderAdressItem = ({item}) => (
    <Pressable onPress={() => onSelectAddress(item)}>
      <View style={locationModalStyles.listItem}>
        <Text style={locationModalStyles.cityText}>{item.description}</Text>
      </View>
      <View style={locationModalStyles.itemSeprater} />
    </Pressable>
  );

  const renderLocationItem = ({item}) => (
    <Pressable onPress={() => onSelectLocation(item)}>
      <View style={locationModalStyles.listItem}>
        <Text style={{...locationModalStyles.cityText}}>
          {item.description}
        </Text>
      </View>
      <View style={locationModalStyles.itemSeprater} />
    </Pressable>
  );

  const renderCurrentLocationItem = ({item}) => (
    <Pressable
      onPress={() => {
        onSelectNearByLocation(item);
      }}>
      <View style={locationModalStyles.listItem}>
        <Text style={locationModalStyles.cityText}>
          {[item.city, item.state, item.country].filter((v) => v).join(', ')}
        </Text>
      </View>
      <View style={locationModalStyles.itemSeprater} />
    </Pressable>
  );

  const renderCurrentLocation = () => {
    let renderData;
    if (currentLocation && currentLocation.city) {
      renderData = (
        <Pressable onPress={() => onSelectCurrentLocation()}>
          <View style={locationModalStyles.listItemCurrentLocation}>
            <Text style={locationModalStyles.cityText}>
              {[
                currentLocation?.city,
                currentLocation?.state,
                currentLocation?.country,
              ]
                .filter((v) => v)
                .join(', ')}
            </Text>
            <Text style={locationModalStyles.curruentLocationText}>
              {strings.currentLocationText}
            </Text>
          </View>
          <View style={locationModalStyles.itemSeprater} />
        </Pressable>
      );
    } else {
      renderData = <View />;
    }
    return renderData;
  };

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
        setVisibleCityModal(!visibleCityModal);
      })
      .catch((e) => {
        setLoading(false);
        setNearbyCities([]);
        setTimeout(() => {
          Alert.alert(
            strings.alertmessagetitle,
            `${e.message}(getNearbyCityData),${lat},${long},${radius}`,
          );
        }, 10);
        setVisibleCityModal(!visibleCityModal);
      });
  };

  const onSelectAddress = async (item) => {
    setLoading(true);
    getPlaceNameFromPlaceID(item.place_id).then((_location) => {
      setLoading(false);
      if (_location) {
        setCity(_location.city);
        setState(_location.state);
        setCountry(_location.country);
        setPostalCode(_location.postalCode);
        setLocation(_location.address);
      }
      setVisibleLocationModal(false);
    });
  };

  const onSelectLocation = async (item) => {
    setLoading(true);
    getPlaceNameFromPlaceID(item.place_id).then((_location) => {
      setLoading(false);
      if (_location) {
        setCity(_location.city);
        setState(_location.state);
        setCountry(_location.country);
      }
      toggleCityModal();
    });
  };

  const onSelectCurrentLocation = async () => {
    setCity(currentLocation?.city);
    setState(currentLocation?.state);
    setCountry(currentLocation?.country);

    toggleCityModal();
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

  const onSelectNearByLocation = async (item) => {
    setCity(item.city);
    setState(item.state);
    setCountry(item.country);

    toggleCityModal();
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <TCFormProgress totalSteps={3} curruentStep={2} />
      <ActivityLoader visible={loading} />
      <View>
        <TCLabel
          title={strings.gender.toUpperCase()}
          style={{marginBottom: 12}}
        />
        <TCPicker
          dataSource={DataSource.Gender}
          placeholder={strings.selectGenderPlaceholder}
          value={gender}
          onValueChange={(value) => {
            setGender(value);
          }}
        />
      </View>
      <View>
        <TCLabel
          title={strings.birthDatePlaceholder.toUpperCase()}
          style={{marginBottom: 12}}
        />

        <TCTouchableLabel
          title={
            birthday &&
            `${`${monthNames[new Date(birthday).getMonth()]} ${new Date(
              birthday,
            ).getDate()}`}, ${new Date(birthday).getFullYear()}`
          }
          placeholder={strings.dateFormatPlaceholder}
          onPress={() => setShowDate(!showDate)}
          textStyle={{textAlign: 'center'}}
        />
      </View>

      <TCLabel
        title={strings.height.toUpperCase()}
        style={{marginBottom: 12}}
      />
      {heightView()}

      <TCLabel
        title={strings.weight.toUpperCase()}
        style={{marginBottom: 12}}
      />
      {weightView()}
      {authContext.entity.obj.sport === 'soccer' &&
        authContext.entity.role === 'team' && (
          <View>
            <TCLabel
              title={strings.dominantFoot.toUpperCase()}
              style={{marginBottom: 12}}
            />
            <TCPicker
              dataSource={DataSource.dominantFoot}
              placeholder={strings.dominantPlaceholder}
              value={dominant}
              onValueChange={(value) => {
                setDominant(value);
              }}
            />
          </View>
        )}

      <View>
        <TCLabel
          title={strings.phone.toUpperCase()}
          style={{marginBottom: 12}}
        />
        <FlatList
          data={phoneNumber}
          renderItem={renderPhoneNumber}
          keyExtractor={(item, index) => index.toString()}></FlatList>
      </View>
      {phoneNumber?.length < 5 && (
        <TCMessageButton
          title={strings.addPhone}
          width={100}
          borderColor={colors.whiteColor}
          color={colors.lightBlackColor}
          alignSelf="center"
          marginTop={15}
          onPress={() => addPhoneNumber()}
        />
      )}

      <LocationView
        onPressVisibleLocationPopup={() => setVisibleLocationModal(true)}
        onChangeLocationText={(text) => setLocation(text)}
        locationText={location}
        onChangePostalCodeText={(text) => setPostalCode(text)}
        postalCodeText={postalCode}
        locationString={locationString()}
        onPressCityPopup={() => toggleCityModal()}
      />
      {showDate && (
        <View>
          <DateTimePickerView
            visible={showDate}
            date={birthday}
            onDone={handleDonePress}
            onCancel={handleCancelPress}
            onHide={handleCancelPress}
            minimumDate={minDateValue}
            mode={'date'}
          />
        </View>
      )}
      <Modal
        isVisible={visibleLocationModal}
        onBackdropPress={() => setVisibleLocationModal(false)}
        onRequestClose={() => setVisibleLocationModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          behavior="height"
          enabled={false}
          style={locationModalStyles.mainView}>
          <View style={locationModalStyles.headerView}>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
            <Text style={locationModalStyles.headerText}>
              {strings.address}
            </Text>
            <View style={{paddingTop: 20, height: '100%'}}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={locationModalStyles.closeButton}
                onPress={() => setVisibleLocationModal(false)}>
                <Image
                  source={images.cancelImage}
                  style={[
                    locationModalStyles.closeButton,
                    {marginLeft: 0, marginRight: 0},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={locationModalStyles.separatorLine} />
          <View>
            <View style={locationModalStyles.searchSectionStyle}>
              <TextInput
                testID="choose-location-input"
                style={locationModalStyles.searchTextInput}
                placeholder={strings.searchForAddress}
                clearButtonMode="always"
                placeholderTextColor={colors.userPostTimeColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {searchText.length < 3 && (
              <Text style={locationModalStyles.noDataText}>
                {strings.threeCharToSeeAddress}
              </Text>
            )}

            {locationData.length > 0 && (
              <FlatList
                style={{marginTop: 10}}
                data={locationData}
                renderItem={renderAdressItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={visibleCityModal}
        onBackdropPress={() => setVisibleCityModal(false)}
        onRequestClose={() => setVisibleCityModal(false)}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          behavior="height"
          enabled={false}
          style={locationModalStyles.mainView}>
          <View style={locationModalStyles.headerView}>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
            <Text style={locationModalStyles.headerText}>
              {strings.cityStateCountryTitle}
            </Text>
            <View style={{paddingTop: 20, height: '100%'}}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={locationModalStyles.closeButton}
                onPress={() => setVisibleCityModal(false)}>
                <Image
                  source={images.cancelImage}
                  style={[
                    locationModalStyles.closeButton,
                    {marginLeft: 0, marginRight: 0},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={locationModalStyles.separatorLine} />
          <View>
            <View style={locationModalStyles.searchSectionStyle}>
              <TextInput
                testID="choose-location-input"
                style={locationModalStyles.searchTextInput}
                placeholder={strings.locationPlaceholderText}
                clearButtonMode="always"
                placeholderTextColor={colors.userPostTimeColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {searchText.length < 3 && (
              <Text style={locationModalStyles.noDataText}>
                {strings.threeCharToSeeAddress}
              </Text>
            )}
            {noData &&
              searchText.length === 0 &&
              nearbyCities.length >= 0 &&
              cityData.length === 0 && (
                <FlatList
                  style={[
                    locationModalStyles.nearbycitiesflatlist,
                    {marginTop: 25},
                  ]}
                  data={nearbyCities}
                  renderItem={renderCurrentLocationItem}
                  ListHeaderComponent={renderCurrentLocation}
                  keyExtractor={(index) => index.toString()}
                  onScroll={Keyboard.dismiss}
                />
              )}
            {noData &&
              searchText.length === 0 &&
              locationFetch &&
              !currentLocation && (
                <Pressable
                  style={styles.noLocationViewStyle}
                  onPress={() => onSelectNoCurrentLocation()}>
                  <View>
                    <Text style={locationModalStyles.currentLocationTextStyle}>
                      {strings.currentLocationText}
                    </Text>
                  </View>
                  <View style={locationModalStyles.itemSeprater} />
                  <Text
                    style={[
                      locationModalStyles.currentLocationTextStyle,
                      {marginTop: 15},
                    ]}>
                    {strings.noLocationText}
                  </Text>
                </Pressable>
              )}
            {cityData.length > 0 && (
              <FlatList
                style={{marginTop: 10}}
                data={cityData}
                renderItem={renderLocationItem}
                keyExtractor={(item, index) => index.toString()}
                onScroll={Keyboard.dismiss}
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 50,
  },

  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },

  miniDownArrow: {
    alignSelf: 'center',
    height: 12,
    resizeMode: 'contain',

    right: 15,
    tintColor: colors.grayColor,

    top: 15,
    width: 12,
  },
  halfMatchFeeView: {
    alignSelf: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: 'black',
    flexDirection: 'row',
    fontSize: widthPercentageToDP('3.5%'),
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    width: widthPercentageToDP('46%'),
  },
  halffeeText: {
    alignSelf: 'center',
    fontSize: widthPercentageToDP('3.8%'),
    width: '90%',
    textAlign: 'center',
  },
});
