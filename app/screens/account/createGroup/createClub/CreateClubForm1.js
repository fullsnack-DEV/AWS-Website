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
  Dimensions,
  Platform,
  Alert,
  StyleSheet,
  Animated,
  Pressable,
  SafeAreaView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

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

import {
  deleteConfirmation,
  showAlert,
  showAlertWithoutTitle,
} from '../../../../utils';

import styles from './style';
import LocationModal from '../../../../components/LocationModal/LocationModal';
import TCProfileImageControl from '../../../../components/TCProfileImageControl';

import Verbs from '../../../../Constants/Verbs';

import {createGroup} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import useSwitchAccount from '../../../../hooks/useSwitchAccount';
import SportListMultiModal from '../../../../components/SportListMultiModal/SportListMultiModal';
import {getSportName} from '../../../../utils/sportsActivityUtils';
import ScreenHeader from '../../../../components/ScreenHeader';
import TCKeyboardView from '../../../../components/TCKeyboardView';

export default function CreateClubForm1({navigation, route}) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [clubName, setClubName] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [statefull, setStateFull] = useState('');

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
  const {onSwitchProfile} = useSwitchAccount();
  const [visibleSportsModalForClub, setVisibleSportsModalForClub] =
    useState(false);

  useEffect(() => {
    if (route.params?.length > 0) {
      const newSportArray = route.params.map(({sport, sport_type}) => ({
        sport,
        sport_type,
      }));

      setSelectedSports(newSportArray);
    }
  }, [route.params]);

  useEffect(() => {
    if (selectedSports.length > 0) {
      let sportText = '';
      selectedSports.forEach((item, index) => {
        const sportname = getSportName(
          item.sport,
          item.sport_type,
          authContext.sports,
        );

        sportText += index !== 0 ? `, ${sportname}` : sportname;
      });

      setSportsName(sportText);
    }
  }, [isFocused, authContext, selectedSports]);

  const checkClubValidations = useCallback(() => {
    if (clubName === '') {
      showAlertWithoutTitle(strings.fillInClubName);
      return false;
    }
    if (location === '') {
      showAlertWithoutTitle(strings.homeCityCannotBlack);
      return false;
    }

    return true;
  }, [clubName, location]);

  const onANimate = (val) => {
    Animated.timing(animProgress, {
      useNativeDriver: false,
      toValue: val,
      duration: 800,
    }).start();
  };

  const onNextPressed = async () => {
    onANimate(20);
    setShowSwitchScreen(true);

    const bodyParams = {
      sports: selectedSports, // Object of sport
      sports_string: sportsName,
      group_name: clubName,
      city,
      state_abbr: state,
      country,
      state: statefull,
      descriptions: description,
      entity_type: Verbs.entityTypeClub,
    };

    if (thumbnail) {
      bodyParams.thumbnail = thumbnail;
    }
    if (backgroundThumbnail) {
      bodyParams.background_thumbnail = backgroundThumbnail;
    }

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
              onANimate(100);
              onSwitchProfile(response.payload);
              setloading(false);
              navigation.push('HomeScreen', {
                uid: response.payload.group_id,
                role: response.payload.entity_type,
                backButtonVisible: false,
                menuBtnVisible: false,
                isEntityCreated: true,
                groupName: response.payload.group_name,
                entityObj: response.payload,
                restrictReturn: true,
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
          onSwitchProfile(response.payload);
          setloading(false);
          navigation.push('HomeScreen', {
            uid: response.payload.group_id,
            role: response.payload.entity_type,
            backButtonVisible: false,
            menuBtnVisible: false,
            isEntityCreated: true,
            groupName: response.payload.group_name,
            entityObj: response.payload,
            restrictReturn: true,
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

  const handleSetLocationOptions = (locations) => {
    setCity(locations.city);
    setState(locations.state);
    setStateFull(locations.state_full);
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
      headerShown: false,
    });
  }, [navigation]);

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
      if (currentImageSelection === 1) {
        setThumbnail(data.path);
      } else {
        setBackgroundThumbnail(data.path);
      }
    });
  };

  const deleteImage = () => {
    if (currentImageSelection === 1) {
      setThumbnail();
    } else {
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
                  if (currentImageSelection === 1) {
                    setThumbnail(data.path);
                  } else {
                    setBackgroundThumbnail(data.path);
                  }
                })
                .catch((e) => {
                  showAlert(e.message);
                });
            });
            break;
          case RESULTS.LIMITED:
            showAlert(strings.limitedPermossionerror);
            break;
          case RESULTS.GRANTED:
            ImagePicker.openCamera({
              width,
              height,
              cropping: true,
            })
              .then((data) => {
                if (currentImageSelection === 1) {
                  setThumbnail(data.path);
                } else {
                  setBackgroundThumbnail(data.path);
                }
              })
              .catch((e) => {
                showAlert(e.message);
              });
            break;
          case RESULTS.BLOCKED:
            showAlert(strings.permissionDeniedandNotrequestable);
            break;

          default:
            break;
        }
      })
      .catch((error) => {
        showAlert(error.message);
      });
  };

  const animWidthPrecent = animProgress.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['0%', '50%', '100%'],
  });

  const placeHolder = images.clubPlaceholderSmall;

  return (
    <SafeAreaView style={{flex: 1}}>
      {!showSwitchScreen && (
        <ScreenHeader
          title={strings.createClubText}
          leftIcon={images.backArrow}
          leftIconPress={() => navigation.goBack()}
          isRightIconText
          rightButtonText={strings.done}
          onRightButtonPress={() => {
            if (checkClubValidations()) {
              onNextPressed();
            }
          }}
        />
      )}
      {showSwitchScreen && (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.whiteColor,

            justifyContent: 'center',
            alignItems: 'center',
            ...StyleSheet.absoluteFillObject,

            zIndex: 1000,
          }}>
          <ActivityLoader visible={false} />
          <Pressable
            style={{
              marginBottom: 89,
              position: 'absolute',
              marginTop: 300,
            }}>
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
                  height: 50,
                  width: 50,

                  borderRadius: 25,
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
          </Pressable>

          <Animated.View
            style={{
              width: 135,
              height: 5,
              backgroundColor: '#F2F2F2',
              borderRadius: 20,
              marginTop: Dimensions.get('screen').height * 0.8,
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
                colors={[
                  colors.createClubGradientfrom,
                  colors.createClubGradientto,
                ]}
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
              />
            </Animated.View>
          </Animated.View>
        </View>
      )}
      <ActivityLoader visible={loading} />
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TCKeyboardView>
            <View>
              <TCProfileImageControl
                profileImage={thumbnail ? {uri: thumbnail} : undefined}
                profileImagePlaceholder={images.newClubLogo}
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
                  placeholder={strings.clubNamePlaceholder}
                  style={styles.inputTextField}
                  maxLength={20}
                  onChangeText={(text) => setClubName(text)}
                  value={clubName}
                  placeholderTextColor={colors.userPostTimeColor}
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
                    placeholder={strings.currentCityPlaceholder}
                    style={styles.inputTextField}
                    value={location}
                    editable={false}
                    pointerEvents="none"
                    placeholderTextColor={colors.userPostTimeColor}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.fieldView}>
                <TCLabel
                  title={strings.SPORTStxt}
                  style={{marginTop: 0}}
                  required={true}
                />
                <TouchableOpacity
                  style={styles.languageView}
                  onPress={() => setVisibleSportsModalForClub(true)}>
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
                    style={{
                      marginTop: 0,
                      textTransform: 'uppercase',
                      fontSize: 16,
                    }}
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

            <View style={{flex: 1}} />
          </TCKeyboardView>
        </ScrollView>
      </View>

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

      {/* locationModal */}

      <LocationModal
        visibleLocationModal={visibleLocationModal}
        title={strings.homeCityTitleText}
        setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
        onLocationSelect={handleSetLocationOptions}
        placeholder={strings.searchByCity}
      />

      <SportListMultiModal
        isVisible={visibleSportsModalForClub}
        closeList={() => setVisibleSportsModalForClub(false)}
        title={strings.createClubText}
        selectedSports={selectedSports}
        onNext={(sports) => {
          const newSportArray = sports.map(({sport, sport_type}) => ({
            sport,
            sport_type,
          }));
          setSelectedSports(newSportArray);
          setVisibleSportsModalForClub(false);
        }}
      />
    </SafeAreaView>
  );
}
