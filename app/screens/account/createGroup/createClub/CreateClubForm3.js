/* eslint-disable default-case */
// import React, { useState, useContext } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from 'react-native';

// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// import RNPickerSelect from 'react-native-picker-select';
// import LinearGradient from 'react-native-linear-gradient';

// import ActivityLoader from '../../../../components/loader/ActivityLoader';
// import { createGroup } from '../../../../api/Groups';
// import images from '../../../../Constants/ImagePath';
// import strings from '../../../../Constants/String';
// import colors from '../../../../Constants/Colors';
// import fonts from '../../../../Constants/Fonts';
// import AuthContext from '../../../../auth/context'
// import DataSource from '../../../../Constants/DataSource';
// import TCKeyboardView from '../../../../components/TCKeyboardView';
// import uploadImages from '../../../../utils/imageAction';
// import TCFormProgress from '../../../../components/TCFormProgress';

// export default function CreateClubForm3({ navigation, route }) {
//   const [membershipFee, setMembershipFee] = useState(0);
//   const authContext = useContext(AuthContext)
//   const [feeCycle, setFeeCycle] = useState('');
//   const [membershipFeeDetail, setMembershipFeeDetail] = useState('');
//   const [loading, setloading] = useState(false);

//   const creatClubCall = async () => {
//     setloading(true)
//     const bodyParams = { ...route.params.createClubForm2 };

//     if (feeCycle !== '') {
//       bodyParams.membership_fee_type = feeCycle;
//     }
//     if (membershipFee !== 0) {
//       bodyParams.membership_fee = membershipFee;
//     }
//     if (membershipFeeDetail !== '') {
//       bodyParams.details = membershipFeeDetail;
//     }
//     bodyParams.privacy_profile = 'members';
//     bodyParams.allclubmemberautomatically_sync = false;
//     bodyParams.homefield_address_longitude = 0.0;
//     bodyParams.homefield_address_latitude = 0.0;
//     bodyParams.allclubmembermannually_sync = false;
//     bodyParams.office_address_longitude = 0.0;
//     bodyParams.office_address_latitude = 0.0;
//     bodyParams.privacy_events = 'everyone';
//     bodyParams.privacy_followers = 'everyone';
//     // eslint-disable-next-line no-unused-expressions
//     (bodyParams.createdAt = 0.0);
//     (bodyParams.entity_type = 'club');
//     bodyParams.unread = 0;

//     const entity = authContext.entity

//     if (bodyParams?.thumbnail || bodyParams?.background_thumbnail) {
//       const imageArray = [];
//       if (bodyParams?.thumbnail) {
//         imageArray.push({ path: bodyParams?.thumbnail });
//       }
//       if (bodyParams?.background_thumbnail) {
//         imageArray.push({ path: bodyParams?.background_thumbnail });
//       }
//       uploadImages(imageArray, authContext)
//         .then((responses) => {
//           const attachments = responses.map((item) => ({
//             type: 'image',
//             url: item.fullImage,
//             thumbnail: item.thumbnail,
//           }));
//           if (bodyParams?.thumbnail) {
//             bodyParams.thumbnail = attachments[0].thumbnail;
//             bodyParams.full_image = attachments[0].url;
//           }

//           if (bodyParams?.background_thumbnail) {
//             let bgInfo = attachments[0];
//             if (attachments.length > 1) {
//               bgInfo = attachments[1];
//             }
//             bodyParams.background_thumbnail = bgInfo.thumbnail;
//             bodyParams.background_full_image = bgInfo.url;
//           }
//           createGroup(
//             bodyParams,
//             entity.role === 'team' && entity.uid,
//             entity.role === 'team' && 'club',
//             authContext,
//           ).then((response) => {
//             setloading(false)
//             navigation.navigate('ClubCreatedScreen', {
//               groupName: response.payload.group_name,
//               group_id: response.payload.group_id,
//               entity_type: response.payload.entity_type,
//             }).catch((e) => {
//               setTimeout(() => {
//                 setloading(false)
//                 Alert.alert(strings.alertmessagetitle, e.message);
//               }, 10);
//             });
//           });
//         })
//         .catch((e) => {
//           setTimeout(() => {
//             Alert.alert(strings.appName, e.messages);
//           }, 0.1);
//         })
//         .finally(() => {
//           setloading(false);
//         });
//     } else {
//       createGroup(
//         bodyParams,
//         entity.role === 'team' && entity.uid,
//         entity.role === 'team' && 'club',
//         authContext,
//       ).then((response) => {
//         setloading(false)
//         // navigation.navigate('ClubCreatedScreen', {
//         //   groupName: response.payload.group_name,
//         //   group_id: response.payload.group_id,
//         //   entity_type: response.payload.entity_type,
//         // }
//         navigation.push('HomeScreen', {
//           uid: response.payload.group_id,
//           role: response.payload.entity_type,
//           backButtonVisible: false,
//           menuBtnVisible: false,
//           isEntityCreated: true,
//           groupName: response.payload.group_name,
//         }).catch((e) => {
//           setTimeout(() => {
//             setloading(false)
//             Alert.alert(strings.alertmessagetitle, e.message);
//           }, 10);
//         });
//       });
//     }
//   };

