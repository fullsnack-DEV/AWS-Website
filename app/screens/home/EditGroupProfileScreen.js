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
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import TCTouchableLabel from '../../components/TCTouchableLabel';
import TCTextField from '../../components/TCTextField';
import TCLabel from '../../components/TCLabel';
import TCProfileImageControl from '../../components/TCProfileImageControl';
import { updateGroupProfile, getGroupSearch } from '../../api/Groups';

import ActivityLoader from '../../components/loader/ActivityLoader';
import strings from '../../Constants/String';
import AuthContext from '../../auth/context';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import uploadImages from '../../utils/imageAction';
import images from '../../Constants/ImagePath';
import TCKeyboardView from '../../components/TCKeyboardView';
import * as Utility from '../../utils';
import { getQBAccountType, QBupdateUser } from '../../utils/QuickBlox';
import ToggleView from '../../components/Schedule/ToggleView';

export default function EditGroupProfileScreen({ navigation, route }) {
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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings.editprofiletitle,
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
            nextOnPress();
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
    getUserInformation();
  }, []);

  useEffect(() => {
    if (route.params && route.params.city) {
      const newLocation = `${route.params.city}, ${route.params.state}, ${route.params.country}`;
      setGroupProfile({
        ...groupProfile,
        location: newLocation,
        city: route.params.city,
        state_abbr: route.params.state,
        country: route.params.country,
      });
    }
  }, [isFocused]);

  // Form Validation
  const checkValidation = () => {
    if (groupProfile.group_name === '') {
      Alert.alert('Towns Cup', 'First name cannot be blank');
      return false;
    }
    if (groupProfile.location === '') {
      Alert.alert('Towns Cup', 'Location cannot be blank');
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

  const nextOnPress = () => {
    setloading(true)
    getGroupSearch(groupProfile?.group_name, groupProfile?.city, authContext).then((response) => {
      setloading(false);
      if (!response.payload) {
        onSaveButtonClicked()
      } else {
        setTimeout(() => {
          Alert.alert(strings.teamExist);
        }, 10);
      }
    })
    .catch((e) => {
      setloading(false);
      setTimeout(() => {
        Alert.alert(strings.alertmessagetitle, e.message);
      }, 10);
    });
  };

  const onSaveButtonClicked = () => {
    Keyboard.dismiss();
    if (checkValidation()) {
      setloading(true);
      const userProfile = { ...groupProfile };
      if (profileImageChanged || backgroundImageChanged) {
        const imageArray = [];
        if (profileImageChanged) {
          imageArray.push({ path: groupProfile.thumbnail });
        }
        if (backgroundImageChanged) {
          imageArray.push({ path: groupProfile.background_thumbnail });
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
              Alert.alert('Towns Cup', e.messages);
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
    updateGroupProfile(userProfile, paramGroupID, authContext)
      .then(async (response) => {
        const entity = authContext.entity;
        entity.obj = response.payload;
        // entity.auth.user = response.payload;
        const entity_id = ['user', 'player']?.includes(
          response?.payload?.entity_type,
        )
          ? response?.payload?.user_id
          : response?.payload?.group_id;
        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(entity_id, response?.payload, accountType, authContext)
          .then(async (responseJSON) => {
            const qbUser = responseJSON?.user;
            entity.QB = {
              ...entity.QB,
              fullName: qbUser?.full_name,
              customData: qbUser?.custom_data,
              lastRequestAt: qbUser?.last_request_at,
            };
            authContext.setEntity({ ...entity });
            await Utility.setStorage('authContextEntity', { ...entity });
            setloading(false);
            navigation.goBack();
          })
          .catch(async (error) => {
            console.log('QB error : ', error);
            authContext.setEntity({ ...entity });
            await Utility.setStorage('authContextEntity', { ...entity });
            setloading(false);
            navigation.goBack();
          });
      })
      .catch((error) => {
        setloading(false);
        setTimeout(() => {
          Alert.alert('Towns Cup', error.message);
        }, 0.1);
      });
  };

  const onLocationClicked = async () => {
    console.log('call on location');
    navigation.navigate('SearchLocationScreen', {
      comeFrom: 'EditGroupProfileScreen',
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
        setGroupProfile({ ...groupProfile, thumbnail: data.path });
        setProfileImageChanged(true);
      } else {
        setGroupProfile({ ...groupProfile, background_thumbnail: data.path });
        setBackgroundImageChanged(true);
      }
    });
  };

  const deleteImage = () => {
    if (currentImageSelection) {
      // 1 means profile image
      setGroupProfile({ ...groupProfile, thumbnail: '', full_image: '' });
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
        setGroupProfile({ ...groupProfile, thumbnail: data.path });
        setProfileImageChanged(true);
      } else {
        setGroupProfile({ ...groupProfile, background_thumbnail: data.path });
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
              deleteImage();
            }
          }}
        />

        <ScrollView style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          <TCProfileImageControl
            profileImage={
              groupProfile.thumbnail ? { uri: groupProfile.thumbnail } : undefined
            }
            profileImagePlaceholder={images.teamPlaceholder}
            bgImage={
              groupProfile.background_thumbnail
                ? { uri: groupProfile.background_thumbnail }
                : undefined
            }
            onPressBGImage={() => onBGImageClicked()}
            onPressProfileImage={() => onProfileImageClicked()}
            showEditButtons
          />
          <View>
            <TCLabel
              title={route.params.nameTitle}
              style={{ marginTop: 37 }}
              required={true}
            />
            <TCTextField
              placeholder={route.params.placeholder}
              onChangeText={(text) => setGroupProfile({ ...groupProfile, group_name: text })
              }
              value={groupProfile.group_name}
            />
          </View>
          <View>
            <TCLabel title={strings.currentCity} required={true} />
            <TCTouchableLabel
              title={groupProfile.location}
              onPress={() => onLocationClicked()}
              placeholder={strings.searchCityPlaceholder}
              showNextArrow={true}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginRight: 15,
            }}>
            <TCLabel title={strings.hiringPlayers} style={{ marginTop: 15 }} />
            <ToggleView
              isOn={groupProfile?.hiringPlayers}
              onToggle={() => {
                setGroupProfile({
                  ...groupProfile,
                  hiringPlayers: !groupProfile?.hiringPlayers,
                });
              }}
              onColor={colors.themeColor}
              offColor={colors.grayBackgroundColor}
            />
          </View>

          <View>
            <TCLabel title={strings.slogan} />
            <TCTextField
              placeholder={'Enter your slogan'}
              onChangeText={(text) => setGroupProfile({ ...groupProfile, description: text })
              }
              multiline
              maxLength={150}
              value={groupProfile.description}
              height={120}
            />
          </View>
        </ScrollView>
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
});
