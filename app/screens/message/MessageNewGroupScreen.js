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
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import QB from 'quickblox-react-native-sdk';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import AuthContext from '../../auth/context';

import Header from '../../components/Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../utils';
import {
  getQBProfilePic,
  QB_DIALOG_TYPE,
  QBcreateDialog,
  QBLogout,
  QBlogin,
  QB_ACCOUNT_TYPE,
  QBconnectAndSubscribe,
  QBupdateDialogNameAndPhoto,
} from '../../utils/QuickBlox';
import TCInputBox from '../../components/TCInputBox';
import ActivityLoader from '../../components/loader/ActivityLoader';
import * as Utility from '../../utils/index';
import {strings} from '../../../Localization/translation';
import uploadImages from '../../utils/imageAction';

const MessageNewGroupScreen = ({route, navigation}) => {
  const authContext = useContext(AuthContext);
  const actionSheet = useRef();
  const actionSheetWithDelete = useRef();

  const {selectedInviteesData} = route.params;
  const [selectedInvitees, setSelectedInvitees] = useState([
    ...selectedInviteesData,
  ]);
  const [groupName, setGroupName] = useState('');
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [groupProfile, setGroupProfile] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (route?.params?.dialog) {
      setGroupName(route?.params?.dialog?.name);
    }
  }, []);

  const checkValidation = () => {
    if (groupName === '') {
      Alert.alert(strings.enterChatroomName);
      return false;
    }
    return true;
  };

  const toggleSelection = useCallback(
    (isChecked, user) => {
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
    },
    [navigation, selectedInvitees],
  );

  const renderSelectedContactList = useCallback(
    ({item}) => {
      const customData =
        item && item.customData ? JSON.parse(item.customData) : {};
      const entityType = _.get(customData, ['entity_type'], '');
      const fullName = _.get(customData, ['full_name'], '');
      const fullImage = _.get(customData, ['full_image'], '');
      const type =
        entityType === 'player'
          ? QB.chat.DIALOG_TYPE.CHAT
          : QB.chat.DIALOG_TYPE.GROUP_CHAT;

      return (
        <View style={styles.selectedContactInnerView}>
          <View>
            <View>
              <View style={styles.selectedContactImageContainer}>
                <FastImage
                  resizeMode={'contain'}
                  source={getQBProfilePic(type, '', fullImage)}
                  style={styles.selectedContactImage}
                />
              </View>
              <TouchableOpacity
                style={styles.selectedContactButtonView}
                onPress={() => toggleSelection(true, item)}>
                <Image
                  source={images.cancelImage}
                  style={styles.deSelectedContactImage}
                />
              </TouchableOpacity>
            </View>
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={2}
              style={{
                flex: 1,
                fontSize: 10,
                fontFamily: fonts.RBold,
                textAlign: 'center',
                width: 50,
              }}>
              {fullName}
            </Text>
          </View>
        </View>
      );
    },
    [toggleSelection],
  );

  const switchQBAccount = async (accountData, entity) => {
    let currentEntity = entity;
    const entityType = accountData?.entity_type;
    const uid = entityType === 'player' ? 'user_id' : 'group_id';
    QBLogout()
      .then(() => {
        const {USER, CLUB, TEAM} = QB_ACCOUNT_TYPE;
        let accountType = USER;
        if (entityType === 'club') accountType = CLUB;
        else if (entityType === 'team') accountType = TEAM;

        QBlogin(
          accountData[uid],
          {
            ...accountData,
            full_name: accountData.group_name,
          },
          accountType,
        )
          .then(async (res) => {
            currentEntity = {
              ...currentEntity,
              QB: {...res.user, connected: true, token: res?.session?.token},
            };
            authContext.setEntity({...currentEntity});
            await Utility.setStorage('authContextEntity', {...currentEntity});
            QBconnectAndSubscribe(currentEntity)
              .then((qbRes) => {
                setLoading(false);
                if (qbRes?.error) {
                  console.log(strings.appName, qbRes?.error);
                }
              })
              .catch(() => {
                setLoading(false);
              });
          })
          .catch(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSaveButtonClicked = () => {
    if (checkValidation()) {
      setLoading(true);
      const groupData = {...groupProfile};
      if (profileImageChanged) {
        const imageArray = [];
        if (profileImageChanged) {
          imageArray.push({path: groupData.thumbnail});
        }
        uploadImages(imageArray, authContext)
          .then((responses) => {
            console.log('image response', responses);

            if (profileImageChanged) {
              setGroupProfile({
                ...groupProfile,
                thumbnail: responses[0].thumbnail,
                full_image: responses[0].fullImage,
              });
              setProfileImageChanged(false);
              groupData.full_image = responses[0].thumbnail;
              groupData.thumbnail = responses[0].fullImage;
            }

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
    }
  };

  const updateDialog = useCallback(
    (dialogId, photo) => {
      QBupdateDialogNameAndPhoto(dialogId, groupName, photo, authContext)
        .then((res) => {
          console.log('resssss', res);
          if (res?.status === 'error') {
            console.log('QB :', res?.error);
          } else {
            navigation.replace('MessageChat', {dialog: res});
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [authContext, groupName, navigation],
  );

  const onDonePress = useCallback(
    (data) => {
      if (checkValidation()) {
        setLoading(true);
        const occupantsIds = [];
        selectedInvitees.filter((item) => occupantsIds.push(item.id));
        if (occupantsIds.length > 0) {
          QBcreateDialog(occupantsIds, QB_DIALOG_TYPE.GROUP, groupName)
            .then((res) => {
              setLoading(false);

              console.log('rerererererer', res);
              setSelectedInvitees([]);

              if (res?.id) {
                const dialogId = res?.id;
                if (data?.thumbnail && data?.thumbnail !== '') {
                  updateDialog(dialogId, data?.thumbnail);
                } else {
                  updateDialog(dialogId, '');
                }
              }
            })
            .catch((error) => {
              setLoading(false);
              switchQBAccount(authContext.entity, authContext.entity);
              console.log(error);
            });
        }
      }
    },
    [
      authContext.entity,
      checkValidation,
      groupName,
      selectedInvitees,
      updateDialog,
    ],
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
          <Text style={styles.eventTitleTextStyle}>{strings.newGroup}</Text>
        }
        rightComponent={
          <TouchableOpacity style={{padding: 2}} onPress={onSaveButtonClicked}>
            <Text
              style={{
                ...styles.eventTextStyle,
                width: 100,
                textAlign: 'right',
              }}>
              Create
            </Text>
          </TouchableOpacity>
        }
      />
    ),
    [navigation, onDonePress],
  );

  const renderParticipants = useMemo(
    () => (
      <View style={styles.participantsContainer}>
        <Text style={styles.participantsText}>Participants</Text>
        {selectedInvitees.length > 0 && (
          <View style={styles.selectedInviteesMainView}>
            <FlatList
              style={{flex: 1, alignSelf: 'center'}}
              contentContainerStyle={{
                alignSelf:
                  selectedInvitees.length >= 4 ? 'center' : 'flex-start',
              }}
              numColumns={5}
              showsHorizontalScrollIndicator={false}
              data={selectedInvitees || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSelectedContactList}
            />
          </View>
        )}
      </View>
    ),
    [selectedInvitees],
  );

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
          <View
            style={{
              height: 80,
              width: 80,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              backgroundColor: colors.whiteColor,
              shadowColor: colors.googleColor,
              shadowOffset: {width: 0, height: 1.5},
              shadowOpacity: 0.16,
              shadowRadius: 3,
              elevation: 3,
            }}>
            <FastImage
              resizeMode={'contain'}
              source={
                groupProfile?.thumbnail
                  ? {uri: groupProfile.thumbnail}
                  : images.groupUsers
              }
              style={styles.imageContainer}
            />
          </View>
          <FastImage
            resizeMode={'contain'}
            source={images.certificateUpload}
            style={styles.absoluteCameraIcon}
          />
        </TouchableOpacity>
        <View style={styles.inputBoxContainer}>
          <Text style={styles.chatRoomName}>{strings.chatroomName}</Text>
          <View>
            <TCInputBox
              style={{borderRadius: 10}}
              placeHolderText={strings.newGroup}
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>
        </View>
      </View>
      {renderParticipants}
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
            Utility.deleteConfirmation(
              strings.appName,
              strings.deleteConfirmationText,
              () => deleteImage(),
            );
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
    height: 40,
    width: 10,
    tintColor: colors.lightBlackColor,
    resizeMode: 'contain',
  },
  eventTitleTextStyle: {
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
  },
  eventTextStyle: {
    color: colors.lightBlackColor,
    fontSize: 16,
    fontFamily: fonts.RMedium,
    alignSelf: 'center',
  },

  imageContainer: {
    height: 73,
    width: 73,
    borderRadius: 150,
  },
  selectedInviteesMainView: {
    alignItems: 'flex-start',
    flex: 1,
    width: wp(100),
    paddingVertical: hp(1),
    marginHorizontal: 15,
    backgroundColor: colors.whiteColor,
  },
  selectedContactButtonView: {
    height: hp(2),
    width: hp(2),
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: hp(2),
    position: 'absolute',
    top: 0,
    right: 0,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContactInnerView: {
    marginHorizontal: 7.5,
    marginBottom: hp(2),
  },
  selectedContactImageContainer: {
    backgroundColor: colors.whiteColor,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(6),
    alignSelf: 'center',
    shadowColor: colors.blackColor,
    shadowOffset: {width: 0, height: 1.5},
    marginBottom: 5,
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedContactImage: {
    width: 41,
    height: 41,
    borderRadius: wp(6),
    alignSelf: 'center',
    // borderWidth: 0.5,
  },
  deSelectedContactImage: {
    width: 10,
    height: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    tintColor: colors.whiteColor,
  },
  separateLine: {
    borderColor: colors.grayColor,
    borderWidth: 0.5,
    width: wp(100),
    marginBottom: hp(2),
  },
  avatarContainer: {
    // backgroundColor: 'red',
    height: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(100),
  },
  absoluteCameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    height: 22,
    width: 22,
  },
  inputBoxContainer: {
    marginTop: hp(5),
  },
  chatRoomName: {
    color: colors.lightBlackColor,
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginBottom: 10,
  },
  participantsContainer: {
    alignItems: 'center',
    width: '100%',
    paddingTop: wp(2),
    padding: wp(5),
    flex: 1,
  },
  participantsText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 20,
    fontFamily: fonts.RRegular,
    marginBottom: wp(1),
  },
});
export default MessageNewGroupScreen;
