/* eslint-disable default-case */
import React, {useState, useContext, useRef} from 'react';
import {View, Text, ScrollView, Alert, Platform} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import TCInfoField from '../../../../components/TCInfoField';
import {createGroup} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';

import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';

import TCLabel from '../../../../components/TCLabel';
import TCProfileImageControl from '../../../../components/TCProfileImageControl';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCGradientButton from '../../../../components/TCGradientButton';
import TCThinDivider from '../../../../components/TCThinDivider';
import Verbs from '../../../../Constants/Verbs';
import {deleteConfirmation} from '../../../../utils';
import styles from './style';

export default function CreateClubForm3({navigation, route}) {
  const [createClubForm2] = useState(route?.params?.createClubForm2);
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const authContext = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  const [currentImageSelection, setCurrentImageSelection] = useState(0);
  const [thumbnail, setThumbnail] = useState();
  const [backgroundThumbnail, setBackgroundThumbnail] = useState();

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

  const nextOnPress = () => {
    setloading(true);
    const bodyParams = {
      ...createClubForm2,
      entity_type: Verbs.entityTypeClub,
      // privacy_profile: 'members',
      // allclubmemberautomatically_sync: false,
      // homefield_address_longitude: 0.0,
      // homefield_address_latitude: 0.0,
      // allclubmembermannually_sync: false,
      // office_address_longitude: 0.0,
      // office_address_latitude: 0.0,
      // privacy_events: 'everyone',
      // privacy_followers: 'everyone',
      // unread: 0,
    };

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
            })
            .catch((e) => {
              setloading(false);
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
        })
        .catch((e) => {
          setloading(false);
          setTimeout(() => {
            Alert.alert(strings.alertmessagetitle, e.message);
          }, 10);
        });
    }
  };

  return (
    <>
      <TCFormProgress totalSteps={3} curruentStep={3} />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        <ActivityLoader visible={loading} />

        <TCLabel
          title={strings.photoUploadClubTitle}
          style={{marginBottom: 10}}
        />
        <TCProfileImageControl
          profileImage={thumbnail ? {uri: thumbnail} : images.clubPlaceholder}
          profileImagePlaceholder={images.clubPlaceholder}
          bgImage={backgroundThumbnail ? {uri: backgroundThumbnail} : undefined}
          onPressBGImage={() => onBGImageClicked()}
          onPressProfileImage={() => onProfileImageClicked()}
          showEditButtons
        />

        <TCInfoField
          title={strings.sportsTitleText}
          // value={createClubForm2?.sport?.join(' ,')}
          value={createClubForm2.sports_string}
          marginLeft={25}
          marginTop={30}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <TCInfoField
          title={strings.clubNameText}
          value={createClubForm2?.group_name}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <TCInfoField
          title={strings.homeCityText}
          value={createClubForm2?.city}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <TCInfoField
          title={strings.languageTitle}
          value={createClubForm2?.language.join(', ')}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <Text style={styles.describeTitle} numberOfLines={2}>
          {strings.describeText}
        </Text>
        <Text style={styles.describeText} numberOfLines={50}>
          {createClubForm2?.descriptions}
        </Text>
        <View style={{flex: 1}} />
      </ScrollView>
      <TCGradientButton
        isDisabled={false}
        title={strings.doneTitle}
        style={{marginBottom: 30}}
        onPress={nextOnPress}
      />
      <ActionSheet
        ref={actionSheet}
        // title={'NewsFeed Post'}
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
        // title={'NewsFeed Post'}
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
    </>
  );
}
