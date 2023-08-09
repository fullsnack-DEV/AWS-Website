// @flow
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {strings} from '../../../../Localization/translation';
import AuthContext from '../../../auth/context';
import CustomModalWrapper from '../../../components/CustomModalWrapper';
import ActivityLoader from '../../../components/loader/ActivityLoader';
import BottomSheet from '../../../components/modals/BottomSheet';
import colors from '../../../Constants/Colors';
import fonts from '../../../Constants/Fonts';
import {ModalTypes} from '../../../Constants/GeneralConstants';
import images from '../../../Constants/ImagePath';
import {deleteConfirmation} from '../../../utils';
import uploadImages from '../../../utils/imageAction';

const UpdateChannelInfo = ({
  isVisible = false,
  closeModal = () => {},
  channel = {},
}) => {
  const [groupProfile, setGroupProfile] = useState({});
  const [bottomSheetOptions, setBottomSheetOptions] = useState([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (isVisible) {
      const {data} = channel;
      setGroupName(data.name);
      setGroupProfile(data.image);
    }
  }, [isVisible, channel]);

  const openCamera = (width = 400, height = 400) => {
    ImagePicker.openCamera({
      width,
      height,
      cropping: true,
    }).then((data) => {
      setGroupProfile({thumbnail: data.path});
      setShowBottomSheet(false);
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
      setGroupProfile({thumbnail: data.path});
      setShowBottomSheet(false);
      setProfileImageChanged(true);
    });
  };

  const deleteImage = () => {
    setGroupProfile({thumbnail: '', full_image: ''});
    setProfileImageChanged(false);
  };

  const handleBottomSheetOption = (option) => {
    switch (option) {
      case strings.camera:
        openCamera();
        break;

      case strings.album:
        openImagePicker();
        break;

      case strings.deleteTitle:
        deleteConfirmation(
          strings.appName,
          strings.deleteConfirmationText,
          () => deleteImage(),
        );
        break;

      default:
        break;
    }
  };

  const onSaveButtonClicked = () => {
    setLoading(true);

    if (profileImageChanged) {
      const imageArray = [{path: groupProfile.thumbnail}];

      uploadImages(imageArray, authContext)
        .then((responses) => {
          const profile = {
            thumbnail: responses[0].thumbnail,
            full_image: responses[0].fullImage,
          };

          setGroupProfile(profile);
          setProfileImageChanged(false);
          onDonePress(profile);
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
      onDonePress();
    }
  };

  const onDonePress = async (
    profileImage = {thumbnail: '', full_image: ''},
  ) => {
    const obj = {};

    obj.image = profileImage;
    obj.name = groupName;
    try {
      await channel.updatePartial({set: obj});
    } catch (error) {
      console.log('error ==>', error);
    }
    setLoading(false);
    closeModal();
  };

  return (
    <CustomModalWrapper
      isVisible={isVisible}
      closeModal={closeModal}
      modalType={ModalTypes.style1}
      headerRightButtonText={strings.save}
      title={strings.editChatRoom}
      containerStyle={{height: '90%'}}
      onRightButtonPress={onSaveButtonClicked}
      isFullTitle
      headerLeftIconStyle={{width: 50}}>
      <ActivityLoader visible={loading} />
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => {
            if (groupProfile.thumbnail) {
              setBottomSheetOptions([
                strings.camera,
                strings.album,
                strings.deleteTitle,
              ]);
            } else {
              setBottomSheetOptions([strings.camera, strings.album]);
            }
            setShowBottomSheet(true);
          }}>
          <Image
            source={
              groupProfile?.thumbnail
                ? {uri: groupProfile.thumbnail}
                : images.groupUsers
            }
            style={[styles.image, {borderRadius: 40}]}
          />
          <View style={styles.absoluteCameraIcon}>
            <Image source={images.certificateUpload} style={styles.image} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{marginBottom: 35}}>
        <Text style={styles.chatRoomName}>
          {strings.chatroomName.toUpperCase()}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={strings.newGroup}
            placeholderTextColor={colors.userPostTimeColor}
            value={groupName}
            style={styles.input}
            onChangeText={(text) => setGroupName(text)}
          />
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setGroupName('')}>
            <Image source={images.closeRound} style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet
        type="ios"
        isVisible={showBottomSheet}
        closeModal={() => setShowBottomSheet(false)}
        optionList={bottomSheetOptions}
        onSelect={handleBottomSheetOption}
      />
    </CustomModalWrapper>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    marginBottom: 35,
    alignItems: 'center',
  },
  imageContainer: {
    height: 75,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.grayBackgroundColor,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  absoluteCameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 25,
    width: 25,
  },
  chatRoomName: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: colors.textFieldBackground,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
  },
  closeIcon: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default UpdateChannelInfo;
