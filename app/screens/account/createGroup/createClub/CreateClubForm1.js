/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  Alert,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import {useIsFocused} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../../../auth/context';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import colors from '../../../../Constants/Colors';
import fonts from '../../../../Constants/Fonts';

import TCLabel from '../../../../components/TCLabel';
import TCThinDivider from '../../../../components/TCThinDivider';
import {
  deleteConfirmation,
  getHitSlop,
  getSportName,
  showAlertWithoutTitle,
} from '../../../../utils';

import styles from './style';
import LocationModal from '../../../../components/LocationModal/LocationModal';
import TCProfileImageControl from '../../../../components/TCProfileImageControl';

import Verbs from '../../../../Constants/Verbs';

import {createGroup} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';
import ActivityLoader from '../../../../components/loader/ActivityLoader';

export default function CreateClubForm1({navigation}) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [clubName, setClubName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [sportList, setSportList] = useState([]);
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);
  const [selectedSports, setSelectedSports] = useState([]);
  const [sportsName, setSportsName] = useState('');
  const [description, setDescription] = useState('');
  const [currentImageSelection, setCurrentImageSelection] = useState(0);
  const [backgroundThumbnail, setBackgroundThumbnail] = useState();

  const [thumbnail, setThumbnail] = useState();
  const [showSwitchScreen, setShowSwitchScreen] = useState(false);
  const actionSheet = useRef();

  const actionSheetWithDelete = useRef();

  const animProgress = React.useState(new Animated.Value(0))[0];

  useEffect(() => {
    getSports();
  }, [isFocused]);

  const getSports = () => {
    let sportArr = [];

    authContext.sports.map((item) => {
      sportArr = [...sportArr, ...item.format];
      return null;
    });

    console.log(sportArr, 'array');

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

  // useEffect(() => {
  //   const sportArr = getExcludedSportsList(authContext, selectedMenuOptionType);
  //   setSportList([...sportArr]);
  // }, [authContext, selectedMenuOptionType]);

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
    }
  }, [authContext, selectedSports, visibleSportsModal]);

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
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 40,
          paddingVertical: 20,
        }}>
        <Text style={styles.languageList}>
          {getSportName(item, authContext)}
        </Text>
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

  const toggleModal = () => {
    setVisibleSportsModal(!visibleSportsModal);
  };

  const checkClubValidations = useCallback(() => {
    if (clubName === '') {
      showAlertWithoutTitle('clubname');
      return false;
    }
    if (location === '') {
      showAlertWithoutTitle(strings.homeCityCannotBlack);
      return false;
    }
    if (sportList.length < 0) {
      showAlertWithoutTitle('sport list');
      return false;
    }

    return true;
  }, [clubName, location, sportList, description]);

  const onNextPressed = async () => {
    setShowSwitchScreen(true);
    onANimate(20);

    const newArray = selectedSports.map((obj) => {
      delete obj.isChecked;
      delete obj.entity_type;
      return obj;
    });

    const bodyParams = {
      sports: newArray, // Object of sport
      sports_string: sportsName,
      group_name: clubName,
      city,
      state_abbr: state,
      country,
      descriptions: description,
      entity_type: Verbs.entityTypeClub,
    };

    console.log(sportsName, 'From sport');

    if (thumbnail) {
      bodyParams.thumbnail = thumbnail;
    }
    if (backgroundThumbnail) {
      bodyParams.background_thumbnail = backgroundThumbnail;
    }

    console.log('bodyPARAMS:: ', bodyParams);
    const entity = authContext.entity;

    if (bodyParams?.thumbnail || bodyParams?.background_thumbnail) {
      const imageArray = [];
      if (bodyParams?.thumbnail) {
        imageArray.push({path: bodyParams?.thumbnail});
      }
      if (bodyParams?.background_thumbnail) {
        imageArray.push({path: bodyParams?.background_thumbnail});
      }
      uploadImages(imageArray, authContext)
        .then((responses) => {
          const attachments = responses.map((item) => ({
            type: 'image',
            url: item.fullImage,
            thumbnail: item.thumbnail,
          }));
          if (bodyParams?.thumbnail) {
            bodyParams.thumbnail = attachments[0].thumbnail;
            bodyParams.full_image = attachments[0].url;
          }

          if (bodyParams?.background_thumbnail) {
            let bgInfo = attachments[0];
            if (attachments.length > 1) {
              bgInfo = attachments[1];
            }
            bodyParams.background_thumbnail = bgInfo.thumbnail;
            bodyParams.background_full_image = bgInfo.url;
          }

          createGroup(
            bodyParams,
            entity.role === Verbs.entityTypeTeam && entity.uid,
            entity.role === Verbs.entityTypeTeam && Verbs.entityTypeTeam,
            authContext,
          )
            .then((response) => {
              setloading(false);

              navigation.push('HomeScreen', {
                uid: response.payload.group_id,
                role: response.payload.entity_type,
                backButtonVisible: false,
                menuBtnVisible: false,
                isEntityCreated: true,
                groupName: response.payload.group_name,
                entityObj: response.payload,
              });

              setShowSwitchScreen(false);
            })
            .catch((e) => {
              setloading(false);
              setShowSwitchScreen(false);
              setTimeout(() => {
                Alert.alert(strings.alertmessagetitle, e.message);
              }, 10);
            });
        })
        .catch((e) => {
          setTimeout(() => {
            Alert.alert(strings.appName, e.messages);
          }, 0.1);
        });
    } else {
      onANimate(100);
      createGroup(
        bodyParams,
        // entity.uid,
        // entity.role === 'team' ? 'team' : 'user',
        entity.role === Verbs.entityTypeTeam && entity.uid,
        entity.role === Verbs.entityTypeTeam && Verbs.entityTypeTeam,
        authContext,
      )
        .then((response) => {
          setloading(false);

          navigation.push('HomeScreen', {
            uid: response.payload.group_id,
            role: response.payload.entity_type,
            backButtonVisible: false,
            menuBtnVisible: false,
            isEntityCreated: true,
            groupName: response.payload.group_name,
            entityObj: response.payload,
          });

          setShowSwitchScreen(false);
        })
        .catch((e) => {
          setloading(false);
          setShowSwitchScreen(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  const onANimate = (val) => {
    Animated.timing(animProgress, {
      useNativeDriver: false,
      toValue: val,
      duration: 800,
    }).start();
  };

  const handleSetLocationOptions = (locations) => {
    setCity(locations.city);
    setState(locations.state);
    setCountry(locations.country);
    setLocation(
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
              if (checkClubValidations()) {
                // Alert.alert('Pressed');
                onNextPressed();
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
  }, [
    clubName,
    description,
    location,
    sportList,
    sportsName,
    visibleSportsModal,
  ]);

  // for next press

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

  const deleteImage = () => {
    if (currentImageSelection === 1) {
      // 1 means profile image
      // setGroupProfile({ ...groupProfile, thumbnail: '', full_image: '' })
      setThumbnail();
    } else {
      // 0 means profile image
      // setGroupProfile({ ...groupProfile, background_thumbnail: '', background_full_image: '' })
      setBackgroundThumbnail();
    }
  };
  const openCamera = (width = 400, height = 400) => {
    // check(PERMISSIONS.IOS.CAMERA)
    check(
      Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      }),
    ).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            'This feature is not available (on this device / in this context)',
          );
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
              .catch(() => {});
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
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    });
  };

  const animWidthPrecent = animProgress.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['0%', '50%', '100%'],
  });

  const placeHolder = images.clubPlaceholderSmall;

  return (
    <>
      {showSwitchScreen && (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.whiteColor,
            justifyContent: 'center',
            alignItems: 'center',
            ...StyleSheet.absoluteFillObject,
            zIndex: 10,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.whiteColor,
              opacity: 0.8,
              justifyContent: 'center',
              alignItems: 'center',
              ...StyleSheet.absoluteFillObject,
              marginTop: 300,
              zIndex: 1000,
            }}>
            <ActivityLoader visible={false} />
            <Pressable
              style={styles.profileImageContainer}
              onPress={() => onANimate(56)}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',

                  borderRadius: 100,
                  alignSelf: 'center',
                  width: 60,
                  height: 60,
                  borderWidth: 1,
                  borderColor: '#DDDDDD',
                }}>
                <View>
                  <Image
                    source={images.clubPatch}
                    style={{
                      height: 15,
                      width: 15,
                      resizeMode: 'cover',
                      position: 'absolute',
                      left: 10,
                      top: 45,
                    }}
                  />
                </View>
                <Image
                  source={placeHolder}
                  style={{
                    ...styles.profileImg,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    marginTop: 5,
                  }}
                />
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                  }}>
                  <Text
                    style={{
                      marginTop: -5,
                      textAlign: 'center',
                      color: colors.whiteColor,
                      fontFamily: fonts.RBold,
                      fontSize: 16,
                    }}>
                    {clubName.charAt(0)}
                  </Text>
                </View>
              </View>
            </Pressable>
            <View
              style={{
                marginTop: 15,
              }}>
              <Text
                style={{
                  lineHeight: 24,
                  fontFamily: fonts.RMedium,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Switching to
              </Text>
              <Text
                style={{
                  lineHeight: 24,
                  fontFamily: fonts.RBold,
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                {clubName}
              </Text>
            </View>

            <Animated.View
              style={{
                width: 135,
                height: 5,
                backgroundColor: '#F2F2F2',
                borderRadius: 20,

                marginTop: 279,
              }}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: animWidthPrecent,
                  },
                ]}>
                <LinearGradient
                  style={styles.progressBar}
                  colors={['rgba(170, 216, 64, 0.6)', 'rgba(0, 193, 104, 0.6)']}
                  start={{x: 0, y: 0.5}}
                  end={{x: 1, y: 0.5}}></LinearGradient>
              </Animated.View>
            </Animated.View>
          </View>
          {/* PRogree Bar */}
        </View>
      )}

      {/* <TCFormProgress totalSteps={3} curruentStep={2} /> */}

      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />

        <View>
          <TCProfileImageControl
            profileImage={thumbnail ? {uri: thumbnail} : images.clubPlaceholder}
            profileImagePlaceholder={images.clubPlaceholder}
            bgImage={
              backgroundThumbnail ? {uri: backgroundThumbnail} : undefined
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

          <View style={[styles.fieldView, {marginTop: 25}]}>
            <TCLabel
              required={true}
              title={strings.clubNameCaps}
              style={{
                lineHeight: 24,
                fontSize: 16,
                marginTop: 0,
              }}
            />
            <TextInput
              placeholder={strings.clubNameplaceholder}
              style={styles.inputTextField}
              maxLength={20}
              onChangeText={(text) => setClubName(text)}
              value={clubName}
            />
          </View>

          <View style={styles.fieldView}>
            <TCLabel
              title={strings.locationClubTitle}
              style={{marginTop: 0}}
              required={true}
            />
            <TouchableOpacity onPress={() => setVisibleLocationModal(true)}>
              <TextInput
                placeholder={strings.searchCityPlaceholder}
                style={styles.inputTextField}
                value={location}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldView}>
            <TCLabel
              title={strings.sport}
              style={{marginTop: 0}}
              required={true}
            />
            <TouchableOpacity style={styles.languageView} onPress={toggleModal}>
              <Text
                style={
                  sportsName
                    ? styles.languageText
                    : styles.languagePlaceholderText
                }
                numberOfLines={50}>
                {sportsName || strings.sportsTitleText}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldView}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TCLabel
                title={strings.bio}
                style={{marginTop: 0, textTransform: 'uppercase'}}
              />
            </View>
            <TextInput
              style={styles.descriptionTxt}
              onChangeText={(text) => setDescription(text)}
              value={description}
              multiline
              maxLength={1000}
              textAlignVertical={'top'}
              numberOfLines={4}
              placeholder={strings.descriptionClubTextPlaceholder}
              placeholderTextColor={colors.userPostTimeColor}
            />
          </View>
        </View>

        {/* <View style={{marginLeft: 15}}>
          <Text style={styles.smallTxt}>{strings.createClubNotes}</Text>
        </View> */}

        <View style={{flex: 1}} />
      </ScrollView>

      {/* <TCGradientButton
        isDisabled={clubName === '' || location === '' || sportsName === ''}
        title={strings.nextTitle}
        style={{marginBottom: 30}}
        onPress={onNextPressed}
      /> */}

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
      {/* 
      <SportsListModal
        isVisible={visibleSportsModal}
        closeList={() => setVisibleSportsModal(false)}
        title={strings.sport}
        sportsList={sportList}
      /> */}

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
            height: Dimensions.get('window').height / 1.07,
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
              // paddingHorizontal: 15,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              hitSlop={getHitSlop(15)}
              style={[styles.closeButton, {marginTop: 20, marginBottom: 10}]}
              onPress={() => setVisibleSportsModal(false)}>
              <Image source={images.cancelImage} style={styles.closeButton} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                //  marginVertical: 20,
                fontSize: 16,
                fontFamily: fonts.RBold,
                color: colors.lightBlackColor,
                textAlign: 'center',
                marginTop: 20,
                marginLeft: 20,
                marginBottom: 14,
              }}>
              Sports
            </Text>
            <TouchableOpacity
              onPress={() => {
                const filterChecked = sportList.filter((obj) => obj.isChecked);
                setSelectedSports(filterChecked);
                toggleModal();
              }}>
              <Text
                style={{
                  alignSelf: 'center',

                  fontSize: 16,
                  fontFamily: fonts.RMedium,

                  marginRight: 17,
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                {strings.apply}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorLine} />
          <FlatList
            style={{marginTop: 5}}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <TCThinDivider />}
            data={sportList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSports}
          />
        </View>
      </Modal>
      {/* locationModal */}

      <LocationModal
        visibleLocationModal={visibleLocationModal}
        title={strings.homeCityTitleText}
        setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
        onLocationSelect={handleSetLocationOptions}
        placeholder={strings.searchByCity}
      />
    </>
  );
}
