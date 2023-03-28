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
  SafeAreaView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {getUserDoubleTeamFollower} from '../../../../api/Users';
import AuthContext from '../../../../auth/context';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCThinDivider from '../../../../components/TCThinDivider';
import TCFollowerList from '../../../../components/TCFollowerList';
import {
  deleteConfirmation,
  getHitSlop,
  groupMemberGenderItems,
  languageList,
  showAlertWithoutTitle,
} from '../../../../utils';
import Verbs from '../../../../Constants/Verbs';
import styles from './style';
import LocationModal from '../../../../components/LocationModal/LocationModal';
import TCProfileImageControl from '../../../../components/TCProfileImageControl';

export default function CreateTeamForm1({navigation, route}) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [sportsSelection, setSportsSelection] = useState();

  const [followersData, setFollowersData] = useState();
  const [parentGroupID, setParentGroupID] = useState();
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
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [minAgeValue, setMinAgeValue] = React.useState([]);
  const [maxAgeValue, setMaxAgeValue] = React.useState([]);
  const [gendersSelection, setGendersSelection] = useState();
  const [followersSelection, setFollowersSelection] = useState();
  const [follower, setFollower] = useState();

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [visibleGendersModal, setVisibleGendersModal] = useState(false);
  const [visibleFollowersModal, setVisibleFollowersModal] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [getGender, setGetGender] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const selectedLanguage = [];
  const [languagesName, setLanguagesName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSport, SetSelectedSport] = useState(route?.params);
  const [selectedPlayer, setSelectedPlayer] = useState();

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
                // if (parentGroupID) {
                //   const tempIds = [];
                //   tempIds.push(parentGroupID);
                //   obj.parent_groups = tempIds;
                // }

                console.log(parentGroupID, selectedPlayer);

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
            navigation.goBack();
          }}>
          <Image source={images.backArrow} style={styles.backArrowStyle} />
        </TouchableWithoutFeedback>
      ),
    });
  }, [description, teamName, gender, languagesName]);

  useEffect(() => {
    if (isFocused) {
      SetSelectedSport(route?.params);

      if (
        route?.params.sport_type === Verbs.doubleSport &&
        authContext?.entity?.role ===
          (Verbs.entityTypeUser || Verbs.entityTypePlayer)
      ) {
        getSportFollowers();
        setVisibleFollowersModal(true);
      }

      setSportsSelection(route?.params.sport_name);
      if (route?.params?.clubObject) {
        setParentGroupID(route.params?.clubObject.group_id);
      }
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
      for (let i = 1; i <= 120; i++) {
        const dataSource = {
          label: `${i}`,
          value: i,
        };
        minAgeArray.push(dataSource);
      }
      for (let i = minAge; i <= 120; i++) {
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
      setMinAgeValue(minAgeArray);
      setMaxAgeValue(maxAgeArray);
    }
  }, [minAge, isFocused]);

  const getSportFollowers = () => {
    getUserDoubleTeamFollower(
      selectedSport.sport,
      selectedSport.sport_type,
      authContext,
    )
      .then((res) => {
        setFollowersData(res?.payload);
      })
      .catch((e) => {
        Alert.alert(strings.alertmessagetitle, e.message);
      });
  };

  const isIconCheckedOrNot = ({item, index}) => {
    languages[index].isChecked = !item.isChecked;
    setLanguages([...languages]);
  };

  const onSelectPlayerNextclick = () => {
    setSelectedPlayer(follower);
    setVisibleFollowersModal(false);
  };

  const renderFollowers = ({item}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        setFollowersSelection(item.user_id);

        setFollower(item);
      }}>
      <View
        style={{
          // padding: 20,
          paddingVertical: 15,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          // backgroundColor: 'red',
          marginLeft: 20,
          marginRight: 30,
        }}>
        <TCFollowerList
          type={'medium'}
          name={item.full_name}
          location={item.city}
          image={
            item?.thumbnail ? {uri: item?.thumbnail} : images.profilePlaceHolder
          }
        />
        <View style={styles.checkbox}>
          {followersSelection === item.user_id ? (
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

  const renderLanguage = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        isIconCheckedOrNot({item, index});
      }}>
      <View
        style={{
          padding: 20,
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
      // 1 means profile image
      // setGroupProfile({ ...groupProfile, thumbnail: '', full_image: '' })
      setThumbnail();
    } else {
      // 0 means profile image
      // setGroupProfile({ ...groupProfile, background_thumbnail: '', background_full_image: '' })
      setBackgroundThumbnail();
    }
  };

  // const nextOnPress = () => {
  //   const obj = {
  //     sport: sportsSelection.sport,
  //     sport_type: sportsSelection.sport_type,
  //     group_name: teamName,
  //     city,
  //     state_abbr: state,
  //     country,
  //     currency_type: authContext?.entity?.obj?.currency_type,
  //   };
  //   if (parentGroupID) {
  //     const tempIds = [];
  //     tempIds.push(parentGroupID);
  //     obj.parent_groups = tempIds;
  //   }

  //   if (
  //     sportsSelection.sport === Verbs.tennisSport &&
  //     sportsSelection.sport_type === Verbs.doubleSport &&
  //     authContext?.entity?.role ===
  //       (Verbs.entityTypeUser || Verbs.entityTypePlayer)
  //   ) {
  //     if (followersData?.length > 0) {
  //       navigation.navigate('CreateTeamForm2', {
  //         followersList: followersData,
  //         createTeamForm1: {
  //           ...obj,
  //         },
  //       });
  //     } else {
  //       Alert.alert(strings.noFollowersTocreateTeam);
  //     }
  //   } else {
  //     navigation.navigate('CreateTeamForm2', {
  //       createTeamForm1: {
  //         ...obj,
  //       },
  //     });
  //   }
  // };

  const handleSetLocationOptions = (locations) => {
    setCity(locations.city);
    setState(locations.state);
    setCountry(locations.country);
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
    setTimeout(() => {
      setGender(getGender?.label);
      setVisibleGendersModal(false);
    }, 300);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderGenders = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setGendersSelection(item?.value);
        setGetGender(item);
        // setTimeout(() => {
        //   setGender(item?.label);
        //   setVisibleGendersModal(false);
        // }, 300);
      }}>
      <View
        style={{
          paddingHorizontal: 40,
          paddingVertical: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.languageList}>{item.label}</Text>
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
    if (city === '') {
      showAlertWithoutTitle(strings.pleaseFillHomeCity);
      return false;
    }
    if (gender === '') {
      showAlertWithoutTitle(strings.pleaseFillPlayerGender);
      return false;
    }

    if (languagesName === '') {
      showAlertWithoutTitle(strings.pleaseSelectLanguage);
      return false;
    }

    return true;
  };

  const onNextPress = () => {
    // navgaite with all the paramss
    navigation.navigate('CreateTeamForm2', {
      teamData: {
        gender: gender.toLowerCase(),
        language: selectedLanguages,
        descriptions: description,
        min_age: minAge,
        max_age: maxAge,
        group_name: teamName,
        city,
        state_abbr: state,
        country,
        currency_type: authContext?.entity?.obj?.currency_type,
        sport_Type: selectedSport.sport_type,
        sport: selectedSport.sport,
      },
      sportName: selectedSport.sport_name,
      sportType: selectedSport.sport_type,
      sport: selectedSport.sport,
      settingObj: selectedSport.default_setting ?? {},
      settingType: selectedSport.default_setting?.default_setting_key,
      thumbnail,
      backgroundThumbnail,
    });
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={2} />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <TCProfileImageControl
          profileImage={thumbnail ? {uri: thumbnail} : undefined}
          profileImagePlaceholder={images.teamPlaceholder}
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
            marginTop: 30,
            alignSelf: 'flex-start',
            marginLeft: 15,
            borderWidth: 0,

            borderRadius: 50,

            alignItems: 'center',
            height: 70,
            padding: 0,
            width: 70,
            shadowColor: colors.whiteColor,
            elevation: 0,
          }}
          profileCameraButtonStyle={{
            alignSelf: 'flex-start',
            justifyContent: 'center',
            height: 25,
            width: 25,

            borderRadius: 50,
            elevation: 0,
          }}
          profileImageButtonStyle={{
            alignSelf: 'center',
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

        {route?.params.sport_type === Verbs.doubleSport &&
          authContext?.entity?.role ===
            (Verbs.entityTypeUser || Verbs.entityTypePlayer) && (
            <View>
              <TCLabel
                title={strings.player.toUpperCase()}
                style={{marginTop: 25}}
                required={false}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 6,
                  marginLeft: 24,
                }}>
                <View style={[styles.topViewContainer, {marginLeft: 24}]}>
                  <View style={styles.profileView}>
                    <Image
                      source={
                        follower?.thumbnail
                          ? {uri: follower?.thumbnail}
                          : images.profilePlaceHolder
                      }
                      style={styles.profileImage}
                    />
                  </View>
                  <View style={styles.topTextContainer}>
                    <Text style={styles.mediumNameText} numberOfLines={1}>
                      {follower?.full_name}
                    </Text>

                    <Text style={styles.locationText} numberOfLines={1}>
                      {follower?.city}
                    </Text>
                  </View>
                </View>

                <View style={styles.topViewContainer}>
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
                    <Text style={styles.mediumNameText} numberOfLines={1}>
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
            style={{marginTop: 25}}
            required={true}
          />
          <TextInput
            testID="team-name-input"
            placeholder={strings.teamName}
            style={styles.matchFeeTxt}
            maxLength={20}
            onChangeText={(text) => setTeamName(text)}
            value={teamName}
          />
        </View>
        <View>
          <TCLabel
            title={strings.homeCityTitleText.toUpperCase()}
            style={{marginTop: 25}}
            required={true}
          />
          <TouchableOpacity onPress={() => setVisibleLocationModal(true)}>
            <TextInput
              placeholder={strings.searchCityPlaceholder}
              style={[styles.matchFeeTxt, {marginBottom: 5}]}
              value={homeCity}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
        </View>
        {/* gender */}

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
          />
        </TouchableOpacity>

        {/* age */}

        <TCLabel
          title={strings.age.toUpperCase()}
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
            }}
            useNativeAndroidPickerStyle={false}
            style={{
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
        </View>

        {/* languges */}

        <TCLabel
          title={strings.languages.toUpperCase()}
          style={{marginTop: 25}}
          required={true}
        />
        <TouchableOpacity onPress={toggleModal}>
          <TextInput
            style={[styles.matchFeeTxt, {marginBottom: 5}]}
            placeholder={strings.addLanguageText}
            value={languagesName}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        {/* bio */}

        <TCLabel
          title={strings.bio.toUpperCase()}
          style={{marginTop: 25}}
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
        />

        <View style={{flex: 1}} />
      </ScrollView>
      {/* next button */}
      <SafeAreaView>
        {/* <TCGradientButton
          // isDisabled={!sportsSelection || teamName === '' || homeCity === ''}
          title={strings.nextTitle}
          style={{marginBottom: 5}}
          onPress={nextOnPress}
        /> */}
      </SafeAreaView>

      {/* location modal */}

      <LocationModal
        visibleLocationModal={visibleLocationModal}
        title={strings.homeCityTitleText}
        setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
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
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
                marginLeft: 25,
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

      <Modal
        isVisible={visibleFollowersModal}
        onBackdropPress={() => setVisibleFollowersModal(false)}
        onRequestClose={() => setVisibleFollowersModal(false)}
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
            height: Dimensions.get('window').height / 1.059,
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
              onPress={() => navigation.goBack()}>
              <Image source={images.backArrow} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
                marginLeft: 25,
              }}>
              {strings.createTeamText}
            </Text>
            <TouchableOpacity onPress={() => onSelectPlayerNextclick()}>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RMedium,
                  color:
                    follower === ''
                      ? colors.userPostTimeColor
                      : colors.blackColor,
                }}>
                {strings.next}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />

          <Text
            style={{
              lineHeight: 24,
              fontSize: 20,
              fontFamily: fonts.RMedium,
              marginLeft: 30,
              marginRight: 33,
              marginTop: 24,
              marginBottom: 15,
            }}>
            {strings.whoDoYouwantToCreateTeamWith}
          </Text>

          <FlatList
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={followersData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFollowers}
          />
        </View>
      </Modal>
    </>
  );
}
