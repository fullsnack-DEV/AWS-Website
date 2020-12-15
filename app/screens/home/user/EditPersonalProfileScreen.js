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
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
// import TCGradientButton from '../../components/TCGradientButton';
import TCTouchableLabel from '../../../components/TCTouchableLabel';
import TCTextField from '../../../components/TCTextField';
import TCLabel from '../../../components/TCLabel';
import TCProfileImageControl from '../../../components/TCProfileImageControl'
import { updateUserProfile } from '../../../api/Users';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import strings from '../../../Constants/String';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import uploadImages from '../../../utils/imageAction';
import TCKeyboardView from '../../../components/TCKeyboardView';
import AuthContext from '../../../auth/context';

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
  }, [navigation, profileImageChanged,
    backgroundImageChanged, currentImageSelection, profile]);

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
    setProfile({
      ...userDetails,
      location: (`${userDetails.city}, ${userDetails.state_abbr}, ${userDetails.country}`),
    });
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
      setloading(false);
      if (response && response.status === true) {
        setTimeout(() => {
          Alert.alert('Towns Cup', 'Profile changed sucessfully');
        }, 0.1)
        const entity = authContext.entity
        entity.obj = response.payload;
        entity.auth.user = response.payload;
        authContext.setEntity({ ...entity })
      } else {
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

  const openCamera = (width = 400, height = 400) => {
    ImagePicker.openCamera({
      width,
      height,
      cropping: true,
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

  const onBGImageClicked = () => {
    setCurrentImageSelection(0);
    setTimeout(() => {
      if (profile.background_thumbnail) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1)
  }
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
        <ScrollView style={styles.mainContainer}>
          <ActivityLoader visible={loading} />
          <TCProfileImageControl
        profileImage={ profile.thumbnail ? { uri: profile.thumbnail } : undefined }
        bgImage={ profile.background_thumbnail ? { uri: profile.background_thumbnail } : undefined }
        onPressBGImage={() => onBGImageClicked()}
        onPressProfileImage={() => onProfileImageClicked()}
        showEditButtons />

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

          <View>
            <TCLabel title= {strings.slogan}/>
            <TCTextField
            placeholder={strings.enterBioPlaceholder}
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
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  validationSign: {
    fontSize: 20,
    marginLeft: 4,
    marginTop: 37,
    color: colors.redColor,
  },

});
