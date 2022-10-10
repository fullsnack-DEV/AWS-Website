/* eslint-disable default-case */
import React, {useState, useContext, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';

// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {format} from 'react-string-format';
import TCInfoField from '../../../../components/TCInfoField';
import {createGroup, createGroupRequest} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';

import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import {strings} from '../../../../../Localization/translation';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import TCProfileImageControl from '../../../../components/TCProfileImageControl';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCGradientButton from '../../../../components/TCGradientButton';
import TCThinDivider from '../../../../components/TCThinDivider';
import TCPlayerImageInfo from '../../../../components/TCPlayerImageInfo';
import {deleteConfirmation, getSportName} from '../../../../utils';
import Verbs from '../../../../Constants/Verbs';

export default function CreateTeamForm3({navigation, route}) {
  const [createTeamForm2] = useState(route?.params?.createTeamForm2);

  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const authContext = useContext(AuthContext);
  const entity = authContext.entity;
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
                  Alert.alert(e);
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
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  const doubleNextPressed = () => {
    let player1 = {};
    let player2 = {};
    setloading(true);
    const bodyParams = {
      ...createTeamForm2,
      entity_type: Verbs.entityTypeTeam,
    };

    if (bodyParams?.player1) {
      player1 = bodyParams?.player1;
      player2 = bodyParams?.player2;
      delete bodyParams.player1;
      delete bodyParams.player2;
      bodyParams.player1 = player1.user_id;
      bodyParams.player2 = player2.user_id;
    }

    if (thumbnail) {
      bodyParams.thumbnail = thumbnail;
    }
    if (backgroundThumbnail) {
      bodyParams.background_thumbnail = backgroundThumbnail;
    }

    console.log('bodyPARAMS:: ', bodyParams);

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

          createGroupRequest(
            bodyParams,
            entity.uid,
            entity.role === Verbs.entityTypeClub
              ? Verbs.entityTypeClub
              : Verbs.entityTypeUser,
            authContext,
          )
            .then(() => {
              setloading(false);
              navigation.navigate('HomeScreen', {
                uid: entity.uid,
                role: entity.role,
                backButtonVisible: true,
                menuBtnVisible: false,
                isDoubleSportTeamCreated: true,
                name: player2?.full_name,
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
      // createGroup(
      //   bodyParams,
      //   entity.uid,
      //   entity.role === 'club' ? 'club' : 'user',
      //   authContext,
      // )
      createGroupRequest(
        bodyParams,
        entity.uid,
        entity.role === Verbs.entityTypeClub
          ? Verbs.entityTypeClub
          : Verbs.entityTypeUser,
        authContext,
      )
        .then(() => {
          setloading(false);

          navigation.navigate('HomeScreen', {
            uid: entity.uid,
            role: entity.role,
            backButtonVisible: true,
            menuBtnVisible: false,
            isDoubleSportTeamCreated: true,
            name: player2?.full_name,
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

  const singleNextPressed = () => {
    setloading(true);
    const bodyParams = {
      ...createTeamForm2,
      entity_type: Verbs.entityTypeTeam,
    };

    if (thumbnail) {
      bodyParams.thumbnail = thumbnail;
    }
    if (backgroundThumbnail) {
      bodyParams.background_thumbnail = backgroundThumbnail;
    }

    console.log('bodyPARAMS:: ', bodyParams);

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

          createGroup(bodyParams, entity.uid, entity.obj.role, authContext)
            // createGroupRequest(
            //   bodyParams,
            //   entity.uid,
            //   entity.role === 'club' ? 'club' : 'user',
            //   authContext,
            // )
            .then((response) => {
              setloading(false);

              navigation.navigate('HomeScreen', {
                uid: response.payload.group_id,
                role: response.payload.entity_type,
                backButtonVisible: true,
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
      createGroup(bodyParams, entity.uid, entity.obj.role, authContext)
        // createGroupRequest(
        //   bodyParams,
        //   entity.uid,
        //   entity.role === 'club' ? 'club' : 'user',
        //   authContext,
        // )
        .then((response) => {
          setloading(false);

          navigation.navigate('HomeScreen', {
            uid: response.payload.group_id,
            role: response.payload.entity_type,
            backButtonVisible: true,
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

        <TCLabel title={strings.photoUploadTitle} />
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
          showEditButtons
        />
        <TCInfoField
          title={strings.sportsTitleText}
          value={getSportName(createTeamForm2, authContext)}
          marginLeft={25}
          marginTop={30}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        {createTeamForm2?.sport?.toLowerCase() ===
          Verbs.tennisDoubleSport.toLowerCase() && (
          <View>
            <TCPlayerImageInfo
              title={strings.playerTitle}
              player1Image={createTeamForm2?.player1?.thumbnail}
              player2Image={createTeamForm2?.player2?.thumbnail}
              player1Name={createTeamForm2?.player1?.full_name}
              player2Name={createTeamForm2?.player2?.full_name}
              marginLeft={25}
              marginRight={25}
              marginTop={10}
            />
            <TCThinDivider marginTop={10} marginBottom={5} />
          </View>
        )}

        <TCInfoField
          title={strings.teamName}
          value={createTeamForm2?.group_name}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <TCInfoField
          title={strings.homeCityText}
          value={createTeamForm2?.city}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        {createTeamForm2?.sport?.toLowerCase() !==
          Verbs.tennisDoubleSport.toLowerCase() && (
          <View>
            <TCInfoField
              title={strings.membersgender}
              value={
                createTeamForm2?.gender?.charAt(0)?.toUpperCase() +
                createTeamForm2?.gender?.slice(1)
              }
              marginLeft={25}
            />
            <TCThinDivider marginTop={5} marginBottom={3} />

            <TCInfoField
              title={strings.membersage}
              value={format(
                strings.minMaxText_dy,
                createTeamForm2?.min_age ?? '-',
                createTeamForm2?.max_age ?? '-',
              )}
              marginLeft={25}
            />
            <TCThinDivider marginTop={5} marginBottom={3} />
          </View>
        )}

        <TCInfoField
          title={strings.language}
          value={createTeamForm2?.language.join(', ')}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <Text style={styles.describeTitle} numberOfLines={2}>
          Describe
        </Text>
        <Text style={styles.describeText} numberOfLines={50}>
          {createTeamForm2?.descriptions}
        </Text>
        <View style={{flex: 1}} />
      </ScrollView>
      <TCGradientButton
        isDisabled={false}
        title={strings.doneTitle}
        style={{marginBottom: 30, marginTop: 20}}
        onPress={
          createTeamForm2?.sport === Verbs.tennisSport &&
          createTeamForm2?.sport_type === Verbs.doubleSport
            ? doubleNextPressed
            : singleNextPressed
          // entity.role === 'club' ? clubNextPressed : userNextPressed
        }
      />
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
    </>
  );
}
const styles = StyleSheet.create({
  // teamTImage: {
  //   marginLeft: 5,
  //   alignSelf: 'center',
  //   height: 15,
  //   resizeMode: 'contain',
  //   width: 15,
  // },
  // clubBelongText: {
  //   color: colors.googleColor,
  //   fontFamily: fonts.RRegular,
  //   fontSize: 14,
  //   marginBottom: 10,
  //   marginLeft: 15,
  //   marginTop: 10,
  // },
  // downArrow: {
  //   alignSelf: 'center',
  //   height: 12,
  //   resizeMode: 'contain',
  //
  //   right: 25,
  //   tintColor: colors.grayColor,
  //   top: 25,
  //   width: 12,
  // },
  // fieldTitle: {
  //   marginTop: hp('2%'),
  //
  //   fontSize: wp('3.8%'),
  //   textAlign: 'left',
  //   // fontFamily: fonts.RBold,
  //   paddingLeft: 15,
  //
  //   color: colors.lightBlackColor,
  // },
  // fieldView: {
  //   marginTop: 15,
  // },
  //
  // inputAndroid: {
  //   alignSelf: 'center',
  //   backgroundColor: colors.offwhite,
  //   borderRadius: 5,
  //   color: 'black',
  //   elevation: 3,
  //   fontSize: wp('4%'),
  //   height: 40,
  //
  //   marginTop: 12,
  //   paddingHorizontal: 15,
  //   paddingRight: 30,
  //
  //   paddingVertical: 12,
  //
  //   width: wp('92%'),
  // },
  // inputIOS: {
  //   alignSelf: 'center',
  //   backgroundColor: colors.offwhite,
  //   borderRadius: 5,
  //   color: 'black',
  //   elevation: 3,
  //   fontSize: wp('3.5%'),
  //   height: 40,
  //
  //   marginTop: 12,
  //   paddingHorizontal: 15,
  //   paddingRight: 30,
  //
  //   paddingVertical: 12,
  //   shadowColor: colors.googleColor,
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 1,
  //   width: wp('92%'),
  // },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  // matchFeeTxt: {
  //   alignSelf: 'center',
  //   backgroundColor: colors.offwhite,
  //   borderRadius: 5,
  //   color: 'black',
  //   elevation: 3,
  //   fontSize: wp('3.8%'),
  //   height: 40,
  //
  //   marginTop: 12,
  //   paddingHorizontal: 15,
  //   paddingRight: 30,
  //
  //   paddingVertical: 12,
  //   shadowColor: colors.googleColor,
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 1,
  //
  //   width: wp('92%'),
  // },
  // mendatory: {
  //   color: 'red',
  // },
  // miniDownArrow: {
  //   height: 12,
  //   resizeMode: 'contain',
  //   right: 15,
  //
  //   tintColor: colors.grayColor,
  //
  //   top: 15,
  //   width: 12,
  // },
  // nameText: {
  //   alignSelf: 'center',
  //   color: colors.lightBlackColor,
  //   fontFamily: fonts.RBold,
  //   fontSize: wp('3.5%'),
  //   marginLeft: 10,
  // },
  // nextButton: {
  //   alignSelf: 'center',
  //   borderRadius: 30,
  //   height: 45,
  //   marginBottom: 40,
  //   marginTop: wp('12%'),
  //   width: '90%',
  // },
  //
  // nextButtonText: {
  //   alignSelf: 'center',
  //   color: colors.whiteColor,
  //   fontFamily: fonts.RBold,
  //   fontSize: wp('4%'),
  //   marginVertical: 10,
  // },
  // playerTitle: {
  //   marginTop: hp('1%'),
  //
  //   fontSize: wp('3.8%'),
  //   textAlign: 'left',
  //   marginLeft: 15,
  //   // fontFamily: fonts.RBold,
  //   paddingLeft: 15,
  //
  //   color: colors.lightBlackColor,
  // },
  //
  // profileImgGroup: {
  //   height: 30,
  //   width: 30,
  //   resizeMode: 'cover',
  //   // backgroundColor: colors.themeColor,
  //   // marginTop: 20,
  //   // alignSelf: 'center',
  //   borderRadius: 5,
  //   borderWidth: 1,
  //   borderColor: colors.whiteColor,
  // },
  //
  // searchImg: {
  //   // width: wp('4%'),
  //   // height: hp('4%'),
  //
  //   // resizeMode: 'contain',
  //   // alignSelf: 'center',
  //
  //   padding: 8,
  //   width: 8,
  //   height: 10,
  //   tintColor: colors.grayColor,
  // },
  // searchTextField: {
  //   alignSelf: 'center',
  //   color: colors.blackColor,
  //   flex: 1,
  //   height: 40,
  //   marginLeft: 10,
  //   width: wp('80%'),
  // },
  // searchView: {
  //   alignSelf: 'center',
  //   backgroundColor: colors.offwhite,
  //   borderRadius: 5,
  //   color: 'black',
  //   elevation: 3,
  //   flexDirection: 'row',
  //   fontSize: wp('3.5%'),
  //
  //   height: 40,
  //   marginTop: 12,
  //   paddingHorizontal: 15,
  //
  //   paddingRight: 30,
  //   paddingVertical: 12,
  //   shadowColor: colors.googleColor,
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 1,
  //
  //   width: wp('92%'),
  // },
  // smallTxt: {
  //   color: colors.grayColor,
  //   fontSize: wp('2.8%'),
  //   marginTop: hp('2%'),
  //
  //   textAlign: 'left',
  // },
  describeTitle: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RLight,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 25,
  },
  describeText: {
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 25,
  },
});
