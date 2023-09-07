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
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {useIsFocused} from '@react-navigation/native';
import TCTextField from '../../components/TCTextField';
import {patchGroup} from '../../api/Groups';
import {deleteConfirmation, setAuthContextData} from '../../utils';
import ActivityLoader from '../../components/loader/ActivityLoader';
import {strings} from '../../../Localization/translation';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import uploadImages from '../../utils/imageAction';
import images from '../../Constants/ImagePath';
import TCKeyboardView from '../../components/TCKeyboardView';
import Verbs from '../../Constants/Verbs';
import LocationModal from '../../components/LocationModal/LocationModal';
import ScreenHeader from '../../components/ScreenHeader';
import SportListMultiModal from '../../components/SportListMultiModal/SportListMultiModal';
import {getSportName} from '../../utils/sportsActivityUtils';
import GroupProfileComponent from './components/GroupProfileComponent';

export default function EditGroupProfileScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [currentImageSelection, setCurrentImageSelection] = useState(0);
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [backgroundImageChanged, setBackgroundImageChanged] = useState(false);
  const [groupProfile, setGroupProfile] = useState({});
  const [visibleSportsModal, setVisibleSportsModal] = useState(false);
  const [selectedSports, setSelectedSports] = useState([]);
  const [sportsName, setSportsName] = useState('');
  const [visibleLocationModal, setVisibleLocationModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const entity = {...authContext.entity.obj};
    if (isFocused && entity.group_id) {
      setGroupProfile({...authContext.entity.obj});
      if (entity.entity_type === Verbs.entityTypeTeam) {
        const name = getSportName(
          entity.sport,
          entity.sport_type,
          authContext.sports,
        );
        setSportsName(name);
      } else {
        setSelectedSports(entity.sports);
      }
    }
  }, [isFocused, authContext]);

  useEffect(() => {
    let sportText = '';
    if (selectedSports.length > 0) {
      selectedSports.forEach((item) => {
        const name = getSportName(
          item.sport,
          item.sport_type,
          authContext.sports,
        );
        sportText += sportText.length > 0 ? `, ${name}` : name;
      });

      setSportsName(sportText);
    }
  }, [selectedSports, authContext.sports]);

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

  const onUpdateButtonClicked = () => {
    Keyboard.dismiss();
    if (checkValidation()) {
      setloading(true);
      setGroupProfile({
        ...groupProfile,

        sports: selectedSports,
      });
      const userProfile = {...groupProfile, sports: selectedSports};

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
      .then(async (response) => {
        await setAuthContextData(response.payload, authContext);
        setloading(false);
        navigation.goBack();
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert(strings.appName, error.message);
        }, 0.1);
      });
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

  const handleSelectLocationOptions = (currentLocation) => {
    setGroupProfile({
      ...groupProfile,
      city: currentLocation.city,
      state_abbr: currentLocation.state,
      state: currentLocation.state_full,
      country: currentLocation.country,
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={strings.profileText}
        leftIcon={images.backArrow}
        isRightIconText
        rightButtonText={strings.updateText}
        onRightButtonPress={() => {
          onUpdateButtonClicked();
        }}
        leftIconPress={() => navigation.goBack()}
      />
      <TCKeyboardView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ActivityLoader visible={loading} />
          <GroupProfileComponent
            groupDetails={groupProfile}
            onPressBGImage={() => onBGImageClicked()}
            onPressProfileImage={() => onProfileImageClicked()}
          />
          <View style={{marginTop: 25, paddingHorizontal: 15}}>
            <View style={{marginBottom: 35}}>
              <Text style={styles.labelText}>
                {authContext.entity.role === Verbs.entityTypeTeam
                  ? strings.teamName.toUpperCase()
                  : strings.clubName.toUpperCase()}
                <Text
                  style={[styles.labelText, {color: colors.darkThemeColor}]}>
                  {' '}
                  *
                </Text>
              </Text>

              <TextInput
                placeholder={
                  authContext.entity.role === Verbs.entityTypeTeam
                    ? strings.teamNamePlaceholder
                    : strings.clubNameplaceholder
                }
                onChangeText={(text) =>
                  setGroupProfile({...groupProfile, group_name: text})
                }
                value={groupProfile.group_name}
                style={styles.inputField}
                placeholderTextColor={colors.userPostTimeColor}
              />
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.labelText}>
                {strings.homeCityTitle.toUpperCase()}
                <Text
                  style={[styles.labelText, {color: colors.darkThemeColor}]}>
                  {' '}
                  *
                </Text>
              </Text>
              <Pressable
                style={styles.inputContainer}
                onPress={() => setVisibleLocationModal(true)}>
                <Text
                  style={[
                    styles.labelText,
                    {marginBottom: 0, fontFamily: fonts.RRegular},
                  ]}>{`${groupProfile.city}, ${
                  groupProfile.state_abbr ?? groupProfile.state
                }, ${groupProfile.country}`}</Text>
              </Pressable>
            </View>

            {authContext.entity.role === Verbs.entityTypeClub && (
              <View style={styles.containerStyle}>
                <Text style={styles.labelText}>
                  {strings.sportsTitleText.toUpperCase()}
                  <Text
                    style={[styles.labelText, {color: colors.darkThemeColor}]}>
                    {' '}
                    *
                  </Text>
                </Text>
                <Pressable
                  onPress={() => {
                    setVisibleSportsModal(true);
                  }}
                  style={styles.inputContainer}>
                  <Text
                    style={[
                      styles.labelText,
                      {marginBottom: 0, fontFamily: fonts.RRegular},
                    ]}>
                    {sportsName}
                  </Text>
                </Pressable>
              </View>
            )}

            {authContext.entity.role === Verbs.entityTypeTeam && (
              <View style={styles.containerStyle}>
                <Text style={styles.labelText}>
                  {strings.sportsTitleText.toUpperCase()}
                </Text>
                <Text style={styles.sport}>{sportsName}</Text>
              </View>
            )}

            <View style={styles.containerStyle}>
              <Text style={styles.labelText}>
                {strings.slogan.toUpperCase()}
              </Text>
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
                maxLength={120}
                value={groupProfile.bio}
                height={120}
                style={{marginHorizontal: 0}}
              />
            </View>
          </View>
        </ScrollView>

        <LocationModal
          visibleLocationModal={visibleLocationModal}
          title={strings.homeCityTitle}
          setVisibleLocationModalhandler={() => setVisibleLocationModal(false)}
          onLocationSelect={handleSelectLocationOptions}
          placeholder={strings.searchByCity}
        />
        <SportListMultiModal
          isVisible={visibleSportsModal}
          closeList={() => setVisibleSportsModal(false)}
          title={strings.sportsTitleText}
          onNext={(sports = []) => {
            const selectSports = sports.map((sportItem) => ({
              sport: sportItem.sport,
              sport_type: sportItem.sport_type,
            }));

            setSelectedSports([...selectSports]);

            setVisibleSportsModal(false);
          }}
          selectedSports={selectedSports}
        />

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
      </TCKeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sport: {
    color: colors.lightBlackColor,
    fontSize: 16,
    textAlign: 'left',
    fontFamily: fonts.RRegular,
    marginLeft: 15,
    top: 5,
  },
  labelText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    marginBottom: 10,
  },
  inputField: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 9,
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  inputContainer: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 9,
    borderRadius: 5,
    backgroundColor: colors.textFieldBackground,
  },
  containerStyle: {
    marginBottom: 35,
  },
});
