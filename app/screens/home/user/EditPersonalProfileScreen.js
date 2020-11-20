import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
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
import * as Utility from '../../../utils';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import uploadImages from '../../../utils/imageAction';

export default function EditPersonalProfileScreen({ navigation, route }) {
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const isFocused = useIsFocused();
  // For activity indigator
  const [loading, setloading] = useState(false);

  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');

  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [profileFullImage, setProfileFullImage] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundFullImage, setBackgroundFullImage] = useState('');
  const [currentImageSelection, setCurrentImageSelection] = useState(0);
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [backgroundImageChanged, setBackgroundImageChanged] = useState(false);

  const [description, setDescription] = useState('');

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
  }, [navigation, fName, lName, location, city, state, country, description,
    profileImage, profileFullImage, profileImageChanged,
    backgroundImage, backgroundFullImage, backgroundImageChanged, currentImageSelection]);

  useEffect(() => {
    getUserInformation();
  }, []);

  useEffect(() => {
    if (route.params && route.params.city) {
      const newLocation = `${route.params.city}, ${route.params.state}, ${route.params.country}`;
      setLocation(newLocation);
      setCity(route.params.city);
      setState(route.params.state);
      setCountry(route.params.country);
    }
  }, [isFocused]);

  // Form Validation
  const checkValidation = () => {
    if (fName === '') {
      Alert.alert('Towns Cup', 'First name cannot be blank');
      return false
    } if (lName === '') {
      Alert.alert('Towns Cup', 'Last name cannot be blank');
      return false
    } if (location === '') {
      Alert.alert('Towns Cup', 'Location cannot be blank');
      return false
    }
    return true
  };

  // Get user information from async store
  const getUserInformation = async () => {
    const entity = await Utility.getStorage('loggedInEntity')
    if (entity.role !== 'user') {
      // return previous screen
    }
    const userDetails = entity.obj;
    setFName(userDetails.first_name);
    setLName(userDetails.last_name);
    setCity(userDetails.city);
    setState(userDetails.state_abbr);
    setCountry(userDetails.country);
    setDescription(userDetails.description);
    setProfileImage(userDetails.thumbnail);
    setBackgroundImage(userDetails.background_thumbnail);
    setProfileFullImage(userDetails.full_image);
    setBackgroundFullImage(userDetails.background_full_image);

    setLocation(`${userDetails.city}, ${userDetails.state_abbr}, ${userDetails.country}`);
  }

  const onSaveButtonClicked = () => {
    if (checkValidation()) {
      setloading(true);
      const userProfile = {};
      userProfile.first_name = fName;
      userProfile.last_name = lName;
      userProfile.full_name = `${fName} ${lName}`;
      userProfile.city = city;
      userProfile.state_abbr = state;
      userProfile.country = country;
      userProfile.description = description;
      userProfile.full_image = profileFullImage;
      userProfile.thumbnail = profileImage;
      userProfile.background_full_image = backgroundFullImage;
      userProfile.background_thumbnail = backgroundImage;

      if (profileImageChanged || backgroundImageChanged) {
        const imageArray = []
        if (profileImageChanged) {
          imageArray.push({ path: profileImage });
        }
        if (backgroundImageChanged) {
          imageArray.push({ path: backgroundImage });
        }
        uploadImages(imageArray).then((responses) => {
          const attachments = responses.map((item) => ({
            type: 'image',
            url: item.fullImage,
            thumbnail: item.thumbnail,
          }))
          if (profileImageChanged) {
            setProfileImage(attachments[0].thumbnail)
            setProfileFullImage(attachments[0].url)
            setProfileImageChanged(false)
            userProfile.full_image = attachments[0].thumbnail;
            userProfile.thumbnail = attachments[0].url;
          }

          if (backgroundImageChanged) {
            let bgInfo = attachments[0]
            if (attachments.length > 1) {
              bgInfo = attachments[1];
            }
            setBackgroundImage(bgInfo.thumbnail)
            setBackgroundFullImage(bgInfo.url)
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
    updateUserProfile(userProfile).then(async (response) => {
      setloading(false);
      if (response && response.status === true) {
        setTimeout(() => {
          Alert.alert('Towns Cup', 'Profile changed sucessfully');
        }, 0.1)
        const entity = await Utility.getStorage('loggedInEntity')
        entity.obj = response.payload;
        entity.auth.user = response.payload;
        Utility.setStorage('loggedInEntity', entity);
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
        setProfileImage(data.path)
        setProfileImageChanged(true)
      } else {
        setBackgroundImage(data.path)
        setBackgroundImageChanged(true)
      }
    });
  }

  const deleteImage = () => {
    if (currentImageSelection) {
      // 1 means profile image
      setProfileImage('')
      setProfileFullImage('')
      setProfileImageChanged(false)
    } else {
      // 0 means profile image
      setBackgroundImage('')
      setBackgroundFullImage('')
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
        setProfileImage(data.path)
        setProfileImageChanged(true)
      } else {
        setBackgroundImage(data.path)
        setBackgroundImageChanged(true)
      }
    });
  }

  const onBGImageClicked = () => {
    setCurrentImageSelection(0);
    setTimeout(() => {
      if (backgroundImage) {
        actionSheetWithDelete.current.show();
      } else {
        actionSheet.current.show();
      }
    }, 0.1)
  }

  const onProfileImageClicked = () => {
    setCurrentImageSelection(1);
    setTimeout(() => {
      if (profileImage) {
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
      <ScrollView style={styles.mainContainer}>
        <ActivityLoader visible={loading} />
        <TCProfileImageControl
        profileImage={ profileImage ? { uri: profileImage } : undefined }
        bgImage={ backgroundImage ? { uri: backgroundImage } : undefined }
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
            onChangeText={(text) => setFName(text)}
            value={fName}/>
          <TCTextField
            placeholder={strings.enterLastNamePlaceholder}
            style={{ marginTop: 8 }}
            onChangeText={(text) => setLName(text)}
            value={lName}/>
        </View>

        <View>
          <TCLabel title= {strings.locationTitle}/>
          <TCTouchableLabel
           title = {location}
           onPress = {() => onLocationClicked()}
           placeholder = {strings.searchCityPlaceholder}
           showNextArrow = {true}
          />
        </View>

        <View>
          <TCLabel title= {strings.slogan}/>
          <TCTextField
            placeholder={strings.enterBioPlaceholder}
            onChangeText={(text) => setDescription(text)}
            multiline
            maxLength={150}
            value={description}
            height={120}
            />
        </View>
      </ScrollView>
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
