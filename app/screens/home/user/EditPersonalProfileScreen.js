/* eslint-disable default-case */
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
  Image,
  TouchableOpacity,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  check, PERMISSIONS, RESULTS, request,
 } from 'react-native-permissions';
import ActionSheet from 'react-native-actionsheet';
// import TCGradientButton from '../../components/TCGradientButton';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import TCTextField from '../../../components/TCTextField';
import TCLabel from '../../../components/TCLabel';
import { updateUserProfile } from '../../../api/Users';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import uploadImages from '../../../utils/imageAction';
import TCKeyboardView from '../../../components/TCKeyboardView';
import AuthContext from '../../../auth/context';
import * as Utility from '../../../utils';
import { getQBAccountType, QBupdateUser } from '../../../utils/QuickBlox';
import images from '../../../Constants/ImagePath';
import TCImage from '../../../components/TCImage';
// import ToggleView from '../../../components/Schedule/ToggleView';

export default function EditPersonalProfileScreen({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(false);
  const [currentImageSelection, setCurrentImageSelection] = useState(0);
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [backgroundImageChanged, setBackgroundImageChanged] = useState(false);
  const [profile, setProfile] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings.editprofiletitle,
      headerRight: () => (
        <Text style={ {
          marginEnd: 16,
          fontSize: 14,
          fontFamily: fonts.RRegular,
          color: colors.lightBlackColor,
        } } onPress={ () => {
          onSaveButtonClicked();
        } }>{strings.save}</Text>
      ),
    });
  }, [navigation, profileImageChanged, backgroundImageChanged, currentImageSelection, profile]);

  useEffect(() => {
    getUserInformation();
  }, []);

  useEffect(() => {
    if (route.params && route.params.city) {
      const newLocation = `${route.params.city}, ${route.params.state}, ${route.params.country}`;
      setProfile({
        ...profile, location: newLocation, city: route.params.city, state_abbr: route.params.state, country: route.params.country,
      })
    }
  }, [isFocused]);

  // Form Validation
  const checkValidation = () => {
    if (profile.first_name === '') {
      Alert.alert(strings.alertmessagetitle, strings.firstnamevalidation);
      return false
    } if (profile.last_name === '') {
      Alert.alert(strings.alertmessagetitle, strings.lastnamevalidation);
      return false
    } if (profile.location === '') {
      Alert.alert(strings.alertmessagetitle, strings.locationvalidation);
      return false
    }
    return true
  };

  // Get user information from async store
  const getUserInformation = async () => {
    const entity = authContext.entity
    const userDetails = entity.obj;
    console.log('user Details:=>', userDetails);
    setProfile({
      ...userDetails,
      location: (`${userDetails.city}, ${userDetails.state_abbr}, ${userDetails.country}`),
    });
    // setLookingForTeam(userDetails.lookingForTeam)
  }

  const onSaveButtonClicked = () => {
    if (checkValidation()) {
      setloading(true);
      const userProfile = { ...profile, full_name: `${profile.first_name} ${profile.last_name}` };
      if (profileImageChanged || backgroundImageChanged) {
        const imageArray = []
        if (profileImageChanged) {
          imageArray.push({ path: profile.thumbnail });
        }
        if (backgroundImageChanged) {
          imageArray.push({ path: profile.background_thumbnail });
        }
        uploadImages(imageArray, authContext).then((responses) => {
          const attachments = responses.map((item) => ({
            type: 'image',
            url: item.fullImage,
            thumbnail: item.thumbnail,
          }))
          if (profileImageChanged) {
            setProfile({ ...profile, thumbnail: attachments[0].thumbnail, full_image: attachments[0].url })
            setProfileImageChanged(false)
            userProfile.full_image = attachments[0].thumbnail;
            userProfile.thumbnail = attachments[0].url;
          }

          if (backgroundImageChanged) {
            let bgInfo = attachments[0]
            if (attachments.length > 1) {
              bgInfo = attachments[1];
            }

            setProfile({ ...profile, background_thumbnail: bgInfo.thumbnail, background_full_image: bgInfo.url })
            setBackgroundImageChanged(false)
            userProfile.background_full_image = bgInfo.url;
            userProfile.background_thumbnail = bgInfo.thumbnail;
          }
          callUpdateUserAPI(userProfile);
        })
          .catch((e) => {
            setTimeout(() => {
              Alert.alert('Towns Cup', e.messages)
            }, 0.1)
            setloading(false);
          });
      } else {
        callUpdateUserAPI(userProfile);
      }
    }
  }

  const callUpdateUserAPI = (userProfile) => {
    updateUserProfile(userProfile, authContext).then(async (response) => {
      if (response && response.status === true) {
        const entity = authContext.entity
        entity.obj = response.payload;
        entity.auth.user = response.payload;
        const entity_id = ['user', 'player']?.includes(response?.payload?.entity_type) ? response?.payload?.user_id : response?.payload?.group_id;
        const accountType = getQBAccountType(response?.payload?.entity_type);
        QBupdateUser(entity_id, response?.payload, accountType, authContext).then(async (responseJSON) => {
          const qbUser = responseJSON?.user;
          entity.QB = {
            ...entity.QB,
            fullName: qbUser?.full_name,
            customData: qbUser?.custom_data,
            lastRequestAt: qbUser?.last_request_at,

          };
          authContext.setEntity({ ...entity })
          await Utility.setStorage('authContextEntity', { ...entity })
          setloading(false);
          navigation.goBack();
        }).catch(async (error) => {
          console.log('QB error : ', error);
          authContext.setEntity({ ...entity })
          await Utility.setStorage('authContextEntity', { ...entity })
          setloading(false);
          navigation.goBack();
        })
      } else {
        setloading(false);
        setTimeout(() => {
          Alert.alert('Towns Cup', 'Something went wrong');
        }, 0.1)
      }
    })
  }

  const onLocationClicked = async () => {
    navigation.navigate('SearchLocationScreen', {
      comeFrom: 'EditPersonalProfileScreen',
    })
  }

  const openImagePicker = (width = 400, height = 400) => {
    let cropCircle = false;
    if (currentImageSelection === 1) cropCircle = true;
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: cropCircle,
    }).then((data) => {
      // 1 means profile, 0 - means background
      if (currentImageSelection === 1) {
        setProfile({ ...profile, thumbnail: data.path })
        setProfileImageChanged(true)
      } else {
        setProfile({ ...profile, background_thumbnail: data.path })
        setBackgroundImageChanged(true)
      }
    });
  }

  const deleteImage = () => {
    if (currentImageSelection) {
      // 1 means profile image
      setProfile({ ...profile, thumbnail: '', full_image: '' })
      setProfileImageChanged(false)
    } else {
      // 0 means profile image
      setProfile({ ...profile, background_thumbnail: '', background_full_image: '' })
      setBackgroundImageChanged(false)
    }
  }

  // const openCamera = (width = 400, height = 400) => {
  //   let cropCircle = false;
  //   if (currentImageSelection === 1) cropCircle = true;
  //   ImagePicker.openCamera({
  //     width,
  //     height,
  //     cropping: true,
  //     cropperCircleOverlay: cropCircle,
  //   }).then((data) => {
  //     // 1 means profile, 0 - means background
  //     if (currentImageSelection === 1) {
  //       setProfile({ ...profile, thumbnail: data.path })
  //       setProfileImageChanged(true)
  //     } else {
  //       setProfile({ ...profile, background_thumbnail: data.path })
  //       setBackgroundImageChanged(true)
  //     }
  //   });
  // }

  const openCamera = (width = 400, height = 400) => {
    check(PERMISSIONS.IOS.CAMERA)
  .then((result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        Alert.alert('This feature is not available (on this device / in this context)')
        break;
      case RESULTS.DENIED:
        request(PERMISSIONS.IOS.CAMERA).then(() => {
          let cropCircle = false;
          if (currentImageSelection === 1) cropCircle = true;
          ImagePicker.openCamera({
            width,
            height,
            cropping: true,
            cropperCircleOverlay: cropCircle,
          }).then((data) => {
            if (currentImageSelection === 1) {
              setProfile({ ...profile, thumbnail: data.path })
              setProfileImageChanged(true)
            } else {
              setProfile({ ...profile, background_thumbnail: data.path })
              setBackgroundImageChanged(true)
            }
          }).catch((e) => {
            Alert.alert(e)
          });
        })
        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        break;
      case RESULTS.GRANTED:
        { let cropCircle = false;
        if (currentImageSelection === 1) cropCircle = true;
        ImagePicker.openCamera({
          width,
          height,
          cropping: true,
          cropperCircleOverlay: cropCircle,
        }).then((data) => {
          if (currentImageSelection === 1) {
            setProfile({ ...profile, thumbnail: data.path })
            setProfileImageChanged(true)
          } else {
            setProfile({ ...profile, background_thumbnail: data.path })
            setBackgroundImageChanged(true)
          }
        }).catch((e) => {
          Alert.alert(e)
        }); }
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  })
  .catch((error) => {
    Alert.alert(error)
  });
  };

  const onProfileImageClicked = () => {
    setCurrentImageSelection(1);
    setTimeout(() => {
      if (profile.thumbnail) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1)
  }

  return (
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
                options={[strings.camera, strings.album, strings.deleteTitle, strings.cancelTitle]}
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
      <TCKeyboardView>
        <ScrollView>
          <ActivityLoader visible={loading} />
          {/* <TCProfileImageControl
        profileImage={ profile.thumbnail ? { uri: profile.thumbnail } : undefined }
        onPressProfileImage={() => onProfileImageClicked()}
        showEditButtons /> */}

          <View style={{ flex: 1 }}>

            <TCImage
        imageStyle={[
          styles.profileImageStyle,
          { marginTop: 10 },
        ]}
        source={profile.thumbnail ? { uri: profile.thumbnail } : images.profilePlaceHolder}
        defaultSource={images.profilePlaceHolder}
      />

            <TouchableOpacity
          style={styles.profileCameraButtonStyle}
          onPress={() => onProfileImageClicked()}>
              <Image
            style={styles.profileImageButtonStyle}
            source={images.certificateUpload}
          />
            </TouchableOpacity>

          </View>

          <View>
            <View style={{ flexDirection: 'row' }}>
              <TCLabel title= {strings.nameText } style={{ marginTop: 37 }}/>
              <Text style={styles.validationSign}>*</Text>
            </View>
            <TCTextField
            placeholder={strings.enterFirstNamePlaceholder}
            onChangeText={(text) => setProfile({ ...profile, first_name: text })}
            value={profile.first_name}/>
            <TCTextField
            placeholder={strings.enterLastNamePlaceholder}
            style={{ marginTop: 8 }}
            onChangeText={(text) => setProfile({ ...profile, last_name: text })}
            value={profile.last_name}/>
          </View>

          <View>
            <TCLabel
          title= {strings.currentCity}
          required = {true}
          />
            <TCTouchableLabel
           title = {profile.location}
           onPress = {() => onLocationClicked()}
           placeholder = {strings.searchCityPlaceholder}
           showNextArrow = {true}
          />
          </View>

          {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: 15,
          }}>
            <TCLabel title= {strings.lookingForTeam} style={{ marginTop: 15 }}/>
            <ToggleView
            isOn={profile?.lookingForTeam}

            onToggle={() => {
              setProfile({ ...profile, lookingForTeam: !profile?.lookingForTeam })
            }}
            onColor={colors.themeColor}
            offColor={colors.grayBackgroundColor}

          />
          </View> */}

          <View>
            <TCLabel title= {strings.slogan}/>
            <TCTextField
            placeholder={'Enter your slogan'}
            onChangeText={(text) => setProfile({ ...profile, description: text })}
            multiline
            maxLength={150}
            value={profile.description}
            height={120}

            />
          </View>
        </ScrollView>
      </TCKeyboardView>
    </>
  );
}

const styles = StyleSheet.create({
  validationSign: {
    fontSize: 20,
    marginLeft: 4,
    marginTop: 37,
    color: colors.redColor,
  },

  profileImageStyle: {
    height: 71,
    width: 71,
    marginTop: -36,
    borderRadius: 35.5,
    borderWidth: 2,
    alignSelf: 'center',
    borderColor: colors.whiteColor,
  },

  profileCameraButtonStyle: {
    height: 22,
    width: 22,
    marginTop: -22,
    marginLeft: 48,
    alignSelf: 'center',
  },
  profileImageButtonStyle: {
    height: 22,
    width: 22,
  },
});
