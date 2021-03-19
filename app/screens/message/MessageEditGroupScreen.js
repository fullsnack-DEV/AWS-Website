import React, {
  useState, useEffect, useMemo, useCallback, useContext,
} from 'react';
import {
  Alert, Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import QB from 'quickblox-react-native-sdk';
import ImageResizer from 'react-native-image-resizer';
import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import { QB_MAX_ASSET_SIZE_UPLOAD, QBgetFileURL, QBupdateDialogNameAndPhoto } from '../../utils/QuickBlox';
import TCInputBox from '../../components/TCInputBox';
import TCInnerLoader from '../../components/TCInnerLoader';
import AuthContext from '../../auth/context';
import { T_COMPRESSION_RATE, thumbnailImageSize } from '../../utils/imageAction';

const MessageEditGroupScreen = ({ route, navigation }) => {
  const authContext = useContext(AuthContext);
  const [groupName, setGroupName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadImageInProgress, setUploadImageInProgress] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (route?.params?.dialog) {
      setGroupName(route?.params?.dialog?.name)
      setSelectedImage(route?.params?.dialog?.photo)
    }
  }, [])

  const uploadImage = useCallback(() => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      mediaType: 'photo',
    }).then(async (image) => {
      setUploadImageInProgress(true);
      setSelectedImage(image ?? null);
      const imagePath = Platform?.OS === 'ios' ? image?.sourceURL : image?.path;
      const validImageSize = image?.size <= QB_MAX_ASSET_SIZE_UPLOAD;

      if (!validImageSize) {
        Alert.alert('file image size error')
      } else {
        const thumbImgData = thumbnailImageSize(image)
        const resThumb = await ImageResizer.createResizedImage(imagePath, thumbImgData.width, thumbImgData.height, 'JPEG', T_COMPRESSION_RATE, 0, null)
        QB.content.subscribeUploadProgress({ url: resThumb?.uri });
        QB.content.upload({ url: imagePath, public: false }).then((file) => {
          setUploadImageInProgress(false);
          setUploadedFile(file);
        }).catch((e) => {
          setUploadImageInProgress(false);
          Alert.alert(e.message);
        });
      }
    })
  }, [])

  const updateDialog = useCallback((dialogId, photo) => {
    QBupdateDialogNameAndPhoto(dialogId, groupName, photo, authContext).then((res) => {
      if (res?.status === 'error') {
        console.log('QB :', res?.error)
      } else {
        route.params.onPressDone(res);
        navigation.goBack();
      }
    }).catch((error) => {
      console.log(error);
    })
  }, [authContext, groupName, navigation, route.params])

  const onDonePress = useCallback(() => {
    if (groupName !== '') {
      if (route?.params?.dialog) {
        const dialogId = route?.params?.dialog?.id;
        if (uploadedFile) {
          QBgetFileURL(uploadedFile.uid).then((fileUrl) => {
            updateDialog(dialogId, fileUrl)
          }).catch(() => {
            navigation.goBack();
          })
        } else {
          updateDialog(dialogId, '')
        }
      }
    } else {
      Alert.alert('Enter Chatroom Name')
    }
  }, [groupName, navigation, route?.params?.dialog, updateDialog, uploadedFile])

  const renderHeader = useMemo(() => (
    <Header
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FastImage resizeMode={'contain'} source={images.backArrow} style={styles.backImageStyle}/>
            </TouchableOpacity>
          }
          centerComponent={
            <Text style={styles.eventTitleTextStyle}>Message</Text>
          }
          rightComponent={!uploadImageInProgress
            && <TouchableOpacity style={{ padding: 2 }} onPress={onDonePress}>
              <Text style={styles.eventTextStyle}>Done</Text>
            </TouchableOpacity>
          }
      />
  ), [navigation, onDonePress, uploadImageInProgress])

  return (
    <SafeAreaView style={styles.mainContainer}>
      {renderHeader}
      <View style={styles.separateLine}/>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={uploadImage}>
          {uploadImageInProgress
          && <View style={{
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 50,
            position: 'absolute',
            zIndex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TCInnerLoader visible={true} />
          </View>}
          <FastImage
            resizeMode={'cover'}
            // eslint-disable-next-line no-nested-ternary
            source={selectedImage?.path
                ? { uri: selectedImage?.path }
                : selectedImage
                    ? { uri: selectedImage }
                    : images.groupUsers}
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
          <TCInputBox placeHolderText={'New Group'} value={groupName} onChangeText={setGroupName}/>
        </View>
      </View>
    </SafeAreaView>
  )
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
