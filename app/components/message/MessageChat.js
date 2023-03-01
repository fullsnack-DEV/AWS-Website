/* eslint-disable no-nested-ternary */
/* eslint-disable no-useless-concat */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
  useCallback,
  Fragment,
} from 'react';

import {
  View,
  Platform,
  StyleSheet,
  NativeEventEmitter,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
  Alert,
  TextInput,
  Pressable,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import {useIsFocused} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import QB from 'quickblox-react-native-sdk';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import Video from 'react-native-video';
import TCMessage from '../TCMessage';
import Header from '../Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCInputBox from '../TCInputBox';
import TCGroupNameBadge from '../TCGroupNameBadge';
import {
  getHitSlop,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../utils';
import AuthContext from '../../auth/context';

import {
  QB_DIALOG_TYPE,
  QB_MAX_ASSET_SIZE_UPLOAD,
  QBcreateDialog,
  QBgetMessages,
  QBgetUserDetail,
  QBsendMessage,
  QBleaveDialog,
  QBDeleteMessage,
  // QBgetDialogByID,
} from '../../utils/QuickBlox';
import MessageChatShimmer from '../shimmer/message/MessageChatShimmer';
import {ShimmerView} from '../shimmer/commonComponents/ShimmerCommonComponents';
import {strings} from '../../../Localization/translation';
import Verbs from '../../Constants/Verbs';

const QbMessageEmitter = new NativeEventEmitter(QB.chat);

const GradiantContainer = ({style, ...props}) => (
  <LinearGradient
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}
    style={style}
    colors={[colors.themeColor1, colors.themeColor3]}>
    {props.children}
  </LinearGradient>
);

const MessageChat = ({route, navigation}) => {
  const videoPlayerRef = useRef();
  const commentModalRef = useRef(null);
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadImageInProgress, setUploadImageInProgress] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dialogData, setDialogData] = useState(route?.params?.dialog);
  const [dialogMenu, setDialogMenu] = useState(route?.params?.dialog);
  const [chatType, setChatType] = useState('');
  const [headingTitle, setHeadingTitle] = useState('');
  const [myUserId, setMyUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [messageBody, setMessageBody] = useState('');
  const [savedMessagesData, setSavedMessagesData] = useState([]);
  const [searchMessageData, setSearchMessageData] = useState([]);

  const [pointEvent, setPointEvent] = useState('auto');
  const [placeholderText, setPlaceholderText] = useState(strings.typeMessage);
  const [occupantsData, setOccupantsData] = useState([]);
  const [hideSearchView, setHideSearchView] = useState(true);
  const [progressNumber, setProgressNumber] = useState(0);

  const scrollRef = useRef(null);
  const refSavedMessagesData = useRef(savedMessagesData);

  useEffect(() => {
    if (isFocused) {
      onRefresh();
    }
  }, [isFocused]);

  useEffect(() => {
    if (occupantsData?.length) {
      navigation.setParams({participants: [...occupantsData]});
    }
  }, [occupantsData]);

  useEffect(() => {
    const setData = (data) => {
      const dialogDatas = {
        dialogId: data?.id,
        name: data?.name,
        occupantsIds: data?.occupantsIds,
        dialogType: data?.type,
        isJoined: data?.isJoined,
      };

      setChatType(
        dialogDatas?.occupantsIds?.length &&
          dialogDatas?.occupantsIds?.length > 2
          ? QB_DIALOG_TYPE.GROUP
          : QB_DIALOG_TYPE.SINGLE,
      );
      if (dialogDatas?.dialogType === QB.chat.DIALOG_TYPE.CHAT) {
        setHeadingTitle(dialogDatas?.name?.slice(2, dialogDatas?.name?.length));
      } else {
        setHeadingTitle(dialogDatas?.name);
      }
      setDialogData({...dialogDatas});
    };
    if (!route?.params?.userId && route?.params?.dialog) {
      setData(route?.params?.dialog);
    }
  }, [route?.params?.dialog]);

  useEffect(() => {
    const uid = route?.params?.userId;

    const setData = (data) => {
      const dialogDatas = {
        dialogId: data?.id,
        name: data?.name,
        occupantsIds: data?.occupantsIds,
        dialogType: data?.type,
        isJoined: data?.isJoined,
      };

      setChatType(
        dialogDatas?.occupantsIds.length > 2
          ? QB_DIALOG_TYPE.GROUP
          : QB_DIALOG_TYPE.SINGLE,
      );
      if (dialogDatas?.dialogType === QB.chat.DIALOG_TYPE.CHAT) {
        setHeadingTitle(dialogDatas?.name?.slice(2, dialogDatas?.name?.length));
      } else {
        setHeadingTitle(dialogDatas?.name);
      }
      setDialogData({...dialogDatas});
    };

    if (uid) {
      setLoading(true);
      QBgetUserDetail(
        QB.users.USERS_FILTER.FIELD.LOGIN,
        QB.users.USERS_FILTER.TYPE.STRING,
        [uid].join(),
      )
        .then((userData) => {
          const user = userData.users.filter((item) => item.login === uid)[0];
          QBcreateDialog([user.id])
            .then((res) => {
              setData(res);
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
            });
        })
        .catch((error) => {
          console.log('QB Error: ', error);
          setLoading(false);
        });
    }
  }, [route?.params?.userId]);

  useEffect(() => {
    if (dialogData) {
      if (!route?.params?.dialog) {
        setDialogMenu({...dialogData, ...route?.params?.dialog});
      }
      const getUser = async () => {
        setMyUserId(authContext.entity.QB.id);
        setLoading(true);
        await getMessages();
        setTimeout(() => onInputBoxFocus(), 200);
        setLoading(false);
      };
      getUser()
        .then(() => {
          QBgetUserDetail(
            QB.users.USERS_FILTER.FIELD.ID,
            QB.users.USERS_FILTER.TYPE.STRING,
            [dialogData?.occupantsIds].join(),
          )
            .then((res) => {
              getPlaceholderText([...res?.users]);
              setOccupantsData([...res?.users]);

              setLoading(false);
            })
            .catch((e) => {
              setLoading(false);
              console.log(e);
            });
        })
        .catch(() => setLoading(false));

      if (chatType === QB_DIALOG_TYPE.GROUP && !dialogData?.isJoined) {
        QB.chat.joinDialog({dialogId: dialogData?.dialogId});
      }

      QbMessageEmitter.addListener(
        QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
        newMessageHandler,
      );
    }
  }, [dialogData]);

  const uploadProgressChangeHandler = (event) => {
    // const {type, payload} = event;
    const {payload} = event;
    setProgressNumber(payload.progress);
  };
  const contentEmitter = new NativeEventEmitter(QB.content);
  const subscription = contentEmitter.addListener(
    QB.content.EVENT_TYPE.FILE_UPLOAD_PROGRESS,
    uploadProgressChangeHandler,
  );

  const newMessageHandler = (event) => {
    const {type, payload} = event;
    if (type === QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE) {
      if (payload.dialogId === dialogData?.dialogId) {
        let messages = refSavedMessagesData.current || [];
        if (messages.filter((item) => item.id === payload.id).length === 0) {
          messages = [...messages, payload];
          refSavedMessagesData.current = messages;
          setSavedMessagesData(messages);
          setSearchMessageData(messages);
          setTimeout(() => onInputBoxFocus(), 100);
        }
      }
    }
  };

  const getMessages = useCallback(
    async (onRefreshCalled = false) => {
      try {
        const response = await QBgetMessages(
          dialogData?.dialogId,
          savedMessagesData.length,
        );

        if (onRefreshCalled) {
          refSavedMessagesData.current = [
            ...response.message,
            ...savedMessagesData,
          ];
          setSavedMessagesData((data) => [...response.message, ...data]);
          setSearchMessageData((data) => [...response.message, ...data]);
        } else {
          refSavedMessagesData.current = [...response.message];
          setSavedMessagesData([...response.message]);
          setSearchMessageData([...response.message]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [dialogData?.dialogId, savedMessagesData],
  );

  const searchMessage = (text) => {
    const result = savedMessagesData.filter((x) => x.body.includes(text));

    if (text.length > 0) {
      setSavedMessagesData(result);
    } else {
      setSavedMessagesData(searchMessageData);
    }
  };

  const deleteMessage = (item) => {
    Alert.alert(
      strings.deleteTitle,
      strings.confirmDeleteMessage,
      [
        {
          text: strings.cancel,
          style: 'cancel',
        },
        {
          text: strings.okTitleText,
          onPress: () => {
            QBDeleteMessage(item.id, authContext)
              .then((respose) => {
                if (respose?.errors) {
                  Alert.alert(respose.errors.base?.[0]);
                } else {
                  navigation.goBack();
                }
              })
              .catch((error) => {
                console.log('QB error : ', error);
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderMessages = useCallback(
    ({item, index}) => {
      const getDateTime = (compareFormat, outputFormat) => {
        const preveiousDate =
          index > 0 && savedMessagesData[index - 1].dateSent;
        const currentDate = item.dateSent;
        if (
          moment(currentDate).format(compareFormat) ===
          moment(preveiousDate).format(compareFormat)
        ) {
          return null;
        }
        return moment(currentDate).format(outputFormat);
      };

      const type = item.senderId === myUserId ? 'sender' : 'receiver';
      const userData =
        occupantsData &&
        occupantsData.filter((oItem) => oItem.id === item.senderId);
      const customData =
        userData.length > 0 && userData[0]?.customData
          ? JSON.parse(userData[0].customData)
          : {};

      let isReceiver = index === 0 && item.senderId !== myUserId;
      if (!isReceiver)
        isReceiver =
          index > 0 &&
          savedMessagesData[index - 1].senderId !== item.senderId &&
          item.senderId !== myUserId;

      const displayDate = getDateTime('l', 'D MMM');
      const displayTime = getDateTime('lll', 'hh: mm A');
      let fullName =
        userData && userData[0] ? userData[0].fullName : `T_${headingTitle}`;
      fullName = fullName.slice(2, fullName.length);

      let finalImage = images.profilePlaceHolder;
      if (isReceiver) {
        const markMessageReadParams = {
          message: {
            id: item?.id,
            dialogId: item?.dialogId,
            senderId: item?.senderId,
          },
        };
        QB.chat
          .markMessageRead(markMessageReadParams)
          .then(() => {})
          .catch((e) => {
            console.log(e);
          });
        const entityType = customData?.entity_type ?? '';
        let fullImage = null;
        if (customData?.full_image) {
          if (customData?.full_image !== '') {
            fullImage = customData?.full_image;
          }
        }
        if (fullImage) finalImage = {uri: fullImage};
        else
          finalImage =
            entityType === Verbs.entityTypePlayer ||
            entityType === Verbs.entityTypeUser
              ? images.profilePlaceHolder
              : images.groupUsers;
      }

      return (
        <>
          {!loading && (
            <View
              key={index}
              style={{
                flex: 1,
                marginTop: hp(1),
              }}>
              {displayDate && (
                <Text
                  style={{
                    ...styles.timeContainer,
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  {moment(displayDate, 'D MMM').isSame(moment(), 'D')
                    ? 'Today'
                    : displayDate}
                </Text>
              )}
              {displayTime && (
                <Text
                  style={{
                    ...styles.timeContainer,
                    textAlign: type === 'receiver' ? 'center' : 'right',
                  }}>
                  {displayTime}
                </Text>
              )}
              <View
                style={{
                  flex: 1,
                  alignSelf: type === 'sender' ? 'flex-end' : 'flex-start',
                }}>
                {isReceiver && (
                  <Pressable
                    onPress={() => {
                      console.log('customDatacustomData', customData);
                      navigation.navigate('HomeScreen', {
                        uid: [
                          Verbs.entityTypeUser,
                          Verbs.entityTypePlayer,
                        ]?.includes(customData?.entity_type)
                          ? customData?.user_id
                          : customData?.group_id,
                        role: [
                          Verbs.entityTypeUser,
                          Verbs.entityTypePlayer,
                        ]?.includes(customData?.entity_type)
                          ? Verbs.entityTypeUser
                          : customData.entity_type,
                        backButtonVisible: true,
                        menuBtnVisible: false,
                      });
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: hp(1),
                      opacity:
                        customData?.is_deactivate === true ||
                        customData?.is_pause === true ||
                        customData?.under_terminate === true
                          ? 0.5
                          : 1,
                    }}>
                    <View style={{...styles.avatarContainer}}>
                      <FastImage
                        source={finalImage}
                        style={{height: 27, width: 27, borderRadius: 54}}
                      />
                    </View>
                    <Text style={styles.titleStyle}>
                      {/* eslint-disable-next-line no-mixed-operators */}
                      {customData?.is_terminate === true
                        ? strings.unknownTitle
                        : fullName}
                    </Text>
                  </Pressable>
                )}

                <TCMessage
                  messageData={item}
                  onLongPressMessage={() => deleteMessage(item)}
                  fullName={
                    customData?.is_terminate === true
                      ? strings.unknownTitle
                      : fullName
                  }
                  attachments={item?.attachments ?? []}
                  date={new Date(item?.dateSent)}
                  body={item.body}
                  type={type}
                  messageStyle={{
                    marginLeft: type === 'receiver' ? wp(12) : 0,
                    marginTop: isReceiver ? hp(-2) : 0,
                  }}
                />
              </View>
            </View>
          )}
        </>
      );
    },
    [headingTitle, myUserId, occupantsData, savedMessagesData],
  );

  const onInputBoxFocus = useCallback(() => {
    if (scrollRef && scrollRef.current)
      scrollRef.current.scrollToEnd({animated: false});
  }, []);

  const sendMessage = useCallback(() => {
    if (!uploadedFile && messageBody.trim() === '') {
      Alert.alert('Enter Message');
      return false;
    }
    const message =
      uploadedFile && messageBody.trim() === ''
        ? '[attachment]'
        : messageBody.trim();

    QBsendMessage(dialogData?.dialogId, message, uploadedFile).then(() => {
      setMessageBody('');
      setSelectedImage(null);
      setUploadedFile(null);
      onInputBoxFocus();
    });
    return true;
  }, [dialogData?.dialogId, messageBody, onInputBoxFocus, uploadedFile]);

  const uploadImage = useCallback(() => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      mediaType: 'video photo',
    }).then((image) => {
      setUploadImageInProgress(true);
      setSelectedImage(image ?? null);
      const imagePath = image?.path; // Platform?.OS === 'ios' ? image?.sourceURL : image?.path
      const validImageSize = image?.size <= QB_MAX_ASSET_SIZE_UPLOAD;

      if (!validImageSize) {
        Alert.alert('file image size error');
      } else {
        const url = imagePath;
        const subscribeProgressParam = {url};
        const contentUploadParam = {url, public: false};

        QB.content
          .subscribeUploadProgress(subscribeProgressParam)
          .then(() =>
            // subscribed to upload progress events for this file
            QB.content.upload(contentUploadParam),
          )
          .then((file) => {
            // file uploaded successfully
            setUploadImageInProgress(false);
            setUploadedFile(file);
            setProgressNumber(0);
            // unscubscribe from upload progress events for this file
            return QB.content.unsubscribeUploadProgress({url});
          })
          .then(() => {
            // unsubscribed from upload progress events for this file
            // remove subscription if it is not needed
            subscription.remove();
          })
          .catch((error) => {
            // handle error
            setUploadImageInProgress(false);
            console.log(error);
          });
      }
    });
  }, []);

  const renderHeader = useMemo(
    () => (
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.backArrow} style={styles.backImageStyle} />
          </TouchableOpacity>
        }
        centerComponent={
          headingTitle ? (
            <Text style={styles.eventTextStyle} numberOfLines={1}>
              {headingTitle}
            </Text>
          ) : (
            <ShimmerView style={{alignSelf: 'center'}} />
          )
        }
        rightComponent={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setHideSearchView(!hideSearchView);
              }}>
              <Image
                source={images.chatSearch}
                style={[styles.rightSearchImageStyle, {marginRight: 10}]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              itSlop={getHitSlop(15)}
              onPress={() => {
                commentModalRef.current.open();
                // navigation.setParams({participants: [occupantsData]});
              }}>
              <Image source={images.chat3Dot} style={styles.rightImageStyle} />
            </TouchableOpacity>
          </View>
        }
      />
    ),
    [headingTitle, navigation, occupantsData],
  );

  const onRefresh = useCallback(async () => {
    await getMessages(true);
  }, [getMessages]);

  const ListEmptyComponent = useMemo(
    () => !loading && <Text style={styles.noMessagesText}>No Messages</Text>,
    [],
  );

  const messageList = useMemo(
    () => (
      <FlatList
        ref={scrollRef}
        extraData={savedMessagesData}
        style={styles.messageViewContainer}
        contentContainerStyle={styles.messageContentView}
        data={savedMessagesData ?? []}
        renderItem={renderMessages}
        ListEmptyComponent={ListEmptyComponent}
        onRefresh={onRefresh}
        refreshing={loading}
      />
    ),
    [ListEmptyComponent, loading, onRefresh, renderMessages, savedMessagesData],
  );

  const getPlaceholderText = useCallback((occData) => {
    const filterOcc = (occData || []).filter(
      (obj) =>
        JSON.parse(obj.customData).is_pause === true ||
        JSON.parse(obj.customData).is_deactivate === true,
    );

    if (occData?.length - filterOcc.length <= 1) {
      setPointEvent('none');
      setPlaceholderText('No recipients in this chatroom');
    }
  }, []);

  const renderBottomChatTools = () => (
    <View
      style={{
        ...styles.bottomTextUpperContainer,
        height: selectedImage ? hp(14) : hp(8),
        shadowColor: colors.grayColor,
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 2,
      }}>
      {selectedImage && (
        <View>
          <View style={styles.selectedImageContainer}>
            {selectedImage?.mime?.includes('image') ? (
              <FastImage
                resizeMode={'cover'}
                source={{uri: selectedImage?.path}}
                style={{
                  borderRadius: 5,
                  height: 30,
                  width: 30,
                  marginVertical: hp(2),
                }}
              />
            ) : (
              <View>
                <View
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  <FastImage
                    source={images.videoPlayBtn}
                    tintColor={'white'}
                    resizeMode={'contain'}
                    style={{
                      height: 10,
                      width: 10,
                    }}
                  />
                </View>
                <Video
                  ref={videoPlayerRef}
                  paused={true}
                  muted={true}
                  source={{uri: selectedImage?.path}}
                  style={{
                    borderRadius: 5,
                    height: 30,
                    width: 30,
                    marginVertical: hp(2),
                  }}
                  resizeMode={'cover'}
                  onLoad={() => {
                    videoPlayerRef.current.seek(0);
                  }}
                />
              </View>
            )}
            <Text style={{fontSize: 15, marginLeft: 15}}>
              {uploadImageInProgress
                ? `Uploading ${
                    selectedImage?.mime?.includes('image')
                      ? 'an image'
                      : 'video'
                  }...${progressNumber}%`
                : `${
                    selectedImage?.mime?.includes('image') ? 'Image' : 'Video'
                  } uploaded`}
            </Text>
            <TouchableOpacity
              style={{flex: 1, alignItems: 'flex-end'}}
              onPress={() => {
                setSelectedImage(null);
                setUploadImageInProgress(false);
                setUploadedFile(null);
              }}>
              <FastImage
                source={images.cancelImage}
                style={{height: 14, width: 14}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
          {uploadImageInProgress && (
            <Progress.Bar
              progress={progressNumber / 100}
              width={wp('100%')}
              borderRadius={0}
              borderWidth={0}
              unfilledColor={colors.offGrayColor}
              color={colors.themeColor}
            />
          )}
        </View>
      )}
      <View style={styles.bottomTextInputContainer}>
        <TouchableOpacity onPress={uploadImage}>
          <Image
            source={images.messageCamera}
            style={{
              ...styles.sideButton,
              marginHorizontal: wp(3),
              tintColor: colors.lightBlackColor,
              height: 25,
              width: 23,
            }}
          />
        </TouchableOpacity>

        <View style={{flex: 1, marginRight: 15, zIndex: -1}}>
          <TCInputBox
            editable={pointEvent !== 'none'}
            onFocus={onInputBoxFocus}
            value={messageBody}
            placeHolderText={placeholderText}
            onChangeText={setMessageBody}
            style={{width: '100%'}}
            isClear={false}
            backgroundColor={colors.lightGrayBackground}
            multiline={true}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            right: '4%',
            opacity: pointEvent === 'none' ? 0.5 : 1,
          }}
          pointerEvents={pointEvent}>
          {((selectedImage && !uploadImageInProgress) ||
            messageBody.length > 0) && (
            <TouchableOpacity onPress={sendMessage}>
              <GradiantContainer style={styles.sendButtonContainer}>
                <Image source={images.sendButton} style={styles.sendButton} />
              </GradiantContainer>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
  const ModalHeader = () => (
    <View style={styles.headerStyle}>
      <View style={styles.handleStyle} />
    </View>
  );
  const onPressDone = useCallback(
    (newDialog) => {
      navigation.setParams({dialog: {...dialogData, ...newDialog}});
      setDialogData({...dialogData, ...newDialog});
    },
    [dialogData, navigation],
  );

  const onParticipantsPress = useCallback(
    (userData) => {
      const uid =
        userData?.entity_type === Verbs.entityTypePlayer
          ? userData?.user_id
          : userData?.group_id;
      if (uid && userData?.entity_type) {
        commentModalRef.current.close();
        navigation.push('HomeScreen', {
          uid,
          backButtonVisible: true,
          role:
            userData.entity_type === Verbs.entityTypePlayer
              ? Verbs.entityTypeUser
              : userData?.entity_type,
          menuBtnVisible: false,
        });
      }
    },
    [navigation],
  );

  const renderRow = useCallback(
    ({item}) => {
      const customData = JSON.parse(item?.customData);
      const fullImage = customData?.full_image ?? '';
      const finalImage = fullImage
        ? {uri: fullImage}
        : [Verbs.entityTypeUser, Verbs.entityTypePlayer].includes(
            customData?.entity_type,
          )
        ? images.profilePlaceHolder
        : images.teamGreenPH;
      return (
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={() => onParticipantsPress(customData)}>
          <View style={styles.imageContainer}>
            <Image style={styles.inviteImage} source={finalImage} />
          </View>
          <TCGroupNameBadge
            textStyle={styles.rowText}
            name={customData?.full_name}
            groupType={customData?.entity_type}
            isShowBadge={false}
          />
        </TouchableOpacity>
      );
    },
    [onParticipantsPress],
  );

  const leaveRoom = () => {
    const okPress = () => {
      QBleaveDialog(dialogMenu?.id)
        .then(() => {
          commentModalRef.current.close();
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
        });
    };
    Alert.alert(
      '',
      'Are you sure you want to \n' +
        `${occupantsData.length > 2 ? 'leave' : 'delete'} this chatroom?`,
      [
        {
          text: strings.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: occupantsData.length > 2 ? 'Leave' : 'Delete',
          onPress: () => okPress(),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };
  let fullName = dialogMenu?.name;
  if (dialogMenu?.type === QB.chat.DIALOG_TYPE.CHAT) {
    fullName = dialogMenu?.name?.slice(2, dialogMenu?.name?.length);
  }

  const searchView = () => (
    <View style={styles.searchContainer}>
      <View style={styles.sectionStyle}>
        <TextInput
          style={styles.textInput}
          placeholder={'Search'}
          clearButtonMode="always"
          placeholderTextColor={colors.userPostTimeColor}
          onChangeText={(text) => searchMessage(text)}
        />
      </View>
      <TouchableOpacity onPress={() => setHideSearchView(true)}>
        <Image source={images.closeSearch} style={styles.searchClose} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Fragment style={styles.mainContainer}>
      {/* <ActivityLoader visible={loading} /> */}
      {renderHeader}
      <View style={styles.sperateLine} />
      {!hideSearchView && searchView()}
      {loading ? (
        <View style={{flex: 1, backgroundColor: colors.offwhite}}>
          <MessageChatShimmer />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          {messageList}
          {hideSearchView && renderBottomChatTools()}
        </KeyboardAvoidingView>
      )}
      <Portal>
        <Modalize
          // onOpen={() => setMenuModal(true)}
          snapPoint={hp(95)}
          withHandle={false}
          overlayStyle={{backgroundColor: 'rgba(255,255,255,0.2)'}}
          HeaderComponent={ModalHeader}
          modalStyle={{
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: -2},
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
          }}
          ref={commentModalRef}>
          <View style={styles.viewContainer}>
            <Text
              style={[styles.titleLabel, {marginBottom: 15, marginTop: 25}]}>
              {dialogMenu?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT &&
                strings.chatRoomNameText}
            </Text>
            <TouchableOpacity
              onPress={() => {
                commentModalRef.current.close();
                if (dialogMenu?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT)
                  navigation.navigate('MessageEditGroupScreen', {
                    dialog: dialogMenu,
                    onPressDone,
                  });
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.title}>{fullName}</Text>
                {dialogMenu?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT && (
                  <FastImage
                    resizeMode={'contain'}
                    source={images.arrowDown}
                    style={{
                      ...styles.downArrow,
                      transform: [{rotateZ: '270deg'}],
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.separator} />
            <Text style={styles.titleLabel}>PARTICIPANTS</Text>
            {dialogMenu?.type === QB.chat.DIALOG_TYPE.GROUP_CHAT && (
              <TouchableOpacity
                style={styles.rowContainer}
                onPress={() => {
                  commentModalRef.current.close();

                  navigation.navigate('MessageEditInviteeScreen', {
                    dialog: dialogMenu,
                    isAdmin: dialogMenu?.userId === myUserId,
                    selectedInvitees: occupantsData,
                    participants: occupantsData,
                    onPressDone,
                  });
                }}>
                <Image
                  style={styles.inviteImage}
                  source={images.plus_round_orange}
                />
                <Text style={[styles.rowText, {color: colors.orangeColor}]}>
                  Invite
                </Text>
              </TouchableOpacity>
            )}
            <FlatList
              extraData={occupantsData}
              data={occupantsData}
              renderItem={renderRow}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.bottomView} onPress={leaveRoom}>
              <Image
                style={styles.inviteImage}
                source={images.leave_chat_room}
              />
              <Text style={styles.grayText}>
                {occupantsData?.length > 2
                  ? strings.leaveChatRoom
                  : strings.deleteChatRoom}
              </Text>
            </TouchableOpacity>
          </View>
        </Modalize>
      </Portal>
      <SafeAreaView style={{backgroundColor: colors.whiteColor}} />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.whiteColor,
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    width: wp(100),
  },
  backImageStyle: {
    // height: 20,
    width: 13,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  rightSearchImageStyle: {
    height: 25,
    width: 25,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  rightImageStyle: {
    height: 25,
    width: 25,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  sideButton: {
    flex: 0.4,
    resizeMode: 'contain',
  },
  sendButtonContainer: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    borderRadius: wp(5),
  },
  sendButton: {
    height: 20,
    width: 15,
    resizeMode: 'contain',
  },
  eventTextStyle: {
    color: colors.lightBlackColor,
    alignSelf: 'center',
    width: wp(60),
    textAlign: 'center',
    fontFamily: fonts.Roboto,

    fontSize: 20,
    lineHeight: 18,
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTextUpperContainer: {
    backgroundColor: colors.whiteColor,
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    left: 0,
  },
  bottomTextInputContainer: {
    backgroundColor: colors.whiteColor,
    flexDirection: 'row',
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    paddingVertical: hp(1),
  },
  messageViewContainer: {
    paddingHorizontal: wp(3),
    backgroundColor: colors.grayBackgroundColor,
    width: wp(100),
    height: hp(70),
    paddingBottom: hp(2),
  },
  messageContentView: {
    paddingBottom: hp(2),
  },
  avatarContainer: {
    width: 30,
    height: 30,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 0.8,
    elevation: 2,
  },
  noMessagesText: {
    padding: wp(5),
    textAlign: 'center',
    fontFamily: fonts.RLight,
  },
  timeContainer: {
    fontFamily: fonts.RRegular,
    fontSize: 10,
    color: colors.userPostTimeColor,
    marginVertical: 5,
  },
  selectedImageContainer: {
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    width: wp(100),
    alignItems: 'center',
  },
  headerStyle: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: colors.whiteColor,
  },
  handleStyle: {
    marginVertical: 15,
    alignSelf: 'center',
    height: 5,
    width: 40,
    borderRadius: 15,
    backgroundColor: '#DADBDA',
  },

  viewContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  titleLabel: {
    fontSize: 14,
    fontFamily: fonts.RMedium,
    color: colors.userPostTimeColor,
  },
  downArrow: {
    height: 15,
    width: 15,
    marginRight: 15,
    resizeMode: 'contain',
    tintColor: colors.blackColor,
  },
  title: {
    width: '80%',
    fontSize: 20,
    fontFamily: fonts.RMedium,
    color: colors.lightBlackColor,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(1.5),
    paddingLeft: 10,
  },
  rowText: {
    width: '75%',
    fontSize: 16,
    fontFamily: fonts.RRegular,
    color: colors.lightBlackColor,
    marginLeft: wp(3),
  },
  inviteImage: {
    borderRadius: 25,
    height: 22.5,
    width: 22.5,
  },
  grayText: {
    fontSize: 12,
    fontFamily: fonts.RBold,
    color: colors.userPostTimeColor,
  },
  bottomView: {
    height: 50,
    paddingLeft: 20,
    // backgroundColor: colors.grayBackgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    backgroundColor: colors.thinDividerColor,
    height: 1,
    marginTop: hp(2),
    marginBottom: 20,
  },

  sectionStyle: {
    alignItems: 'center',
    backgroundColor: colors.offwhite,
    borderRadius: 25,
    flexDirection: 'row',
    height: 40,
    paddingLeft: 17,
    paddingRight: 5,
    width: wp('84%'),
    shadowColor: colors.grayColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
    marginLeft: 10,
  },

  searchClose: {
    alignSelf: 'center',
    height: 15,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
    width: 15,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: colors.blackColor,
    fontFamily: fonts.RRegular,
    fontSize: 16,
    paddingLeft: 10,
    backgroundColor: colors.offwhite,
  },
  searchContainer: {
    zIndex: 1000,
    width: '100%',
    backgroundColor: colors.grayBackgroundColor,
    flexDirection: 'row',
    height: 55,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: colors.googleColor,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  titleStyle: {
    alignSelf: 'flex-start',
    color: colors.userPostTimeColor,
    fontFamily: fonts.RRegular,
    fontSize: 12,
    marginTop: 2,
    marginLeft: 8,
  },
});

export default MessageChat;
