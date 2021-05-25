import React, {
    useState, useContext, useRef,
    } from 'react';
   import {
     StyleSheet,
     View,
     Text,
     ScrollView,
     Alert,

   } from 'react-native';

   // import {
   //   widthPercentageToDP as wp,
   //   heightPercentageToDP as hp,
   // } from 'react-native-responsive-screen';
   import ActionSheet from 'react-native-actionsheet';
   import ImagePicker from 'react-native-image-crop-picker';
   import TCInfoField from '../../../../components/TCInfoField';
   import { createGroup } from '../../../../api/Groups';
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
   import TCPlayerImageInfo from '../../../../components/TCPlayerImageInfo';

   export default function RespondToInviteScreen({ navigation, route }) {
     const { createTeamForm2 } = route?.params;

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
       ImagePicker.openCamera({
         width,
         height,
         cropping: true,
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

     const nextOnPress = () => {
       let player1 = {};
       let player2 = {};
       setloading(true);
       const bodyParams = {
         ...createTeamForm2,
         entity_type: 'team',
       //   is_admin: true,
       //  invite_required: true,
       //  privacy_profile: 'members',
       //  createdAt: 0.0,
       //  unread: 0,
       //  homefield_address_longitude: 0.0,
       //  homefield_address_latitude: 0.0,
       //  office_address_latitude: 0.0,
       //  office_address_longitude: 0.0,
       //  privacy_members: 'everyone',
       //  approval_required: false,
       //  is_following: false,
       //  privacy_events: 'everyone',
       //  is_joined: false,
       //  privacy_followers: 'everyone',
       //  should_hide: false,
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

       const entity = authContext.entity;
       if (bodyParams?.thumbnail || bodyParams?.background_thumbnail) {
         const imageArray = [];
         if (bodyParams?.thumbnail) {
           imageArray.push({ path: bodyParams?.thumbnail });
         }
         if (bodyParams?.background_thumbnail) {
           imageArray.push({ path: bodyParams?.background_thumbnail });
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
               entity.uid,
               entity.role === 'club' ? 'club' : 'user',
               authContext,
             )
               .then((response) => {
                 setloading(false);

                 if (entity.role === ('user' || 'player') && bodyParams?.sport?.toLowerCase() === 'Tennis Double'.toLowerCase()) {
                   navigation.push('HomeScreen', {
                     uid: response.payload.group_id,
                     role: response.payload.entity_type,
                     backButtonVisible: false,
                     menuBtnVisible: false,
                     isDoubleSportTeamCreated: true,
                     name: player2?.full_name,

                   });
                 } else {
                   navigation.push('HomeScreen', {
                     uid: response.payload.group_id,
                     role: response.payload.entity_type,
                     backButtonVisible: false,
                     menuBtnVisible: false,
                     isEntityCreated: true,
                     groupName: response.payload.group_name,
                     entityObj: response.payload,
                   });
                 }
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
               Alert.alert('Towns Cup', e.messages);
             }, 0.1);
           });
       } else {
         createGroup(
           bodyParams,
           entity.uid,
           entity.role === 'club' ? 'club' : 'user',
           authContext,
         )
           .then((response) => {
             setloading(false);
             if ((entity.role === 'user' || entity.role === 'player') && bodyParams?.sport?.toLowerCase() === 'Tennis Double'.toLowerCase()) {
               navigation.push('HomeScreen', {
                 uid: response.payload.group_id,
                 role: response.payload.entity_type,
                 backButtonVisible: false,
                 menuBtnVisible: false,
                 isDoubleSportTeamCreated: true,
                 name: player2?.full_name,

               });
             } else {
               navigation.push('HomeScreen', {
                 uid: response.payload.group_id,
                 role: response.payload.entity_type,
                 backButtonVisible: false,
                 menuBtnVisible: false,
                 isEntityCreated: true,
                 groupName: response.payload.group_name,
                 entityObj: response.payload,
               });
             }
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
             profileImage={thumbnail ? { uri: thumbnail } : undefined}
             profileImagePlaceholder={images.teamPlaceholder}
             bgImage={backgroundThumbnail ? { uri: backgroundThumbnail } : undefined}
             onPressBGImage={() => onBGImageClicked()}
             onPressProfileImage={() => onProfileImageClicked()}
             showEditButtons
           />

           <TCInfoField
             title={'Sport'}
             value={createTeamForm2?.sport}
             marginLeft={25}
             marginTop={30}
           />
           <TCThinDivider marginTop={5} marginBottom={3} />

           {createTeamForm2?.sport?.toLowerCase() === 'Tennis Double'.toLowerCase() && <View>
             <TCPlayerImageInfo
             title={'Players'}
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
           }

           <TCInfoField
             title={'Team name'}
             value={createTeamForm2?.group_name}
             marginLeft={25}
           />
           <TCThinDivider marginTop={5} marginBottom={3} />

           <TCInfoField
             title={'Home city'}
             value={createTeamForm2?.city}
             marginLeft={25}
           />
           <TCThinDivider marginTop={5} marginBottom={3} />

           {createTeamForm2?.sport?.toLowerCase() !== 'Tennis Double'.toLowerCase() && <View>
             <TCInfoField
             title={'Members’ gender'}
             value={createTeamForm2?.gender?.charAt(0)?.toUpperCase() + createTeamForm2?.gender?.slice(1)}
             marginLeft={25}
           />
             <TCThinDivider marginTop={5} marginBottom={3} />

             <TCInfoField
             title={'Members’ ages'}
             value={`Min ${createTeamForm2?.min_age} Max ${createTeamForm2?.max_age}`}
             marginLeft={25}
           />
             <TCThinDivider marginTop={5} marginBottom={3} />
           </View>}

           <TCInfoField
             title={'Language'}
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
           <View style={{ flex: 1 }} />

           {/*
            {parentGroupID !== '' && (
              <TouchableOpacity
                onPress={() => {
                  checkValidation();

                  if (sports !== '' && teamName !== '' && location !== '') {
                    const obj = {
                      sport: sports,
                      group_name: teamName,
                      gender,
                      min_age: minAge,
                      max_age: maxAge,
                      city,
                      state_abbr: state,
                      country,
                      currency_type: curruency,

                    };
                    if (thumbnail) {
                      obj.thumbnail = thumbnail;
                    }
                    if (backgroundThumbnail) {
                      obj.background_thumbnail = backgroundThumbnail;
                    }
                    if (player1ID !== '' && player2 !== '') {
                      navigation.navigate('CreateTeamForm2', {
                        createTeamForm1: {
                          ...obj,
                          parent_group_id: parentGroupID,
                          player1: player1ID,
                          player2: player2ID,
                        },
                      });
                    } else {
                      navigation.navigate('CreateTeamForm2', {
                        createTeamForm1: {
                          ...obj,
                          parent_group_id: parentGroupID,
                        },
                      });
                    }
                  }
                }}>
                <LinearGradient
                  colors={[colors.yellowColor, colors.themeColor]}
                  style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {parentGroupID === '' && (
              <TouchableOpacity
                onPress={() => {
                  checkValidation();

                  if (sports !== '' && teamName !== '' && location !== '') {
                    const obj = {
                      sport: sports,
                      group_name: teamName,
                      gender,
                      min_age: minAge,
                      max_age: maxAge,
                      city,
                      state_abbr: state,
                      country,
                      currency_type: curruency,
                    };
                    if (thumbnail) {
                      obj.thumbnail = thumbnail;
                    }
                    if (backgroundThumbnail) {
                      obj.background_thumbnail = backgroundThumbnail;
                    }
                    if (player1ID !== '' && player2 !== '') {
                      navigation.navigate('CreateTeamForm2', {
                        createTeamForm1: {
                          ...obj,
                          player1: player1ID,
                          player2: player2ID,
                        },
                      });
                    } else {
                      console.log('MOVE TO NEXT');
                      navigation.navigate('CreateTeamForm2', {
                        createTeamForm1: {
                          ...obj,
                        },
                      });
                    }
                  }
                }}>
                <LinearGradient
                  colors={[colors.yellowColor, colors.themeColor]}
                  style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>{strings.nextTitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )} */}
         </ScrollView>
         <TCGradientButton
           isDisabled={false}
           title={strings.doneTitle}
           style={{ marginBottom: 30 }}
           onPress={nextOnPress}
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
