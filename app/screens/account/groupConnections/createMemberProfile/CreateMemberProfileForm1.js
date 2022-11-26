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
  Alert,
  FlatList,
  TextInput,
  Dimensions,
  Keyboard,
  Platform,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';

import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLable from '../../../../components/TCLabel';
import TCTextField from '../../../../components/TCTextField';
import TCMessageButton from '../../../../components/TCMessageButton';
import AuthContext from '../../../../auth/context';
import {
  deleteConfirmation,
  getHitSlop,
  heightPercentageToDP,
  widthPercentageToDP,
} from '../../../../utils';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCKeyboardView from '../../../../components/TCKeyboardView';
import DateTimePickerView from '../../../../components/Schedule/DateTimePickerModal';
import Verbs from '../../../../Constants/Verbs';

import {searchAddress, searchCityState} from '../../../../api/External';
import {checkTownscupEmail} from '../../../../api/Users';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

let entity = {};

export default function CreateMemberProfileForm1({navigation, route}) {
  const authContext = useContext(AuthContext);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [visibleCityModal, setVisibleCityModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cityData, setCityData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const actionSheet = useRef();
  const [showDate, setShowDate] = useState(false);
  const [role, setRole] = useState('');
  const [location, setLocation] = useState();

  const [minDateValue, setMinDateValue] = useState(new Date());
  const [maxDateValue, setMaxDateValue] = useState(new Date());
  const [memberInfo, setMemberInfo] = useState({});
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [homeCity, setHomeCity] = useState();

  const [birthday, setBirthday] = useState();

  useEffect(() => {
    searchAddress(searchText).then((response) => {
      setLocationData(response.results);
    });
  }, [searchText]);

  useEffect(() => {
    searchCityState(searchText).then((response) => {
      setCityData(response.predictions);
    });
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
    if (isFocused) {
      if (route?.params?.city) {
        setHomeCity(route?.params?.city);
      } else {
        setHomeCity('');
      }
    }
  }, [isFocused]);

  const checkValidation = useCallback(() => {
    if (!firstName) {
      Alert.alert(strings.appName, strings.nameCanNotBlankText);
      return false;
    }
    if (!lastName) {
      Alert.alert(strings.appName, strings.lastNameCanNotBlankText);
      return false;
    }
    if (!homeCity) {
      Alert.alert(strings.appName, strings.homeCityCannotBlack);
      return false;
    }
    if (!email) {
      Alert.alert(strings.appName, strings.emailNotBlankText);
      return false;
    }
    if (ValidateEmail(email) === false) {
      Alert.alert('', strings.validEmailMessage);
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
                    if (entity.role === Verbs.entityTypeTeam) {
                      navigation.navigate('CreateMemberProfileTeamForm2', {
                        form1: form1Object,
                      });
                    } else if (entity.role === Verbs.entityTypeClub) {
                      navigation.navigate('CreateMemberProfileClubForm2', {
                        form1: form1Object,
                      });
                    }
                  } else {
                    setTimeout(() => {
                      Alert.alert(strings.emailExistInTC);
                    });
                    setLoading(false);
                  }
                })
                .catch((error) => {
                  setTimeout(() => {
                    Alert.alert(error);
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
    location,
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
            Alert.alert(strings.thisFeaturesNotAvailableText);
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
        Alert.alert(error);
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

  const renderLocationItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        // const shortAddress = '';

        const cty = item.address_components.filter((obj) =>
          obj.types.some((a) => a === 'locality'),
        );

        const sNumber = item.address_components.filter((obj) =>
          obj.types.some((c) => c === 'street_number'),
        );

        const add = item.address_components.filter((obj) =>
          obj.types.some((c) => c === 'route'),
        );

        setHomeCity(cty.length && cty[0].long_name);

        setLocation(
          `${sNumber.length ? `${sNumber[0].long_name}, ` : ''} ${
            add.length ? `${add[0].long_name}` : ''
          }`,
        );

        setVisibleLocationModal(false);
      }}>
      <Text style={styles.cityList}>{item.formatted_address}</Text>
    </TouchableOpacity>
  );

  const renderCityStateCountryItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setHomeCity(item?.terms?.[0]?.value ?? '');

        setVisibleCityModal(false);
        setCityData([]);
        setLocationData([]);
      }}>
      <Text style={styles.cityList}>{item.description}</Text>
    </TouchableOpacity>
  );

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

  return (
    <>
      <TCFormProgress
        totalSteps={role === Verbs.entityTypeClub ? 3 : 2}
        curruentStep={1}
      />
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
              width={'48%'}
            />
            <TCTextField
              value={lastName}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) => setLastName(text)}
              placeholder={strings.lastName}
              width={'48%'}
            />
          </View>
        </View>
        <View>
          <TCLable title={strings.homeCity.toUpperCase()} required={true} />
          <TouchableOpacity onPress={() => setVisibleCityModal(true)}>
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
            title={strings.emailPlaceHolder.toUpperCase()}
            required={true}
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

        {location && (
          <TouchableOpacity
            onPress={() => {
              setVisibleCityModal(true);
              setCityData([]);
              setLocationData([]);
            }}>
            <TextInput
              placeholder={strings.searchByCityStateText}
              placeholderTextColor={colors.userPostTimeColor}
              style={[styles.matchFeeTxt, {marginBottom: 5}]}
              value={homeCity || ''}
              editable={false}
              pointerEvents="none"></TextInput>
          </TouchableOpacity>
        )}

        {location && (
          <TCMessageButton
            title={strings.searchAddress}
            width={120}
            alignSelf="center"
            marginTop={15}
            onPress={() => {
              setVisibleLocationModal(true);
              setCityData([]);
              setLocationData([]);
            }}
          />
        )}

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

        <Modal
          isVisible={visibleLocationModal}
          onBackdropPress={() => {
            setVisibleLocationModal(false);
            setCityData([]);
            setLocationData([]);
          }}
          onRequestClose={() => {
            setVisibleLocationModal(false);
            setCityData([]);
            setLocationData([]);
          }}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={800}
          style={{
            margin: 0,
          }}>
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height / 1.3,
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 15,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => {
                  setVisibleLocationModal(false);
                  setCityData([]);
                  setLocationData([]);
                }}>
                <Image source={images.cancelImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RBold,
                  color: colors.lightBlackColor,
                }}>
                {strings.locationTitleText}
              </Text>
              <TouchableOpacity onPress={() => {}}></TouchableOpacity>
            </View>
            <View style={styles.separatorLine} />
            <View>
              <View style={styles.sectionStyle}>
                <Image
                  source={images.searchLocation}
                  style={styles.searchImg}
                />
                <TextInput
                  testID="choose-location-input"
                  style={styles.textInput}
                  placeholder={strings.addressSearchPlaceHolder}
                  clearButtonMode="always"
                  placeholderTextColor={colors.grayColor}
                  onChangeText={(text) => setSearchText(text)}
                />
              </View>
              {locationData.length > 0 && (
                <FlatList
                  data={locationData}
                  renderItem={renderLocationItem}
                  keyExtractor={(item, index) => index.toString()}
                  onScroll={Keyboard.dismiss}
                  // ListFooterComponent={() => (
                  //   <TouchableOpacity
                  //     style={styles.listItem}
                  //     onPress={() => {
                  //       setVisibleLocationModal(false);
                  //     }}>
                  //     <Text style={styles.cityList}>
                  //       {strings.chooseCityAndDetail}
                  //     </Text>
                  //   </TouchableOpacity>
                  // )}
                />
              )}
            </View>
          </View>
        </Modal>
      </TCKeyboardView>

      <Modal
        isVisible={visibleCityModal}
        onBackdropPress={() => {
          setVisibleCityModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        onRequestClose={() => {
          setVisibleCityModal(false);
          setCityData([]);
          setLocationData([]);
        }}
        animationInTiming={300}
        animationOutTiming={800}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={800}
        style={{
          margin: 0,
        }}>
        <View
          style={{
            width: '100%',
            height: Dimensions.get('window').height / 1.1,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            left: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={styles.closeButton}
              onPress={() => {
                setVisibleCityModal(false);
                setCityData([]);
                setLocationData([]);
              }}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
              }}>
              {strings.locationTitleText}
            </Text>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <View>
            <View style={styles.sectionStyle}>
              <Image source={images.searchLocation} style={styles.searchImg} />
              <TextInput
                testID="choose-location-input"
                style={styles.textInput}
                placeholder={strings.locationPlaceholderText}
                clearButtonMode="always"
                placeholderTextColor={colors.grayColor}
                onChangeText={(text) => setSearchText(text)}
                autoCorrect={false}
              />
            </View>
            <FlatList
              data={(cityData || []).filter((obj) => obj.terms.length === 3)}
              renderItem={renderCityStateCountryItem}
              keyExtractor={(item, index) => index.toString()}
              onScroll={Keyboard.dismiss}
            />
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
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  choosePhoto: {
    position: 'absolute',
    width: 22,
    height: 22,
    bottom: 0,
    right: 0,
  },
  nextButtonStyle: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
    marginRight: 10,
  },

  matchFeeTxt: {
    alignSelf: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    fontSize: widthPercentageToDP('3.8%'),
    height: 40,

    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,

    width: widthPercentageToDP('92%'),
  },

  closeButton: {
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginLeft: 5,
    resizeMode: 'contain',
  },

  separatorLine: {
    alignSelf: 'center',
    backgroundColor: colors.grayColor,
    height: 0.5,
    width: widthPercentageToDP('100%'),
  },

  searchImg: {
    alignSelf: 'center',
    height: heightPercentageToDP('4%'),

    resizeMode: 'contain',
    width: widthPercentageToDP('4%'),
    tintColor: colors.lightBlackColor,
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: widthPercentageToDP('8%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    color: colors.blackColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: widthPercentageToDP('4.5%'),
    paddingLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: widthPercentageToDP('10%'),
    width: widthPercentageToDP('80%'),
  },
  cityList: {
    color: colors.lightBlackColor,
    fontSize: widthPercentageToDP('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    // paddingLeft: wp('1%'),
    width: widthPercentageToDP('70%'),
    margin: widthPercentageToDP('4%'),
    textAlignVertical: 'center',
  },
  notesStyle: {
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.userPostTimeColor,
    margin: 15,
  },
});
