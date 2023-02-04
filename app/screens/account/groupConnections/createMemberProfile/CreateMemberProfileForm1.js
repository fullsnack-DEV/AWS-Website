/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable default-case */
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
  Platform,
  Alert,
  Pressable,
  Linking,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import Modal from 'react-native-modal';

import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import AuthContext from '../../../../auth/context';
import {
  deleteConfirmation,
  getHitSlop,
  showAlert,
  showAlertWithoutTitle,
} from '../../../../utils';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import DateTimePickerView from '../../../../components/Schedule/DateTimePickerModal';
import Verbs from '../../../../Constants/Verbs';

import {searchCityState, searchNearByCityState} from '../../../../api/External';
import {checkTownscupEmail} from '../../../../api/Users';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import locationModalStyles from '../../../../Constants/LocationModalStyle';
import {
  getGeocoordinatesWithPlaceName,
  getPlaceNameFromPlaceID,
} from '../../../../utils/location';

let entity = {};

export default function CreateMemberProfileForm1({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [visibleCityModal, setVisibleCityModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [nearbyCities, setNearbyCities] = useState([]);

  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  const actionSheet = useRef();
  const [showDate, setShowDate] = useState(false);
  const [role, setRole] = useState('');

  const [minDateValue, setMinDateValue] = useState(new Date());
  const [maxDateValue, setMaxDateValue] = useState(new Date());
  const [memberInfo, setMemberInfo] = useState({});
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [homeCity, setHomeCity] = useState();

  const [birthday, setBirthday] = useState();

  const [cityData, setCityData] = useState([]);
  const [locationFetch, setLocationFetch] = useState(false);
  const [userDeniedLocPerm, setUserDeniedLocPerm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();

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

  useEffect(() => {
    const mindate = new Date();
    const maxdate = new Date();
    mindate.setFullYear(mindate.getFullYear() - 13);
    maxdate.setFullYear(maxdate.getFullYear() - 123);
    // setDateValue(mindate);
    setMinDateValue(mindate);
    setMaxDateValue(maxdate);
  }, []);

  useEffect(() => {
    const getAuthEntity = async () => {
      entity = authContext.entity;
      setRole(entity.role);
    };
    getAuthEntity();
  }, []);

  useEffect(() => {
    if (route?.params?.city) {
      setHomeCity(route?.params?.city);
    } else {
      setHomeCity('');
    }
  }, []);

  const checkValidation = useCallback(() => {
    if (!firstName) {
      showAlertWithoutTitle(strings.nameCanNotBlankText);
      return false;
    }
    if (!lastName) {
      showAlertWithoutTitle(strings.lastNameCanNotBlankText);
      return false;
    }
    if (!homeCity) {
      showAlertWithoutTitle(strings.homeCityCannotBlack);
      return false;
    }
    if (!email) {
      showAlertWithoutTitle(strings.emailNotBlankText);
      return false;
    }
    if (ValidateEmail(email) === false) {
      showAlertWithoutTitle(strings.validEmailMessage);
      return false;
    }

    return true;
  }, [email, firstName, lastName, homeCity]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.nextButtonStyle}
          onPress={() => {
            if (checkValidation()) {
              setLoading(true);
              checkUserIsRegistratedOrNotWithTownscup(email)
                .then((userExist) => {
                  if (!userExist) {
                    setLoading(false);

                    const form1Object = {
                      ...memberInfo,
                      is_member: true,
                      first_name: firstName,
                      last_name: lastName,
                      email,
                      home_city: homeCity,
                    };
                    // if (entity.role === Verbs.entityTypeTeam) {
                    //   navigation.navigate('CreateMemberProfileTeamForm3', {
                    //     form1: form1Object,
                    //   });
                    // } else if (entity.role === Verbs.entityTypeClub) {
                    //   navigation.navigate('CreateMemberProfileForm2', {
                    //     form1: form1Object,
                    //   });
                    // }
                    navigation.navigate('CreateMemberProfileForm2', {
                      form1: form1Object,
                    });
                  } else {
                    setTimeout(() => {
                      showAlert(strings.emailExistInTC);
                    });
                    setLoading(false);
                  }
                })
                .catch((error) => {
                  setTimeout(() => {
                    showAlert(error);
                  });
                  setLoading(false);
                });
            }
          }}>
          {strings.next}
        </Text>
      ),
    });
  }, [
    navigation,
    memberInfo,
    role,
    showDate,
    firstName,
    lastName,
    email,

    checkValidation,
    birthday,
    homeCity,
  ]);

  // Email input format validation
  const ValidateEmail = (emailAddress) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailAddress).toLowerCase());
  };

  const deleteImage = () => {
    setMemberInfo({...memberInfo, full_image: undefined});
  };

  const onProfileImageClicked = () => {
    setTimeout(() => {
      actionSheet.current.show();
    }, 0);
  };

  const openCamera = (width = 400, height = 400) => {
    check(
      Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      }),
    )
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            showAlert(strings.thisFeaturesNotAvailableText);
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.CAMERA).then(() => {
              ImagePicker.openCamera({
                width,
                height,
                cropping: true,
              })
                .then((data) => {
                  setMemberInfo({...memberInfo, full_image: data.path});
                })
                .catch(() => {});
            });
            break;
          case RESULTS.LIMITED:
            break;
          case RESULTS.GRANTED:
            ImagePicker.openCamera({
              width,
              height,
              cropping: true,
            })
              .then((data) => {
                setMemberInfo({...memberInfo, full_image: data.path});
              })
              .catch(() => {});
            break;
          case RESULTS.BLOCKED:
            break;
        }
      })
      .catch((error) => {
        showAlert(error);
      });
  };
  const openImagePicker = (width = 400, height = 400) => {
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((data) => {
      setMemberInfo({...memberInfo, full_image: data.path});
    });
  };
  const handleDonePress = (date) => {
    setBirthday(new Date(date).getTime());
    setShowDate(!showDate);
  };
  const handleCancelPress = () => {
    setShowDate(!showDate);
  };

  const checkUserIsRegistratedOrNotWithTownscup = (emailID) =>
    new Promise((resolve) => {
      checkTownscupEmail(encodeURIComponent(emailID))
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });

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

  const renderLocationItem = ({item}) => (
    <Pressable
      onPress={() => {
        onSelectLocation(item);
      }}>
      <View style={locationModalStyles.listItem}>
        <Text style={locationModalStyles.cityText}>{item.description}</Text>
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

  const onSelectLocation = async (item) => {
    setLoading(true);
    getPlaceNameFromPlaceID(item.place_id).then((_location) => {
      setLoading(false);
      if (_location) {
        setHomeCity(_location.city);
      }
      toggleCityModal();
    });
  };

  const onSelectCurrentLocation = async () => {
    setHomeCity(currentLocation?.city);

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
    setHomeCity(item.city);

    toggleCityModal();
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={1} />
      <ActivityLoader visible={loading} />
      <TCKeyboardView>
        <View style={styles.profileView}>
          <Image
            source={
              memberInfo.full_image
                ? {uri: memberInfo.full_image}
                : images.profilePlaceHolder
            }
            style={styles.profileChoose}
          />
          <TouchableOpacity
            style={styles.choosePhoto}
            onPress={() => onProfileImageClicked()}>
            <Image
              source={images.certificateUpload}
              style={styles.choosePhoto}
            />
          </TouchableOpacity>
        </View>

        <View>
          <TCLable title={strings.nameText.toUpperCase()} required={true} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12,
            }}>
            <TCTextField
              value={firstName}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => setFirstName(text)}
              placeholder={strings.firstName}
            />
            <TCTextField
              value={lastName}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => setLastName(text)}
              placeholder={strings.lastName}
            />
          </View>
        </View>
        <View>
          <TCLable
            title={strings.homeCity.toUpperCase()}
            required={true}
            style={{marginBottom: 12}}
          />
          <TouchableOpacity onPress={() => toggleCityModal()}>
            <TCTextField
              value={homeCity}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={strings.homeCity}
              pointerEvents="none"
              editable={false}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TCLable
            title={strings.emailtitle.toUpperCase()}
            required={true}
            style={{marginBottom: 12}}
          />
          <TCTextField
            value={email}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => setEmail(text)}
            placeholder={strings.emailPlaceHolder}
            keyboardType={'email-address'}
          />
          <Text style={styles.notesStyle}>{strings.emailNotes}</Text>
        </View>

        <ActionSheet
          ref={actionSheet}
          options={
            memberInfo.full_image
              ? [
                  strings.camera,
                  strings.album,
                  strings.deleteTitle,
                  strings.cancelTitle,
                ]
              : [strings.camera, strings.album, strings.cancelTitle]
          }
          destructiveButtonIndex={memberInfo.full_image && 2}
          cancelButtonIndex={memberInfo.full_image ? 3 : 2}
          onPress={(index) => {
            if (index === 0) {
              openCamera();
            } else if (index === 1) {
              openImagePicker();
            } else if (index === 2) {
              deleteConfirmation(
                strings.appName,
                strings.deleteConfirmationText,
                () => deleteImage(),
              );
            }
          }}
        />

        {showDate && (
          <View>
            <DateTimePickerView
              visible={showDate}
              date={birthday}
              onDone={handleDonePress}
              onCancel={handleCancelPress}
              onHide={handleCancelPress}
              minimumDate={maxDateValue}
              maximumDate={minDateValue}
              mode={'date'}
            />
          </View>
        )}
      </TCKeyboardView>

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
              {strings.currentCity}
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
            {noData && searchText.length > 0 && (
              <Text style={locationModalStyles.noDataText}>
                {strings.enter3CharText}
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
    </>
  );
}
const styles = StyleSheet.create({
  profileChoose: {
    height: 70,
    width: 70,
    borderRadius: 140,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  profileView: {
    backgroundColor: colors.whiteColor,
    height: 72,
    width: 72,
    borderRadius: 36,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  choosePhoto: {
    position: 'absolute',
    width: 22,
    height: 22,
    bottom: 2,
    right: 0,
  },
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },

  notesStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
    margin: 15,
  },
});
