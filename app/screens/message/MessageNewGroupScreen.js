import React, {useState, useEffect, useContext} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AuthContext from '../../auth/context';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import ActivityLoader from '../../components/loader/ActivityLoader';
import * as Utility from '../../utils/index';
import {strings} from '../../../Localization/translation';
import uploadImages from '../../utils/imageAction';
import ScreenHeader from '../../components/ScreenHeader';
import SelectedInviteeCard from './components/SelectedInviteeCard';
import BottomSheet from '../../components/modals/BottomSheet';
import useCreateChannel from '../../hooks/useCreateChannel';

const NUM_OF_COLS = 5;

const MessageNewGroupScreen = ({route, navigation}) => {
  const authContext = useContext(AuthContext);

  const {selectedInviteesData} = route.params;
  const [selectedInvitees, setSelectedInvitees] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [groupProfile, setGroupProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [bottomSheetOptions, setBottomSheetOptions] = useState([]);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const {createChannel} = useCreateChannel();

  useEffect(() => {
    if (selectedInviteesData?.length > 0) {
      const dummyCount =
        NUM_OF_COLS - (selectedInviteesData.length % NUM_OF_COLS);
      const dummyViews = [];
      for (let index = 0; index < dummyCount; index++) {
        dummyViews.push({});
      }
      setSelectedInvitees([...selectedInviteesData, ...dummyViews]);
    }
  }, [selectedInviteesData]);

  useEffect(() => {
    if (route?.params?.dialog) {
      setGroupName(route?.params?.dialog?.name);
    }
  }, [route?.params?.dialog]);

  const toggleSelection = (isChecked, user) => {
    const data = selectedInvitees;
    if (isChecked) {
      const uIndex = data.findIndex(({id}) => user.id === id);
      if (uIndex !== -1) data.splice(uIndex, 1);
    } else {
      data.push(user);
    }
    setSelectedInvitees([...data]);
    if (data.length === 0) {
      navigation.navigate('MessageInviteScreen');
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

  const onDonePress = async (profileImage = '') => {
    const list = selectedInvitees.filter((invitee) => invitee.id);

    createChannel(list, profileImage, groupName)
      .then((channel) => {
        if (channel !== null) {
          setLoading(false);
          navigation.replace('MessageChatScreen', {
            channel,
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        Alert.alert(strings.alertmessagetitle, err.message);
      });
  };

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
        Utility.deleteConfirmation(
          strings.appName,
          strings.deleteConfirmationText,
          () => deleteImage(),
        );
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ActivityLoader visible={loading} />
      <ScreenHeader
        title={strings.newGroup}
        leftIcon={images.backArrow}
        leftIconPress={() => navigation.goBack()}
        isRightIconText
        rightButtonText={strings.create}
        onRightButtonPress={onSaveButtonClicked}
      />

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
              setShowBottomSheet(true);
            }
          }}>
          <Image
            source={
              groupProfile.thumbnail
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

      <View style={{paddingHorizontal: 15, marginBottom: 35}}>
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
          <TouchableOpacity style={styles.closeIcon}>
            <Image source={images.closeRound} style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{paddingHorizontal: 15, flex: 1}}>
        <Text style={[styles.chatRoomName, {marginBottom: 25}]}>
          {strings.participants}
        </Text>
        {selectedInvitees.length > 0 ? (
          <FlatList
            data={selectedInvitees}
            keyExtractor={(item, index) => index.toString()}
            numColumns={5}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{justifyContent: 'space-evenly'}}
            renderItem={({item}) => (
              <View style={styles.participantsCard}>
                {item.id ? (
                  <SelectedInviteeCard
                    item={item}
                    onCancel={() => {
                      toggleSelection(true, item);
                    }}
                    containerStyle={{marginRight: 0}}
                  />
                ) : null}
              </View>
            )}
          />
        ) : null}
      </View>

      <BottomSheet
        type="ios"
        isVisible={showBottomSheet}
        closeModal={() => setShowBottomSheet(false)}
        optionList={bottomSheetOptions}
        onSelect={handleBottomSheetOption}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  avatarContainer: {
    paddingVertical: 25,
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
  participantsCard: {
    flex: 1,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default MessageNewGroupScreen;
