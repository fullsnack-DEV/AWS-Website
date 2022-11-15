import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {useIsFocused} from '@react-navigation/native';
import TCTouchableLabel from '../../components/TCTouchableLabel';
import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import TCProfileImageControl from '../../components/TCProfileImageControl';
import {patchGroup} from '../../api/Groups';
import {getGeocoordinatesWithPlaceName} from '../../utils/location';
import {
  getHitSlop,
  widthPercentageToDP,
  getSportName,
  deleteConfirmation,
} from '../../utils';

import {
  searchLocationPlaceDetail,
  searchLocations
} from '../../api/External';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import uploadImages from '../../utils/imageAction';
import images from '../../Constants/ImagePath';
import TCKeyboardView from '../../components/TCKeyboardView';
import {getQBAccountType, QBupdateUser} from '../../utils/QuickBlox';
import TCThinDivider from '../../components/TCThinDivider';
import Verbs from '../../Constants/Verbs';

export default function EditGroupProfileScreen({navigation, route}) {
  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [currentImageSelection, setCurrentImageSelection] = useState(0);
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [backgroundImageChanged, setBackgroundImageChanged] = useState(false);
  const [groupProfile, setGroupProfile] = useState('');

  const [locationPopup, setLocationPopup] = useState(false);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [cityData, setCityData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState();
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [selectedSports, setSelectedSports] = useState([]);
  const [sportList, setSportList] = useState([]);
  const [sportsName, setSportsName] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.isEditProfileTitle
        ? strings.editprofiletitle
        : strings.profileText,
      headerLeft: () => (
        <View style={styles.backIconViewStyle}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImage} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <Text
          style={{
            marginRight: 15,
            fontSize: 16,
            fontFamily: fonts.RMedium,
            color: colors.lightBlackColor,
          }}
          onPress={() => {
            onSaveButtonClicked();
          }}>
          {strings.save}
        </Text>
      ),
    });
  }, [
    navigation,
    profileImageChanged,
    backgroundImageChanged,
    currentImageSelection,
    groupProfile,
  ]);

  useEffect(() => {
    getSports();
    getUserInformation();
  }, []);

  useEffect(() => {
    if (route.params && route.params.city) {
      setGroupProfile({
        ...groupProfile,
        location: [route.params.city, route.params.state, route.params.country].filter(v => v).join(', '),
        city: route.params.city,
        state_abbr: route.params.state,
        country: route.params.country,
      });
    }
  }, [isFocused]);

  useEffect(() => {
    getLocationData(searchText);
  }, [searchText]);

  const getLocationData = async (searchLocationText) => {
    if (searchLocationText.length >= 3) {
      searchLocations(searchLocationText).then((response) => {
        setNoData(false);
        setCityData(response.predictions);
      });
    } else {
      setNoData(true);
      setCityData([]);
    }
  };
  useEffect(() => {
    setloading(true)
    getGeocoordinatesWithPlaceName(Platform.OS)
      .then((location) => {
        const userData = {};
        userData.state = location.stateAbbr;
        userData.city = location.city;
        userData.country = location.country;
        setCurrentLocation(userData);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        // See error code charts below.
        console.log('location error', error.code, error.message);
      });
  }, []);

  useEffect(() => {
    let sportText = '';
    if (selectedSports.length > 0) {
      selectedSports.map((sportItem, index) => {
        sportText =
          sportText +
          (index ? ', ' : '') +
          getSportName(sportItem, authContext);
        return null;
      });
      setSportsName(sportText);
    } else {
      setSportsName(route?.params?.sportType);
    }
  }, [authContext, route?.params?.sportType, selectedSports]);

  const toggleModal = () => {
    setVisibleSportsModal(!visibleSportsModal);
  };

  const getSports = () => {
    let sportArr = [];

    authContext.sports.map((item) => {
      sportArr = [...sportArr, ...item.format];
      return null;
    });

    const arr = [];
    for (const tempData of sportArr) {
      const obj = {};
      obj.entity_type = tempData.entity_type;
      obj.sport = tempData.sport;
      obj.sport_type = tempData.sport_type;
      obj.isChecked = false;
      arr.push(obj);
    }
    setSportList(arr);
  };

  const renderItem = ({item, index}) => (
    <TouchableWithoutFeedback
      style={styles.listItem}
      onPress={() => {
        onSelectLocation(item);
        Keyboard.dismiss();
      }}>
      <View>
        <Text style={styles.cityList}>{cityData[index].description}</Text>
        <TCThinDivider
          width={'100%'}
          backgroundColor={colors.grayBackgroundColor}
        />
      </View>
    </TouchableWithoutFeedback>
  );

  const isIconCheckedOrNot = ({item, index}) => {
    sportList[index].isChecked = !item.isChecked;
    setSportList([...sportList]);
  };
  const renderSports = ({item, index}) => (
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
        <Text style={styles.sportList}>{getSportName(item, authContext)}</Text>
        <View style={styles.checkbox}>
          {sportList[index].isChecked ? (
            <Image source={images.orangeCheckBox} style={styles.checkboxImg} />
          ) : (
            <Image source={images.uncheckWhite} style={styles.checkboxImg} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const onSelectLocation = async (item) => {
    searchLocationPlaceDetail(item.place_id, authContext).then((response) => {
      if (response) {
        setGroupProfile({
          ...groupProfile,
          location: [item?.terms?.[0]?.value, item?.terms?.[1]?.value, item?.terms?.[2]?.value].filter(v => v).join(', '),
          city: item?.terms?.[0]?.value ?? '',
          state_abbr: item?.terms?.[1]?.value ?? '',
          country: item?.terms?.[2]?.value ?? '',
        });
      }
    });
    setLocationPopup(false);
  };

  const onSelectCurrentLocation = async () => {
    setGroupProfile({
      ...groupProfile,
      location: [currentLocation?.city, currentLocation?.state, currentLocation?.country].filter(v => v).join(', '),
      city: currentLocation.city,
      state_abbr: currentLocation.state,
      country: currentLocation.country,
    });
    setLocationPopup(false);
  };

  // Form Validation
  const checkValidation = () => {
    if (groupProfile.group_name === '') {
      Alert.alert(
        strings.appName,
        authContext.entity.role === 'club'
          ? strings.pleaseAddClubName
          : strings.pleaseAddTeamName,
      );
      return false;
    }
    if (groupProfile.location === '') {
      Alert.alert(strings.appName, strings.locationvalidation);
      return false;
    }
    return true;
  };

  // Get user information from async store
  const getUserInformation = async () => {
    const entity = authContext.entity;
    setGroupProfile({
      ...entity.obj,
      location: `${entity.obj.city}, ${entity.obj.state_abbr}, ${entity.obj.country}`,
    });
  };

  const onSaveButtonClicked = () => {
    Keyboard.dismiss();
    if (checkValidation()) {
      setloading(true);
      setGroupProfile({
        ...groupProfile,
        sports_string: sportsName,
      });
      const userProfile = {...groupProfile};
      if (profileImageChanged || backgroundImageChanged) {
        const imageArray = [];
        if (profileImageChanged) {
          imageArray.push({path: groupProfile.thumbnail});
        }
        if (backgroundImageChanged) {
          imageArray.push({path: groupProfile.background_thumbnail});
        }
        uploadImages(imageArray, authContext)
          .then((responses) => {
            const attachments = responses.map((item) => ({
              type: 'image',
              url: item.fullImage,
              thumbnail: item.thumbnail,
            }));
            if (profileImageChanged) {
              setGroupProfile({
                ...groupProfile,
                thumbnail: attachments[0].thumbnail,
                full_image: attachments[0].url,
              });
              setProfileImageChanged(false);
              userProfile.full_image = attachments[0].thumbnail;
              userProfile.thumbnail = attachments[0].url;
            }

            if (backgroundImageChanged) {
              let bgInfo = attachments[0];
              if (attachments.length > 1) {
                bgInfo = attachments[1];
              }
              setGroupProfile({
                ...groupProfile,
                background_thumbnail: bgInfo.thumbnail,
                background_full_image: bgInfo.url,
              });
              setBackgroundImageChanged(false);
              userProfile.background_full_image = bgInfo.url;
              userProfile.background_thumbnail = bgInfo.thumbnail;
            }
            callUpdateUserAPI(userProfile, groupProfile.group_id);
          })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert(strings.appName, e.messages);
            }, 0.1);
          })
          .finally(() => {
            setloading(false);
          });
      } else {
        callUpdateUserAPI(userProfile, groupProfile.group_id);
      }
    }
  };

  const callUpdateUserAPI = (userProfile, paramGroupID) => {
    setloading(true);
    patchGroup(paramGroupID, userProfile, authContext)
      .then((response) => {
        // entity.auth.user = response.payload;
        const entity_id = [
          Verbs.entityTypeUser,
          Verbs.entityTypePlayer,
        ]?.includes(response?.payload?.entity_type)
          ? response?.payload?.user_id
          : response?.payload?.group_id;
        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(
          entity_id,
          response?.payload,
          accountType,
          response.payload,
          authContext,
        )
          .then(() => {
            setloading(false);
            navigation.goBack();
          })
          .catch((error) => {
            console.log('QB error : ', error);

            setloading(false);
            navigation.goBack();
          });
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.appName, error.message);
        }, 0.1);
      });
  };

  const onLocationClicked = async () => {
    // navigation.navigate('SearchLocationScreen', {
    //   comeFrom: 'EditGroupProfileScreen',
    // });
    setLocationPopup(true);
  };

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
        setGroupProfile({...groupProfile, thumbnail: data.path});
        setProfileImageChanged(true);
      } else {
        setGroupProfile({...groupProfile, background_thumbnail: data.path});
        setBackgroundImageChanged(true);
      }
    });
  };

  const deleteImage = () => {
    if (currentImageSelection) {
      // 1 means profile image
      setGroupProfile({...groupProfile, thumbnail: '', full_image: ''});
      setProfileImageChanged(false);
    } else {
      // 0 means profile image
      setGroupProfile({
        ...groupProfile,
        background_thumbnail: '',
        background_full_image: '',
      });
      setBackgroundImageChanged(false);
    }
  };

  const openCamera = (width = 400, height = 400) => {
    ImagePicker.openCamera({
      width,
      height,
      cropping: true,
    }).then((data) => {
      // 1 means profile, 0 - means background
      if (currentImageSelection === 1) {
        setGroupProfile({...groupProfile, thumbnail: data.path});
        setProfileImageChanged(true);
      } else {
        setGroupProfile({...groupProfile, background_thumbnail: data.path});
        setBackgroundImageChanged(true);
      }
    });
  };

  const onBGImageClicked = () => {
    setCurrentImageSelection(0);
    setTimeout(() => {
      if (groupProfile.background_thumbnail) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1);
  };

  const onProfileImageClicked = () => {
    setCurrentImageSelection(1);
    setTimeout(() => {
      if (groupProfile.thumbnail) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1);
  };

  return (
    <TCKeyboardView>
      <>
        <ActionSheet
          ref={actionSheet}
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

        <ScrollView style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          <TCProfileImageControl
            profileImage={
              groupProfile.thumbnail ? {uri: groupProfile.thumbnail} : undefined
            }
            profileImagePlaceholder={
              route?.params?.role === Verbs.entityTypeClub
                ? images.teamGreenPH
                : images.teamGreenPH
            }
            bgImage={
              groupProfile.background_thumbnail
                ? {uri: groupProfile.background_thumbnail}
                : undefined
            }
            onPressBGImage={() => onBGImageClicked()}
            onPressProfileImage={() => onProfileImageClicked()}
            showEditButtons
          />
          <View>
            <TCLabel
              title={route.params.nameTitle}
              style={{marginTop: 37}}
              required={true}
            />
            <TCTextField
              placeholder={route.params.placeholder}
              onChangeText={(text) =>
                setGroupProfile({...groupProfile, group_name: text})
              }
              value={groupProfile.group_name}
              style={{
                marginTop: 5,
                backgroundColor: colors.textFieldBackground,
              }}
            />
          </View>
          <View>
            <TCLabel
              title={strings.currentCity}
              required={true}
              style={{marginTop: 31}}
            />
            <TCTouchableLabel
              title={groupProfile.location}
              onPress={() => onLocationClicked()}
              placeholder={strings.searchCityPlaceholder}
              showNextArrow={true}
              style={{
                marginTop: 5,
                backgroundColor: colors.textFieldBackground,
              }}
            />
          </View>

          {authContext.entity.role === Verbs.entityTypeClub && (
            <View>
              <TCLabel
                title={strings.sportsEventsTitle}
                style={{marginTop: 31}}
                required={true}
              />
              {/* <TCTextField
                placeholder={strings.selectSportPlaceholder}
                // onChangeText={(text) =>
                //   setGroupProfile({...groupProfile, group_name: text})
                // }
                value={route?.params?.sportType}
                style={{marginTop: 5}}
              /> */}
              <TouchableOpacity
                style={styles.languageView}
                onPress={toggleModal}>
                <Text
                  style={
                    sportsName
                      ? styles.languageText
                      : styles.languagePlaceholderText
                  }
                  numberOfLines={50}>
                  {sportsName || strings.sportsEventsTitle}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {authContext.entity.role === Verbs.entityTypeTeam && (
            <View>
              <TCLabel
                title={strings.sportsEventsTitle}
                style={{marginTop: 31}}
              />
              <Text style={styles.sport}>{route?.params?.sportType}</Text>
            </View>
          )}

          <View>
            <TCLabel title={strings.slogan} style={{marginTop: 31}} />
            <TCTextField
              placeholder={
                authContext.entity.role === Verbs.entityTypeClub
                  ? strings.writeClubSlogan
                  : strings.writeTeamSlogan
              }
              onChangeText={(text) =>
                setGroupProfile({...groupProfile, bio: text})
              }
              multiline
              maxLength={150}
              value={groupProfile.bio}
              height={120}
              style={{
                marginTop: 5,
                backgroundColor: colors.textFieldBackground,
              }}
            />
          </View>
        </ScrollView>
        <Modal
          onBackdropPress={() => setLocationPopup(false)}
          isVisible={locationPopup}
          animationInTiming={300}
          animationOutTiming={800}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={800}
          style={{
            margin: 0,
          }}>
          <View
            style={[
              styles.bottomPopupContainer,
              {height: Dimensions.get('window').height - 50},
            ]}>
            <View style={styles.topHeaderContainer}>
              <TouchableOpacity
                hitSlop={getHitSlop(15)}
                style={styles.closeButton}
                onPress={() => {
                  setLocationPopup(false);
                }}>
                <Image source={images.crossImage} style={styles.closeButton} />
              </TouchableOpacity>
              <Text style={styles.moreText}>Home City</Text>
            </View>
            <TCThinDivider
              width={'100%'}
              marginBottom={15}
              backgroundColor={colors.thinDividerColor}
            />
            <View style={styles.sectionStyle}>
              <TextInput
                // Indiër - For Test
                value={searchText}
                autoCorrect={false}
                spellCheck={false}
                style={styles.textInput}
                placeholder={strings.searchByCity}
                clearButtonMode="always"
                placeholderTextColor={colors.userPostTimeColor}
                onChangeText={(text) => setSearchText(text)}
              />
            </View>
            {noData && searchText?.length > 0 && (
              <Text style={styles.noDataText}>{strings.enter3CharText}</Text>
            )}
            {noData && searchText?.length === 0 && (
              <View style={{flex: 1}}>
                <TouchableWithoutFeedback
                  style={styles.listItem}
                  onPress={() => onSelectCurrentLocation()}>
                  <View>
                    <Text style={[styles.cityList, {marginBottom: 3}]}>
                      {currentLocation?.city}, {currentLocation?.state},{' '}
                      {currentLocation?.country}
                    </Text>
                    <Text style={styles.curruentLocationText}>
                      {strings.currentLocationText}
                    </Text>

                    <TCThinDivider
                      width={'100%'}
                      backgroundColor={colors.grayBackgroundColor}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}
            {cityData.length > 0 && (
              <FlatList
                data={cityData}
                renderItem={renderItem}
                keyExtractor={(index) => index.toString()}
                keyboardShouldPersistTaps="always"
              />
            )}
          </View>
        </Modal>
        <Modal
          isVisible={visibleSportsModal}
          onBackdropPress={() => setVisibleSportsModal(false)}
          onRequestClose={() => setVisibleSportsModal(false)}
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
                style={{...styles.closeButton, left: 0}}
                onPress={() => setVisibleSportsModal(false)}>
                <Image
                  source={images.crossImage}
                  style={{...styles.closeButton, left: 0}}
                />
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  marginVertical: 20,
                  fontSize: 16,
                  fontFamily: fonts.RBold,
                  color: colors.lightBlackColor,
                }}>
                {strings.sportsEventsTitle}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const filterChecked = sportList.filter(
                    (obj) => obj.isChecked,
                  );
                  setSelectedSports(filterChecked);
                  toggleModal();
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    marginVertical: 20,
                    fontSize: 16,
                    fontFamily: fonts.RRegular,
                    color: colors.themeColor,
                  }}>
                  {strings.apply}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.separatorLine} />
            <FlatList
              ItemSeparatorComponent={() => <TCThinDivider />}
              data={sportList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSports}
            />
          </View>
        </Modal>
      </>
    </TCKeyboardView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  backIconViewStyle: {
    justifyContent: 'center',
    width: 30,
    marginLeft: 15,
  },
  backImage: {
    height: 20,
    tintColor: colors.lightBlackColor,
    width: 10,
  },
  sport: {
    color: colors.lightBlackColor,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    top: 5,
  },
  bottomPopupContainer: {
    flex: 1,
    // paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    // marginTop: Platform.OS === 'ios' ? 50 : 50,
    paddingBottom: Platform.OS === 'ios' ? hp(8) : 0,
    marginTop: Platform.OS === 'ios' ? hp(7) : 0,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // position: 'absolute',
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
  topHeaderContainer: {
    height: 60,
    // justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 0,
  },
  closeButton: {
    alignSelf: 'center',
    width: 25,
    height: 25,
    resizeMode: 'contain',
    left: 5,
  },

  moreText: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: widthPercentageToDP('36%'),
  },
  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 25,

    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    margin: wp('4%'),
    paddingLeft: 17,
    paddingRight: 5,

    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: wp('10%'),
    width: wp('80%'),
  },
  cityList: {
    color: colors.lightBlackColor,
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    textAlignVertical: 'center',
  },
  curruentLocationText: {
    color: colors.userPostTimeColor,
    fontSize: wp('3%'),
    textAlign: 'left',
    fontFamily: fonts.RRegular,

    // paddingLeft: wp('1%'),
    width: wp('70%'),
    margin: wp('4%'),
    marginTop: wp('0%'),
    textAlignVertical: 'center',
  },
  textInput: {
    color: colors.userPostTimeColor,
    flex: 1,
    fontFamily: fonts.RRegular,
    fontSize: wp('4.5%'),
    paddingLeft: 10,
  },
  noDataText: {
    alignSelf: 'center',
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
    marginTop: hp('1%'),

    textAlign: 'center',
    width: wp('90%'),
  },
  languageView: {
    alignSelf: 'center',
    backgroundColor: colors.textFieldBackground,
    borderRadius: 5,
    color: 'black',
    elevation: 3,
    flexDirection: 'row',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginTop: 12,
    paddingHorizontal: 15,
    paddingRight: 30,
    paddingVertical: 12,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,

    width: wp('92%'),
  },
  languageText: {
    backgroundColor: colors.textFieldBackground,
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  languagePlaceholderText: {
    backgroundColor: colors.textFieldBackground,
    color: colors.userPostTimeColor,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  checkboxImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  sportList: {
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    fontSize: wp('4%'),
  },
});