//   return (
//     <>
//       <TCFormProgress totalSteps={3} curruentStep={3}/>

//       <TCKeyboardView>
//         <ScrollView style={ styles.mainContainer }>

//           <ActivityLoader visible={loading} />

//           <Text style={ styles.registrationText }>
//             {strings.membershipFeeTitle}
//           </Text>

//           <View style={ styles.fieldView }>
//             <Text style={ styles.fieldTitle }>{strings.basicFeeTitle}</Text>
//             <View
//             style={ {
//               flexDirection: 'row',

//               marginTop: 12,

//               align: 'center',
//               marginLeft: 15,
//               marginRight: 15,
//               justifyContent: 'space-between',
//             } }>
//               <RNPickerSelect
//               placeholder={ {
//                 label: strings.feeCyclePlaceholder,
//                 value: null,
//               } }
//               items={ DataSource.FeeCycle }
//               onValueChange={ (value) => {
//                 setFeeCycle(value);
//               } }
//               value={ feeCycle }
//               useNativeAndroidPickerStyle={ false }
//               style={ {
//                 inputIOS: {
//                   height: 40,

//                   fontSize: wp('3.5%'),
//                   paddingVertical: 12,
//                   paddingHorizontal: 15,
//                   width: wp('45%'),
//                   color: 'black',
//                   paddingRight: 30,
//                   backgroundColor: colors.offwhite,

//                   borderRadius: 5,
//                   shadowColor: colors.googleColor,
//                   shadowOffset: { width: 0, height: 1 },
//                   shadowOpacity: 0.5,
//                   shadowRadius: 1,
//                 },
//                 inputAndroid: {
//                   height: 40,

//                   fontSize: wp('4%'),
//                   paddingVertical: 12,
//                   paddingHorizontal: 15,
//                   width: wp('45%'),
//                   color: 'black',
//                   paddingRight: 30,
//                   backgroundColor: colors.offwhite,

//                   borderRadius: 5,
//                   shadowColor: colors.googleColor,
//                   shadowOffset: { width: 0, height: 1 },
//                   shadowOpacity: 0.5,
//                   shadowRadius: 1,
//                   elevation: 3,
//                 },
//               } }
//               Icon={ () => (
//                 <Image
//                     source={ images.dropDownArrow }
//                     style={ styles.miniDownArrow }
//                   />
//               ) }
//             />
//               <View style={ styles.halfMatchFeeView }>
//                 <TextInput
//                 placeholder={ strings.enterFeePlaceholder }
//                 style={ styles.halffeeText }
//                 keyboardType={ 'decimal-pad' }
//                 onChangeText={ (text) => setMembershipFee(text) }
//                 value={ membershipFee }></TextInput>
//                 <Text style={ styles.curruency }>CAD</Text>
//               </View>
//             </View>
//           </View>
//           <View style={ styles.fieldView }>
//             <Text style={ styles.fieldTitle }>{strings.feeDetailsText}</Text>
//             <TextInput
//             style={ styles.descriptionTxt }
//             onChangeText={ (text) => setMembershipFeeDetail(text) }
//             value={ membershipFeeDetail }
//             multiline
//             textAlignVertical={'top'}
//             numberOfLines={ 4 }
//             placeholder={ strings.membershipPlaceholder }
//           />
//           </View>
//           <TouchableOpacity
//           onPress={ () => {
//             console.log('filling ended..');
//             creatClubCall();
//           } }>
//             <LinearGradient
//             colors={ [colors.yellowColor, colors.themeColor] }
//             style={ styles.nextButton }>
//               <Text style={ styles.nextButtonText }>{strings.doneTitle}</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </ScrollView>
//       </TCKeyboardView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   curruency: {
//     alignSelf: 'flex-end',
//     fontSize: wp('4%'),
//   },

//   descriptionTxt: {
//     height: 120,
//     // alignSelf: 'center',

//     fontSize: wp('3.8%'),

