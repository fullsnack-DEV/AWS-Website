import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  useRef,
} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';

import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../utils';
import {QBupdateDialogNameAndPhoto} from '../../utils/QuickBlox';
import TCInputBox from '../../components/TCInputBox';
import AuthContext from '../../auth/context';
import uploadImages from '../../utils/imageAction';
import strings from '../../Constants/String';
import ActivityLoader from '../../components/loader/ActivityLoader';

const MessageEditGroupScreen = ({route, navigation}) => {
  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();
  const [groupName, setGroupName] = useState('');
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [groupProfile, setGroupProfile] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.dialog) {
      console.log('route?.params?.dialog', route?.params?.dialog);
      setGroupName(route?.params?.dialog?.name);
      setGroupProfile({
        ...groupProfile,
        thumbnail: route?.params?.dialog?.photo,
      });
    }
  }, []);

  const openCamera = (width = 400, height = 400) => {
    ImagePicker.openCamera({
      width,
      height,
      cropping: true,
    }).then((data) => {
      setGroupProfile({...groupProfile, thumbnail: data.path});
      setProfileImageChanged(true);
    });
  };
  const openImagePicker = (width = 400, height = 400) => {
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((data) => {
      setGroupProfile({...groupProfile, thumbnail: data.path});
      setProfileImageChanged(true);
    });
  };

  const deleteImage = () => {
    setGroupProfile({...groupProfile, thumbnail: '', full_image: ''});
    setProfileImageChanged(false);
  };

  const onBGImageClicked = () => {
    if (groupProfile?.thumbnail) {
      actionSheetWithDelete.current.show();
    } else {
      actionSheet.current.show();
    }
  };

  const checkValidation = () => {
    if (groupName === '') {
      Alert.alert('Enter Chatroom Name');
      return false;
    }
    return true;
  };
  const onSaveButtonClicked = useCallback(() => {
    if (checkValidation()) {
      setLoading(true);
      const groupData = {...groupProfile};
      if (groupData?.thumbnail && groupData?.thumbnail !== '') {
        const imageArray = [];
        if (profileImageChanged) {
          imageArray.push({path: groupData.thumbnail});
          uploadImages(imageArray, authContext)
            .then((responses) => {
              console.log('image response', responses);

              if (profileImageChanged) {
                setGroupProfile({
                  ...groupProfile,
                  thumbnail: responses[0].thumbnail,
                  full_image: responses[0].fullImage,
                });
                groupData.full_image = responses[0].thumbnail;
                groupData.thumbnail = responses[0].fullImage;
              }
              console.log('if press', groupData);

              onDonePress(groupData);
            })
            .catch((e) => {
              setTimeout(() => {
                Alert.alert(strings.appName, e.messages);
              }, 0.1);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          onDonePress(groupData);
        }
      } else {
        console.log('else press', groupData);
        onDonePress(groupData);
      }
    }
  }, [authContext, checkValidation, groupProfile, profileImageChanged]);

  const updateDialog = useCallback(
    (dialogId, photo) => {
      QBupdateDialogNameAndPhoto(dialogId, groupName, photo, authContext)
        .then((res) => {
          if (res?.status === 'error') {
            console.log('QB :', res?.error);
          } else {
            route.params.onPressDone(res);
            navigation.pop(2);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [authContext, groupName, navigation, route.params],
  );

  const onDonePress = useCallback(
    (data) => {
      if (route?.params?.dialog) {
        const dialogId = route?.params?.dialog?.id;
        if (data?.thumbnail && data?.thumbnail !== '') {
          console.log('if update call', data);
          updateDialog(dialogId, data?.thumbnail);
        } else {
          console.log('else update call', data);

          updateDialog(dialogId, '');
        }
      }
    },
    [route?.params?.dialog, updateDialog],
  );

  const renderHeader = useMemo(
    () => (
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FastImage
              resizeMode={'contain'}
              source={images.backArrow}
              style={styles.backImageStyle}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.eventTitleTextStyle}>Message</Text>
        }
        rightComponent={
          <TouchableOpacity style={{padding: 2}} onPress={onSaveButtonClicked}>
            <Text
              style={{
                ...styles.eventTextStyle,
                width: 100,
                textAlign: 'right',
              }}>
              Done
            </Text>
          </TouchableOpacity>
        }
      />
    ),
    [navigation, onSaveButtonClicked],
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      {renderHeader}
      <View style={styles.separateLine} />
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={() => {
            onBGImageClicked();
          }}>
          <FastImage
            resizeMode={'cover'}
            source={
              // eslint-disable-next-line no-nested-ternary
              groupProfile?.thumbnail && groupProfile?.thumbnail !== ''
                ? {uri: groupProfile?.thumbnail}
                : images.groupUsers
            }
            style={styles.imageContainer}
          />
          <FastImage
            resizeMode={'contain'}
            source={images.certificateUpload}
            style={styles.absoluteCameraIcon}
          />
        </TouchableOpacity>
        <View style={styles.inputBoxContainer}>
          <Text style={styles.chatRoomName}>Chatroom Name</Text>
          <TCInputBox
            placeHolderText={'New Group'}
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>
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
            openImagePicker();
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
            openImagePicker();
          } else if (index === 2) {
            deleteImage();
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backImageStyle: {
    height: 20,
    width: 16,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  eventTitleTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  eventTextStyle: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    alignSelf: 'center',
  },

  imageContainer: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
  separateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
    marginBottom: hp(2),
  },
  avatarContainer: {
    height: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(100),
  },
  absoluteCameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    height: wp(5),
    width: wp(5),
  },
  inputBoxContainer: {
    marginTop: hp(5),
  },
  chatRoomName: {
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginBottom: 10,
  },
});
export default MessageEditGroupScreen;
