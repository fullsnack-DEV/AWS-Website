import React, {
  useEffect, useRef, useState, useContext, useMemo, useCallback
} from 'react';

import {
  View,
  Platform,
  StyleSheet,
  NativeEventEmitter,
  TouchableOpacity,
  Image, Text,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList, Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import QB from 'quickblox-react-native-sdk';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import Video from 'react-native-video';
import Header from '../Home/Header';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import TCInputBox from '../TCInputBox';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../utils';
import TCMessage from '../TCMessage';
import AuthContext from '../../auth/context'

import {
  QB_DIALOG_TYPE, QB_MAX_ASSET_SIZE_UPLOAD, QBcreateDialog, QBgetMessages, QBgetUserDetail, QBsendMessage,
} from '../../utils/QuickBlox';
import MessageChatShimmer from '../shimmer/message/MessageChatShimmer';
import { ShimmerView } from '../shimmer/commonComponents/ShimmerCommonComponents';

const QbMessageEmitter = new NativeEventEmitter(QB.chat)

const GradiantContainer = ({ style, ...props }) => (
  <LinearGradient
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={style}
    colors={ [colors.themeColor1, colors.themeColor3] }>
    {props.children}
  </LinearGradient>
)


const MessageChat = ({
  route,
  navigation,
}) => {
  const videoPlayerRef = useRef();
  const authContext = useContext(AuthContext)
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadImageInProgress, setUploadImageInProgress] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dialogData, setDialogData] = useState(null);
  const [chatType, setChatType] = useState('');
  const [headingTitle, setHeadingTitle] = useState('');
  const [myUserId, setMyUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [messageBody, setMessageBody] = useState('');
  const [savedMessagesData, setSavedMessagesData] = useState([]);
  const [occupantsData, setOccupantsData] = useState([]);
  const scrollRef = useRef(null);
  const refSavedMessagesData = useRef(savedMessagesData);

  useEffect(() => {
    console.log(1)
    if (occupantsData?.length) {
      navigation.setParams({ participants: [...occupantsData] });
    }
  }, [occupantsData]);

  useEffect(() => {
    console.log(4)
    const setData = (data) => {
      const dialogDatas = {
        dialogId: data?.id,
        name: data?.name,
        occupantsIds: data?.occupantsIds,
        dialogType: data?.type,
        isJoined: data?.isJoined,
      }
      setChatType(dialogDatas?.occupantsIds.length > 2 ? QB_DIALOG_TYPE.GROUP : QB_DIALOG_TYPE.SINGLE);
      if (dialogDatas?.dialogType === QB.chat.DIALOG_TYPE.CHAT) {
        setHeadingTitle(dialogDatas?.name?.slice(2, dialogDatas?.name?.length));
      } else {
        setHeadingTitle(dialogDatas?.name);
      }
      setDialogData({ ...dialogDatas });
    }
    if (!route?.params?.userId && route?.params?.dialog) {
      setData(route?.params?.dialog);
    }
  }, [route?.params?.dialog])

  useEffect(() => {
    console.log(2)
    const uid = route?.params?.userId;
    const setData = (data) => {
      const dialogDatas = {
        dialogId: data?.id,
        name: data?.name,
        occupantsIds: data?.occupantsIds,
        dialogType: data?.type,
        isJoined: data?.isJoined,
      }
      setChatType(dialogDatas?.occupantsIds.length > 2 ? QB_DIALOG_TYPE.GROUP : QB_DIALOG_TYPE.SINGLE);
      if (dialogDatas?.dialogType === QB.chat.DIALOG_TYPE.CHAT) {
        setHeadingTitle(dialogDatas?.name?.slice(2, dialogDatas?.name?.length));
      } else {
        setHeadingTitle(dialogDatas?.name);
      }
      setDialogData({ ...dialogDatas });
    }

    if (uid) {
      console.log('QB Error UID : ', uid);
      setLoading(true);
      QBgetUserDetail(
        QB.users.USERS_FILTER.FIELD.LOGIN,
        QB.users.USERS_FILTER.TYPE.STRING,
        [uid].join(),
      ).then((userData) => {
        const user = userData.users.filter((item) => item.login === uid)[0];
        QBcreateDialog([user.id]).then((res) => {
          setData(res);
        }).catch((error) => {
          setLoading(false);
          console.log(error);
        })
      }).catch((error) => {
        console.log('QB Error123321 : ', error);
        setLoading(false)
      })
    }
  }, [route?.params?.userId])

  useEffect(() => {
    console.log(3)
    if (dialogData) {
      if (!route?.params?.dialog) {
        navigation.setParams({ dialog: { ...dialogData, ...route?.params?.dialog } });
      }
      const getUser = async () => {
        setMyUserId(authContext.entity.QB.id);
        setLoading(true);
        await getMessages();
        setTimeout(() => onInputBoxFocus(), 200)
        setLoading(false);
      }
      getUser().then(() => {
        QBgetUserDetail(
          QB.users.USERS_FILTER.FIELD.ID,
          QB.users.USERS_FILTER.TYPE.STRING,
          [dialogData?.occupantsIds].join(),
        ).then((res) => {
          console.log('USER: ', res.users)
          setLoading(false);
          setOccupantsData([...res.users]);
        }).catch((e) => {
          setLoading(false);
          console.log(e);
        })
      }).catch(() => setLoading(false))

      if (chatType === QB_DIALOG_TYPE.GROUP && !dialogData?.isJoined) {
        QB.chat.joinDialog({ dialogId: dialogData?.dialogId });
      }
      QbMessageEmitter.addListener(
        QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE,
        newMessageHandler,
      )
    }
  
  }, [dialogData])

  const newMessageHandler = (event) => {
    const {
      type,
      payload,
    } = event
    if (type === QB.chat.EVENT_TYPE.RECEIVED_NEW_MESSAGE) {
      if (payload.dialogId === dialogData?.dialogId) {
        let messages = refSavedMessagesData.current || [];
        if (messages.filter((item) => item.id === payload.id).length === 0) {
          messages = [...messages, payload]
          refSavedMessagesData.current = messages
          setSavedMessagesData(messages);
          setTimeout(() => onInputBoxFocus(), 100)
        }
      }
    }
  }

  const getMessages = useCallback(async (onRefreshCalled = false) => {
    try {
      const response = await QBgetMessages(dialogData?.dialogId, savedMessagesData.length);
      console.log('message list',response,dialogData?.dialogId,savedMessagesData.length);
      if (onRefreshCalled) {
        refSavedMessagesData.current = [...response.message, ...savedMessagesData]
        setSavedMessagesData((data) => [...response.message, ...data]);
      } else {
        refSavedMessagesData.current = [...response.message]
        setSavedMessagesData([...response.message]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [dialogData?.dialogId, savedMessagesData])

  const renderMessages = useCallback(({ item, index }) => {

    console.log('Messsssages',item);
    const getDateTime = (compareFormat, outputFormat) => {
      const preveiousDate = index > 0 && savedMessagesData[index - 1].dateSent;
      const currentDate = item.dateSent;
      if (
        moment(currentDate).format(compareFormat)
          === moment(preveiousDate).format(compareFormat)
      ) {
        return null;
      }
      return moment(currentDate).format(outputFormat);
    }

    const type = item.senderId === myUserId ? 'sender' : 'receiver';
    const userData = occupantsData && occupantsData.filter((oItem) => oItem.id === item.senderId);
    let isReceiver = index === 0 && item.senderId !== myUserId;
    if (!isReceiver) isReceiver = index > 0 && savedMessagesData[index - 1].senderId !== item.senderId && item.senderId !== myUserId;

    const displayDate = getDateTime('l', 'D MMM')
    const displayTime = getDateTime('lll', 'hh: mm A')
    let fullName = userData && userData[0] ? userData[0].fullName : headingTitle;
    fullName = fullName.slice(2, fullName.length)
    let finalImage = images.profilePlaceHolder;
    if (isReceiver) {
      const customData = userData.length > 0 && userData[0]?.customData ? JSON.parse(userData[0].customData) : {};
      const entityType = customData?.entity_type ?? '';
      const fullImage = customData?.full_image ?? null;
      if (fullImage) finalImage = { uri: fullImage }
      else finalImage = entityType === 'player' ? images.profilePlaceHolder : images.groupUsers;
    }
    return (
      <View key={index} style={{
        flex: 1,
        marginTop: hp(1),
      }}>
        {displayDate && <Text style={{
          ...styles.timeContainer,
          fontSize: 12,
          textAlign: 'center',
        }}>
          {moment(displayDate, 'D MMM').isSame(moment(), 'D') ? 'Today' : displayDate}
        </Text>}
        {displayTime && <Text style={{
          ...styles.timeContainer,
          textAlign: type === 'receiver' ? 'center' : 'right',
        }}>
          {displayTime}
        </Text>}
        <View style={{ flex: 1, alignSelf: type === 'sender' ? 'flex-end' : 'flex-start' }}>
          {isReceiver && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: hp(1) }}>
              <View style={{ ...styles.avatarContainer }}>
                <FastImage source={finalImage} style={{ height: 26, width: 26, borderRadius: 25 }}/>
              </View>
              <Text style={{
                alignSelf: 'flex-start',
                color: colors.userPostTimeColor,
                fontFamily: fonts.RRegular,
                fontSize: 12,
                marginTop: 2,
                marginLeft: 8,
              }}>
                {/* eslint-disable-next-line no-mixed-operators */}
                {fullName}
              </Text>
            </View>
          )}

          <TCMessage
            fullName={fullName}
            attachments={item.attachments}
            date={new Date(item.dateSent)}
            body={item.body}
            type={type}
            messageStyle={{
              marginLeft: type === 'receiver' ? wp(12) : 0,
              marginTop: isReceiver ? hp(-2) : 0,
            }}
          />
        </View>
      </View>
    )
  }, [headingTitle, myUserId, occupantsData, savedMessagesData])

  const onInputBoxFocus = useCallback(() => {
    if (scrollRef && scrollRef.current) scrollRef.current.scrollToEnd({ animated: false });
  }, [])

  const sendMessage = useCallback(() => {
    if (!uploadedFile && messageBody.trim() === '') {
      Alert.alert('Enter Message')
      return false;
    }
    const message = (uploadedFile && messageBody.trim() === '') ? '[attachment]' : messageBody.trim()
    QBsendMessage(dialogData?.dialogId, message, uploadedFile).then(() => {
      setMessageBody('');
      setSelectedImage(null);
      setUploadedFile(null);
      onInputBoxFocus()
    })
    return true;
  }, [dialogData?.dialogId, messageBody, onInputBoxFocus, uploadedFile])

  const uploadImage = useCallback(() => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      mediaType: 'video photo',
    }).then((image) => {
      setUploadImageInProgress(true);
      setSelectedImage(image ?? null);
      const imagePath = Platform?.OS === 'ios' ? image?.sourceURL : image?.path;
      const validImageSize = image?.size <= QB_MAX_ASSET_SIZE_UPLOAD;

      if (!validImageSize) {
        Alert.alert('file image size error')
      } else {
        QB.content.subscribeUploadProgress({ url: imagePath });
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

  const renderHeader = useMemo(() => (
    <Header
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack() }>
              <Image source={images.backArrow} style={styles.backImageStyle} />
            </TouchableOpacity>
          }
          centerComponent={headingTitle ? <Text style={styles.eventTextStyle}>{headingTitle}</Text> : <ShimmerView style={{ alignSelf: 'center' }} />}
          rightComponent={
            <TouchableOpacity style={{ padding: 2 }} onPress={() => {
              console.log('navigationnavigation',navigation);
              navigation.openDrawer()
              navigation.setParams({ participants: [occupantsData] })
            }}>
              <Image source={images.threeDotIcon} style={styles.rightImageStyle} />
            </TouchableOpacity>
          }
      />
  ), [headingTitle, navigation, occupantsData])

  const onRefresh = useCallback(async () => {
    await getMessages(true)
  }, [getMessages])

  const ListEmptyComponent = useMemo(() => (
    <Text style={styles.noMessagesText}>No Messages</Text>
  ), [])

  const messageList = useMemo(() => (
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
    ), [ListEmptyComponent, loading, onRefresh, renderMessages, savedMessagesData])

  const renderBottomChatTools = useMemo(() => (
    <View style={{
        ...styles.bottomTextUpperContainer,
        height: selectedImage ? hp(18) : hp(8),
        borderTopWidth: selectedImage ? 1 : 0,
        borderTopColor: selectedImage ? colors.userPostTimeColor : '',
    }}>
      {selectedImage && (
        <View style={styles.selectedImageContainer}>
          {selectedImage?.mime?.includes('image') ? (
            <FastImage
                      resizeMode={'cover'}
                      source={{ uri: selectedImage?.path }}
                      style={{
                        borderRadius: 5,
                        height: 50,
                        width: 50,
                        marginVertical: hp(2),
                      }}
                  />
              ) : (
                <View>
                  <View style={{
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
                            height: 20,
                            width: 20,
                          }}/>
                  </View>
                  <Video
                        ref={videoPlayerRef}
                        paused={true}
                        muted={true}
                        source={{ uri: selectedImage?.path }}
                        style={{
                          borderRadius: 5,
                          height: 50,
                          width: 50,
                          marginVertical: hp(2),
                        }}
                        resizeMode={'cover'}
                        onLoad={() => {
                          videoPlayerRef.current.seek(0);
                        }}
                    />
                </View>
              )}
          <Text style={{ fontSize: 15, marginLeft: 15 }}>{uploadImageInProgress ? `Uploading ${selectedImage?.mime?.includes('image') ? 'an image' : 'video'}...` : `${selectedImage?.mime?.includes('image') ? 'Image' : 'Video'} uploaded`}</Text>
          <TouchableOpacity
              style={{ flex: 1, alignItems: 'flex-end' }}
              onPress={() => {
                setSelectedImage(null);
                setUploadImageInProgress(false);
                setUploadedFile(null);
              }}>
            <FastImage
                    source={ images.cancelImage }
                    style={{ height: 20, width: 20 }}
                    resizeMode={'contain'}
                />
          </TouchableOpacity>
        </View>
        )}
      <View style={styles.bottomTextInputContainer}>
        <TouchableOpacity onPress={uploadImage}>
          <Image source={images.messageCamera} style={{
              ...styles.sideButton,
              marginHorizontal: wp(3),
              height: 25,
              width: 23,
          }}/>
        </TouchableOpacity>
        <View style={{ flex: 1, marginRight: 15, zIndex: -1 }}>
          <TCInputBox
              onFocus={onInputBoxFocus}
              value={messageBody}
              placeHolderText={'Type a message'}
              onChangeText={setMessageBody}
              style={{ width: '100%' }}
          />
        </View>
        <View style={{ position: 'absolute', right: '4%' }}>
          {uploadImageInProgress ? (
            <FastImage
                  source={ images.imageUploadingGIF }
                  style={styles.imageUploadingLoader}
                  resizeMode={'contain'}
              />
          ) : (
            <TouchableOpacity onPress={sendMessage}>
              <GradiantContainer style={styles.sendButtonContainer}>
                <Image source={images.sendButton} style={styles.sendButton} />
              </GradiantContainer>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  ), [messageBody, onInputBoxFocus, selectedImage, sendMessage, uploadImage, uploadImageInProgress])

  return (
    <SafeAreaView style={ styles.mainContainer }>
      {/* <ActivityLoader visible={loading} /> */}
      {renderHeader}
      <View style={ styles.sperateLine } />
      {loading
          ? <View style={{ flex: 1, backgroundColor: colors.offwhite }}>
            <MessageChatShimmer/>
          </View>
      : <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        {messageList}
        {renderBottomChatTools}
      </KeyboardAvoidingView>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sperateLine: {
    borderColor: colors.writePostSepratorColor,
    borderWidth: 0.5,
    width: wp(100),
  },
  backImageStyle: {
    height: 20,
    width: 10,
    tintColor: colors.blackColor,
    resizeMode: 'contain',
  },
  rightImageStyle: {
    height: 20,
    width: 3,
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
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RBold,
    alignSelf: 'center',
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
    // shadowColor: colors.googleColor,
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 4,
    // elevation: 10,
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
    width: 32,
    height: 32,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(5),
    backgroundColor: colors.whiteColor,
    shadowColor: colors.googleColor,
    shadowOffset: { width: 0, height: 0 },
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
    flex: 1,
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    width: wp(100),
    alignItems: 'center',
  },
  imageUploadingLoader: {
    height: wp(10),
    alignSelf: 'center',
    width: wp(10),
    margin: wp(1),
  },
});

export default MessageChat;