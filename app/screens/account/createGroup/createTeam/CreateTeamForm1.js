/* eslint-disable no-param-reassign  */

import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Pressable,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';

import RNPickerSelect from 'react-native-picker-select';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import AuthContext from '../../../../auth/context';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCThinDivider from '../../../../components/TCThinDivider';

import {
  deleteConfirmation,
  getHitSlop,
  groupMemberGenderItems,
  languageList,
  showAlertWithoutTitle,
} from '../../../../utils';

import styles from './style';
import LocationModal from '../../../../components/LocationModal/LocationModal';
import TCProfileImageControl from '../../../../components/TCProfileImageControl';

import TCKeyboardView from '../../../../components/TCKeyboardView';

export default function CreateTeamForm1({navigation, route}) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [sportsSelection, setSportsSelection] = useState();

  const [teamName, setTeamName] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [city, setCity] = useState('jjl');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [visibleLocationModal, setVisibleLocationModal] = useState();

  const [currentImageSelection, setCurrentImageSelection] = useState(0);
  const [thumbnail, setThumbnail] = useState();
  const [backgroundThumbnail, setBackgroundThumbnail] = useState();
  const [gender, setGender] = useState('');
  const [minAge, setMinAge] = useState(1);
  const [maxAge, setMaxAge] = useState('99+');
  const [minAgeValue, setMinAgeValue] = React.useState([]);
  const [maxAgeValue, setMaxAgeValue] = React.useState([]);
  const [gendersSelection, setGendersSelection] = useState();

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [visibleGendersModal, setVisibleGendersModal] = useState(false);
  const [showDouble] = useState(route?.params.showDouble);
  const [doublePlayer] = useState(route?.params.double_Player);
  const [languages, setLanguages] = useState([]);
  const [getGender, setGetGender] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const selectedLanguage = [];
  const [languagesName, setLanguagesName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSport, SetSelectedSport] = useState(
    route?.params || route.params.sports,
  );
  const [parentGroupID, setParentGroupID] = useState(route.params?.grp_id);
  const [statefull, setStatefull] = useState('');

  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity>
          <Text
            style={{
              fontFamily: fonts.RMedium,
              fontSize: 16,
              marginRight: 10,
            }}
            onPress={() => {
              if (checkTeamValidations()) {
                onNextPress();
              }
            }}>
            {strings.next}
          </Text>
        </TouchableOpacity>
      ),

      headerLeft: () => (
        <TouchableWithoutFeedback
          onPress={() => {
            if (route.params?.backScreen) {
              navigation.navigate(route.params.backScreen, {
                ...route.params.backScreenParams,
              });
            } else {
              navigation.goBack();
            }
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [description, teamName, gender, languagesName, selectedSport]);

  useEffect(() => {
    if (isFocused) {
      // to get the club id if club creating the team
      if (route.params) {
        if (route.params.grp_id) {
          setParentGroupID(route.params.grp_id);
          delete route.params.grp_id;
        }

        SetSelectedSport(route?.params || route.params.sports);
      }

      setSportsSelection(
        route?.params.sport_name || route?.params.sports?.sport_name,
      );
    }
  }, [isFocused]);

  useEffect(() => {
    let languageText = '';
    if (selectedLanguages) {
      selectedLanguages.map((langItem, index) => {
        languageText = languageText + (index ? ', ' : '') + langItem;
        return null;
      });
      setLanguagesName(languageText);
    }
  }, [selectedLanguages]);

  useEffect(() => {
    const arr = [];
    for (const tempData of languageList) {
      tempData.isChecked = false;
      arr.push(tempData);
    }
    setLanguages(arr);
  }, []);

  useEffect(() => {
    if (isFocused) {
      const minAgeArray = [];
      let maxAgeArray = [];
      for (let i = 1; i <= 99; i++) {
        const dataSource = {
          label: `${i}`,
          value: i,
        };
        minAgeArray.push(dataSource);
      }
      for (let i = minAge; i <= 99; i++) {
        const dataSource = {
          label: `${i}`,
          value: i,
        };

        maxAgeArray.push(dataSource);
      }
      if (minAge === 0) {
        maxAgeArray = [];
        setMaxAge(maxAgeArray);
      }
      maxAgeArray.push({
        label: ' 99+',
        value: '99+',
      });

      minAgeArray.push({
        label: ' 99+',
        value: '99+',
      });
      setMinAgeValue(minAgeArray);
      setMaxAgeValue(maxAgeArray);
    }
  }, [minAge, isFocused]);

  const isIconCheckedOrNot = ({item, index}) => {
    languages[index].isChecked = !item.isChecked;
    setLanguages([...languages]);
  };

  const renderLanguage = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({item, index});
      }}>
      <View
        style={{
          paddingHorizontal: 40,
          paddingVertical: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.language}</Text>
        <View style={styles.checkbox}>
          {languages[index].isChecked ? (
            <Image source={images.orangeCheckBox} style={styles.checkboxImg} />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const openImagePicker = (width = 400, height = 400) => {
    let cropCircle = false;
    if (currentImageSelection === 1) {
      cropCircle = true;
    }
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: cropCircle,
    }).then((data) => {
      // 1 means profile, 0 - means background
      if (currentImageSelection === 1) {
        // setGroupProfile({ ...groupProfile, thumbnail: data.path })
        setThumbnail(data.path);
      } else {
        // setGroupProfile({ ...groupProfile, background_thumbnail: data.path })
        setBackgroundThumbnail(data.path);
      }
    });
  };

  const openCamera = (width = 400, height = 400) => {
    let cropCircle = false;
    if (currentImageSelection === 1) {
      cropCircle = true;
    }
    // check(PERMISSIONS.IOS.CAMERA)
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
                  // 1 means profile, 0 - means background
                  if (currentImageSelection === 1) {
                    // setGroupProfile({ ...groupProfile, thumbnail: data.path })
                    setThumbnail(data.path);
                  } else {
                    // setGroupProfile({ ...groupProfile, background_thumbnail: data.path })
                    setBackgroundThumbnail(data.path);
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            ImagePicker.openCamera({
              width,
              height,
              cropping: true,
              cropperCircleOverlay: cropCircle,
            })
              .then((data) => {
                // 1 means profile, 0 - means background
                if (currentImageSelection === 1) {
                  // setGroupProfile({ ...groupProfile, thumbnail: data.path })
                  setThumbnail(data.path);
                } else {
                  // setGroupProfile({ ...groupProfile, background_thumbnail: data.path })
                  setBackgroundThumbnail(data.path);
                }
              })
              .catch((e) => {
                Alert.alert(e);
              });
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;

          default:
            break;
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  const deleteImage = () => {
    if (currentImageSelection) {
      setThumbnail();
    } else {
      setBackgroundThumbnail();
    }
  };

  const handleSetLocationOptions = (locations) => {
    setCity(locations.city);
    setState(locations.state);
    setCountry(locations.country);
    setStatefull(locations.state_full);
    setHomeCity(
      [locations.city, locations.state, locations.country]
        .filter((v) => v)
        .join(', '),
    );
  };

  const onBGImageClicked = () => {
    setCurrentImageSelection(0);
    setTimeout(() => {
      if (backgroundThumbnail) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1);
  };

  const onProfileImageClicked = () => {
    setCurrentImageSelection(1);
    setTimeout(() => {
      if (thumbnail) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1);
  };

  const onApplyPress = () => {
    if (gendersSelection) {
      setTimeout(() => {
        setGender(getGender?.label);
        setVisibleGendersModal(false);
      }, 300);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderGenders = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setGendersSelection(item?.value);
        setGetGender(item);
      }}>
      <View
        style={{
          paddingHorizontal: 40,
          paddingVertical: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={[
            styles.languageList,
            {
              color:
                gendersSelection === item?.value
                  ? colors.orangeColor
                  : colors.lightBlackColor,
            },
          ]}>
          {item.label}
        </Text>
        <View style={styles.checkbox}>
          {gendersSelection === item?.value ? (
            <Image
              source={images.radioCheckYellow}
              style={styles.checkboxImg}
            />
          ) : (
            <Image source={images.radioUnselect} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const checkTeamValidations = () => {
    if (teamName === '') {
      showAlertWithoutTitle(strings.pleaseFillTeanName);
      return false;
    }
    if (homeCity === '') {
      showAlertWithoutTitle(strings.pleaseFillHomeCity);
      return false;
    }
    if (!showDouble) {
      if (gender === '') {
        showAlertWithoutTitle(strings.pleaseFillPlayerGender);
        return false;
      }
    }

    if (languagesName === '') {
      showAlertWithoutTitle(strings.pleaseSelectLanguage);
      return false;
    }

    return true;
  };

  const onNextPress = () => {
    const groupData = {
      gender: gender.toLowerCase(),
      language: selectedLanguages,
      descriptions: description,
      min_age: minAge,
      max_age: maxAge === '99+' ? 100 : maxAge,
      group_name: teamName,
      city,
      state_abbr: state,
      country,
      state: statefull,
      currency_type: authContext?.entity?.obj?.currency_type,
      sport_type: selectedSport.sport_type,
      sport: selectedSport.sport,
    };
    // if double team
    if (showDouble) {
      groupData.player1 = authContext.entity.auth.user.user_id;
      groupData.player2 = doublePlayer.user_id;

      groupData.sport_type = route.params.sports.sport_type;
      groupData.sport = route.params.sports.sport;
    }

    // if club create Team
    if (parentGroupID) {
      const tempIds = [];
      tempIds.push(parentGroupID);
      groupData.parent_groups = tempIds;
    }

    navigation.navigate('IncomingChallengeSettings', {
      groupData,
      sportName: showDouble
        ? route.params.sports.sport_name
        : selectedSport.sport_name,
      sportType: showDouble
        ? route.params.sports.sport_type
        : selectedSport.sport_type,
      sport: showDouble ? route.params.sports.sport : selectedSport.sport,
      settingObj: showDouble
        ? route.params.sports.default_setting
        : selectedSport.default_setting ?? {},
      settingType: showDouble
        ? route.params.sports.default_setting?.default_setting_key
        : selectedSport.default_setting?.default_setting_key,
      thumbnail,
      backgroundThumbnail,
      fromCreateTeam: true,
      show_Double: showDouble,
    });
  };

  return (
    <>
      <TCFormProgress totalSteps={2} curruentStep={1} />
      <TCKeyboardView>
        <ScrollView
          style={styles.mainContainer}
          showsVerticalScrollIndicator={false}>
          <TCProfileImageControl
            profileImage={thumbnail ? {uri: thumbnail} : undefined}
            profileImagePlaceholder={images.newTeamLogo}
            bgImage={
              backgroundThumbnail
                ? {uri: backgroundThumbnail}
                : images.backgroundGrayPlceholder
            }
            onPressBGImage={() => onBGImageClicked()}
            onPressProfileImage={() => onProfileImageClicked()}
            bgImageContainerStyle={{
              marginTop: 55,
              position: 'absolute',
              alignSelf: 'center',
            }}
            profileImageStyle={{
              height: 60,
              width: 60,
              marginTop: 10,
            }}
            profileCameraButtonStyle={{
              alignSelf: 'flex-start',
              justifyContent: 'center',
              height: 25,
              width: 25,
              marginRight: 6,

              borderRadius: 50,
              elevation: 0,
            }}
            profileImageButtonStyle={{
              alignSelf: 'center',
            }}
            profileImageContainerStyle={{
              marginLeft: 15,
              height: 60,
              width: 60,
            }}
            showEditButtons
          />

          <View>
            <TCLabel
              title={strings.sport.toUpperCase()}
              style={{marginTop: 25}}
              required={false}
            />
            <Text
              style={{
                marginLeft: 25,
                lineHeight: 24,
                fontSize: 16,
                fontFamily: fonts.RRegular,
                marginTop: 5,
              }}>
              {sportsSelection}
            </Text>
          </View>

          {showDouble && (
            <View>
              <TCLabel
                title={strings.player.toUpperCase()}
                style={{marginTop: 25}}
                required={false}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 6,

                  marginLeft: 25,
                  marginRight: 20,
                }}>
                <View style={[styles.topViewContainer, {flex: 0.6}]}>
                  <View style={styles.profileView}>
                    <Image
                      source={
                        doublePlayer?.thumbnail
                          ? {uri: doublePlayer?.thumbnail}
                          : images.profilePlaceHolder
                      }
                      style={styles.profileImage}
                    />
                  </View>
                  <View style={styles.topTextContainer}>
                    <Text
                      style={[styles.mediumNameText, {width: 115}]}
                      numberOfLines={1}>
                      {doublePlayer?.full_name}
                    </Text>

                    <Text style={styles.locationText} numberOfLines={1}>
                      {doublePlayer?.city}
                    </Text>
                  </View>
                </View>

                <View style={[styles.topViewContainer, {flex: 0.6}]}>
                  <View style={styles.profileView}>
                    <Image
                      source={
                        authContext.entity.obj?.thumbnail
                          ? {uri: authContext.entity.obj?.thumbnail}
                          : images.profilePlaceHolder
                      }
                      style={styles.profileImage}
                    />
                  </View>
                  <View style={styles.topTextContainer}>
                    <Text
                      style={[styles.mediumNameText, {width: 115}]}
                      numberOfLines={1}>
                      {authContext.entity.obj?.full_name}
                    </Text>

                    <Text style={styles.locationText} numberOfLines={1}>
                      {authContext.entity.obj?.city}
                    </Text>
                  </View>
                </View>

                {/* <Text> {follower.first_name} </Text> 
            <Text> {authContext.entity.obj.first_name} </Text> */}
              </View>
            </View>
          )}

          <View>
            <TCLabel
              title={strings.teamName.toUpperCase()}
              style={{marginTop: 30}}
              required={true}
            />
            <TextInput
              testID="team-name-input"
              placeholder={strings.teamName}
              style={styles.matchFeeTxt}
              maxLength={20}
              onChangeText={(text) => setTeamName(text)}
              value={teamName}
              placeholderTextColor={colors.userPostTimeColor}
            />
          </View>
          <View>
            <TCLabel
              title={strings.homeCityTitleText.toUpperCase()}
              style={{marginTop: 30}}
              required={true}
            />
            <TouchableOpacity onPress={() => setVisibleLocationModal(true)}>
              <TextInput
                placeholder={strings.searchCityPlaceholder}
                style={[styles.matchFeeTxt, {marginBottom: 5}]}
                value={homeCity}
                editable={false}
                pointerEvents="none"
                placeholderTextColor={colors.userPostTimeColor}
              />
            </TouchableOpacity>
          </View>
          {/* gender */}

          {!showDouble && (
            <>
              <TCLabel
                title={strings.playersGenderText.toUpperCase()}
                style={{marginTop: 25}}
                required={true}
              />
              <TouchableOpacity
                testID="gender-button"
                onPress={() => setVisibleGendersModal(true)}>
                <TextInput
                  style={[styles.matchFeeTxt, {marginBottom: 5}]}
                  placeholder={strings.genderTitle}
                  value={gender}
                  editable={false}
                  pointerEvents="none"
                  placeholderTextColor={colors.userPostTimeColor}
                />
              </TouchableOpacity>
            </>
          )}

          {/* age */}
          {!showDouble && (
            <>
              <TCLabel
                title={strings.playersAge}
                style={{marginTop: 25}}
                required={false}
              />
              <View
                style={{
                  flexDirection: 'row',

                  marginTop: 12,

                  alignItems: 'center',
                  marginLeft: 15,
                  marginRight: 15,
                  justifyContent: 'space-between',
                }}>
                <RNPickerSelect
                  testID="min-age-picker"
                  placeholder={{
                    label: strings.minPlaceholder,
                    value: 0,
                  }}
                  items={minAgeValue}
                  onValueChange={(value) => {
                    setMinAge(value);
                    setMaxAge(0);
                  }}
                  useNativeAndroidPickerStyle={false}
                  style={{
                    placeholder: {
                      color: colors.blackColor,
                    },
                    iconContainer: {
                      top: 0,
                      right: 0,
                    },

                    inputIOS: {
                      height: 40,
                      textAlign: 'center',
                      fontSize: wp('3.5%'),
                      paddingVertical: 12,
                      paddingHorizontal: 15,
                      width: wp('40%'),
                      color: 'black',
                      paddingRight: 30,
                      backgroundColor: colors.lightGrey,

                      borderRadius: 5,
                    },
                    inputAndroid: {
                      height: 40,
                      textAlign: 'center',
                      fontSize: wp('4%'),
                      paddingVertical: 12,
                      paddingHorizontal: 15,
                      width: wp('40%'),
                      color: 'black',

                      backgroundColor: colors.lightGrey,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#fff',
                    },
                  }}
                  value={minAge}
                  Icon={() => (
                    <Image
                      source={images.dropDownArrow}
                      style={styles.miniDownArrow}
                    />
                  )}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}>
                  -
                </Text>
                <Pressable>
                  <RNPickerSelect
                    testID="max-age-picker"
                    placeholder={{
                      label: strings.maxPlaceholder,
                      value: 0,
                    }}
                    items={maxAgeValue}
                    onValueChange={(value) => {
                      setMaxAge(value);
                    }}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      placeholder: {
                        color: colors.blackColor,
                      },
                      inputIOS: {
                        height: 40,

                        fontSize: wp('3.5%'),
                        textAlign: 'center',
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                        width: wp('40%'),
                        color: 'black',

                        backgroundColor: colors.lightGrey,

                        borderRadius: 5,
                      },
                      inputAndroid: {
                        height: 40,
                        textAlign: 'center',
                        fontSize: wp('4%'),
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                        width: wp('40%'),
                        color: 'black',
                        backgroundColor: colors.lightGrey,
                      },
                    }}
                    value={maxAge}
                    Icon={() => (
                      <Image
                        source={images.dropDownArrow}
                        style={styles.miniDownArrow}
                      />
                    )}
                  />
                </Pressable>
              </View>
            </>
          )}

          {/* languges */}

          <TCLabel
            title={strings.languages.toUpperCase()}
            style={{marginTop: 30}}
            required={true}
          />
          <TouchableOpacity onPress={toggleModal}>
            <TextInput
              style={[styles.matchFeeTxt, {marginBottom: 5}]}
              placeholder={strings.languageUsedBy}
              value={languagesName}
              editable={false}
              pointerEvents="none"
              placeholderTextColor={colors.userPostTimeColor}
            />
          </TouchableOpacity>

          {/* bio */}

          <TCLabel
            title={strings.bio.toUpperCase()}
            style={{marginTop: 30}}
            required={false}
          />

          <TextInput
            style={styles.descriptionTxt}
            onChangeText={(text) => setDescription(text)}
            value={description}
            multiline
            maxLength={1000}
            textAlignVertical={'top'}
            numberOfLines={4}
            placeholder={strings.descriptionTeamTextPlaceholder}
            placeholderTextColor={colors.userPostTimeColor}
          />

          <View style={{flex: 1}} />

          {/* location modal */}

          <LocationModal
            visibleLocationModal={visibleLocationModal}
            title={strings.homeCityTitleText}
            setVisibleLocationModalhandler={() =>
              setVisibleLocationModal(false)
            }
            onLocationSelect={handleSetLocationOptions}
            placeholder={strings.searchByCity}
          />

          {/* gender Modal */}
          <Modal
            isVisible={visibleGendersModal}
            onBackdropPress={() => setVisibleGendersModal(false)}
            onRequestClose={() => setVisibleGendersModal(false)}
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
                height: Dimensions.get('window').height / 1.065,
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
                  onPress={() => setVisibleGendersModal(false)}>
                  <Image
                    source={images.cancelImage}
                    style={[styles.closeButton, {marginTop: 6}]}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginVertical: 20,
                    fontSize: 16,
                    fontFamily: fonts.RBold,
                    color: colors.lightBlackColor,
                    marginLeft: 25,
                    marginBottom: 12,
                  }}>
                  {strings.playersGenderText}
                </Text>
                <TouchableOpacity onPress={onApplyPress}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginVertical: 20,
                      fontSize: 16,
                      fontFamily: fonts.RMedium,
                      lineHeight: 24,
                      marginBottom: 12,
                      color: gendersSelection
                        ? colors.lightBlackColor
                        : colors.userPostTimeColor,
                    }}>
                    {strings.apply}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separatorLine} />
              <FlatList
                ItemSeparatorComponent={() => <TCThinDivider />}
                data={groupMemberGenderItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderGenders}
              />
            </View>
          </Modal>

          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            onRequestClose={() => setModalVisible(false)}
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
                height: Dimensions.get('window').height / 1.065,
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
                  onPress={() => setModalVisible(false)}>
                  <Image
                    source={images.cancelImage}
                    style={[styles.closeButton, {marginTop: 6}]}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginVertical: 20,
                    fontSize: 16,
                    fontFamily: fonts.RBold,
                    color: colors.lightBlackColor,
                    marginLeft: 25,
                    marginBottom: 12,
                  }}>
                  {strings.languages}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    for (const temp of languages) {
                      if (temp.isChecked) {
                        selectedLanguage.push(temp.language);
                      }
                    }
                    setSelectedLanguages(selectedLanguage);
                    toggleModal();
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginVertical: 20,
                      fontSize: 16,
                      fontFamily: fonts.RMedium,
                      lineHeight: 24,
                      marginBottom: 12,
                    }}>
                    {strings.apply}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separatorLine} />
              <FlatList
                ItemSeparatorComponent={() => <TCThinDivider />}
                data={languages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderLanguage}
              />
            </View>
          </Modal>
          {/* language modal */}

          <ActionSheet
            ref={actionSheet}
            // title={'News Feed Post'}
            options={[strings.camera, strings.album, strings.cancelTitle]}
            cancelButtonIndex={2}
            onPress={(index) => {
              if (index === 0) {
                openCamera();
              } else if (index === 1) {
                if (currentImageSelection) {
                  openImagePicker();
                } else {
                  openImagePicker(750, 348);
                }
              }
            }}
          />

          <ActionSheet
            ref={actionSheetWithDelete}
            // title={'News Feed Post'}
            options={[
              strings.camera,
              strings.album,
              strings.deleteTitle,
              strings.cancelTitle,
            ]}
            cancelButtonIndex={3}
            destructiveButtonIndex={2}
            onPress={(index) => {
              if (index === 0) {
                openCamera();
              } else if (index === 1) {
                if (currentImageSelection) {
                  openImagePicker();
                } else {
                  openImagePicker(750, 348);
                }
              } else if (index === 2) {
                deleteConfirmation(
                  strings.appName,
                  strings.deleteConfirmationText,
                  () => deleteImage(),
                );
              }
            }}
          />
        </ScrollView>
      </TCKeyboardView>
    </>
  );
}