//     width: wp('92%'),
//     alignSelf: 'center',
//     marginTop: 12,

//     paddingVertical: 12,
//     paddingHorizontal: 15,

//     color: 'black',
//     paddingRight: 30,
//     backgroundColor: colors.offwhite,

//     borderRadius: 5,
//     shadowColor: colors.googleColor,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.5,
//     shadowRadius: 1,
//     elevation: 3,
//   },

//   fieldTitle: {
//     marginTop: hp('2%'),

//     fontSize: wp('3.8%'),
//     textAlign: 'left',
//     // fontFamily: fonts.RBold,
//     paddingLeft: 15,

//     color: colors.lightBlackColor,
//   },

//   halfMatchFeeView: {
//     alignSelf: 'center',
//     backgroundColor: colors.offwhite,

//     borderRadius: 5,
//     color: 'black',

//     elevation: 3,
//     flexDirection: 'row',
//     fontSize: wp('3.5%'),

//     height: 40,
//     paddingHorizontal: 15,
//     paddingRight: 30,

//     paddingVertical: 12,
//     shadowColor: colors.googleColor,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.5,
//     shadowRadius: 1,
//     width: wp('46%'),
//   },

//   halffeeText: {
//     alignSelf: 'center',
//     fontSize: wp('3.8%'),
//     height: 40,
//     width: '90%',
//   },
//   mainContainer: {
//     flex: 1,
//     flexDirection: 'column',
//   },

//   miniDownArrow: {
//     alignSelf: 'center',
//     height: 12,
//     resizeMode: 'contain',

//     right: 15,
//     tintColor: colors.grayColor,

//     top: 15,
//     width: 12,
//   },
//   nextButton: {
//     alignSelf: 'center',
//     borderRadius: 30,
//     height: 45,
//     marginBottom: 40,
//     marginTop: wp('12%'),
//     width: '90%',
//   },
//   nextButtonText: {
//     alignSelf: 'center',
//     color: colors.whiteColor,
//     fontFamily: fonts.RBold,
//     fontSize: wp('4%'),
//     marginVertical: 10,
//   },

//   registrationText: {
//     color: colors.lightBlackColor,
//     fontSize: wp('5%'),
//     marginLeft: 15,
//     marginTop: 20,
//   },

// });

import React, {useState, useContext, useRef} from 'react';
import {StyleSheet, View, Text, ScrollView, Alert} from 'react-native';

// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import TCInfoField from '../../../../components/TCInfoField';
import {createGroup} from '../../../../api/Groups';
import uploadImages from '../../../../utils/imageAction';

import AuthContext from '../../../../auth/context';
import ActivityLoader from '../../../../components/loader/ActivityLoader';
import images from '../../../../Constants/ImagePath';
import strings from '../../../../Constants/String';
import fonts from '../../../../Constants/Fonts';
import colors from '../../../../Constants/Colors';
import TCLabel from '../../../../components/TCLabel';
import TCProfileImageControl from '../../../../components/TCProfileImageControl';
import TCFormProgress from '../../../../components/TCFormProgress';
import TCGradientButton from '../../../../components/TCGradientButton';
import TCThinDivider from '../../../../components/TCThinDivider';

export default function CreateClubForm3({navigation, route}) {
  const [createClubForm2] = useState(route?.params?.createClubForm2);
  console.log('createClubForm2:=>', createClubForm2);
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
    check(PERMISSIONS.IOS.CAMERA).then((result) => {
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
    });
  };

  const nextOnPress = () => {
    setloading(true);
    const bodyParams = {
      ...createClubForm2,
      entity_type: 'club',
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
            entity.role === 'team' && entity.uid,
            entity.role === 'team' && 'team',
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
        entity.role === 'team' && entity.uid,
        entity.role === 'team' && 'team',
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
        showsVerticalScrollIndicator={false}
      >
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
          title={'Sports'}
          // value={createClubForm2?.sport?.join(' ,')}
          value={createClubForm2.sports_string}
          marginLeft={25}
          marginTop={30}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <TCInfoField
          title={'Club name'}
          value={createClubForm2?.group_name}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <TCInfoField
          title={'Home city'}
          value={createClubForm2?.city}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <TCInfoField
          title={'Language'}
          value={createClubForm2?.language.join(', ')}
          marginLeft={25}
        />
        <TCThinDivider marginTop={5} marginBottom={3} />

        <Text style={styles.describeTitle} numberOfLines={2}>
          Describe
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
        // title={'News Feed Post'}
        options={[strings.camera, strings.album, strings.cancelTitle]}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index === 0) {
            console.log('Open camera');
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
