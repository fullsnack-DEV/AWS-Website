import React, {useState, useContext, useMemo} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider as ChatOverlayProvider,
  useMessageContext,
  useMessageInputContext,
  AutoCompleteInput,
  MessageAvatar,
  MessageActionListItem,
  useOverlayContext,
  useMessageActionAnimation,
  ImageGallery,
} from 'stream-chat-react-native';
import * as Progress from 'react-native-progress';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import ScreenHeader from '../../components/ScreenHeader';
import {widthPercentageToDP as wp} from '../../utils';
import AuthContext from '../../auth/context';

import {strings} from '../../../Localization/translation';
import CustomModalWrapper from '../../components/CustomModalWrapper';
import {ModalTypes} from '../../Constants/GeneralConstants';
import BottomSheet from '../../components/modals/BottomSheet';
import ChatGroupDetails from './components/ChatGroupDetails';
import {getChannelName} from '../../utils/streamChat';

import CustomTypingIndicator from './components/CustomTypingIndicator';
import CustomMessageHeader from './components/CustomMessageHeader';
import {
  myMessageTheme,
  newReactionData,
  TAB_ITEMS,
  themeStyle,
} from './constants';
import CustomMessageText from './components/CustomMessageText';
import CustomMessageFooter from './components/CustomMessageFooter';
import CustomDateSeparator from './components/CustomDateSeparator';

const MessageChatScreen = ({navigation, route}) => {
  const {channel} = route.params;
  const authContext = useContext(AuthContext);

  const [isVisible, setIsVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [allReaction, setAllReaction] = useState([]);
  const [deleteMessageModal, setDeleteMessageModal] = useState(false);
  const [deleteMessageObject, setDeleteMessageObject] = useState({});

  const [showDetails, setShowDetails] = useState(false);

  const CustomAvatar = (props) => {
    const {message} = useMessageContext();
    return (
      <MessageAvatar
        {...props}
        size={25}
        alignment="left"
        showAvatar={
          message.groupStyles[0] === 'single' ||
          message.groupStyles[0] === 'top'
        }
      />
    );
  };

  const CustomInput = () => {
    const {sendMessage, toggleAttachmentPicker, ImageUploadPreview} =
      useMessageInputContext();
    return (
      <View style={styles.fullWidth}>
        <ImageUploadPreview />
        <CustomFileUploadPreview />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'relative',
            marginTop: 5,
          }}>
          <TouchableOpacity
            style={{width: 30}}
            onPress={toggleAttachmentPicker}>
            <Image
              style={{width: 27, height: 20, marginTop: 8}}
              source={images.chatCamera}
            />
          </TouchableOpacity>
          <View
            style={{
              width: wp(85),
              height: 40,
              backgroundColor: colors.lightGrey,
              borderRadius: 15,
              padding: 10,
            }}>
            <AutoCompleteInput />
          </View>
          <View
            style={{
              width: 27,
              height: 27,
              borderRadius: 50,
              backgroundColor: colors.themeColor1,
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 5,
              top: 5,
              marginTop: 0,
            }}>
            <TouchableOpacity onPress={sendMessage}>
              <Image style={{width: 17, height: 19}} source={images.chatBtn} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderChatTitle = () => {
    let name;
    if (channel.data?.member_count === 2) {
      const members = channel?.state?.members;
      const filteredMember = Object.fromEntries(
        Object.entries(members).filter(
          ([key]) => key !== authContext.entity?.obj?.user_id,
        ),
      );
      name = Object.entries(filteredMember).map((obj) => obj[1]?.user?.name);
    } else {
      name = channel.data?.name;
    }
    return name;
  };

  const CustomImageUploadPreview = () => {
    const {imageUploads, setImageUploads, numberOfUploads, removeImage} =
      useMessageInputContext();

    setImageUploads(imageUploads);
    let imageState;
    imageUploads.forEach((item) => {
      imageState = item.state;
    });

    return (
      <>
        {imageUploads.length > 0 ? (
          <View style={{marginBottom: imageState === 'uploading' ? 12 : 8}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 5,
                paddingVertical: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={{width: 28, height: 28, marginRight: 10}}
                  source={{uri: imageUploads[0].url}}
                  onPress={() => {
                    CancelImageUpload(imageUploads, removeImage);
                  }}
                />
                <Text>
                  {imageState === 'uploading'
                    ? strings.uploadingText
                    : strings.uploadedText}{' '}
                  : {numberOfUploads}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    CancelImageUpload(imageUploads, removeImage);
                  }}>
                  <Image
                    style={{width: 12, height: 12}}
                    source={images.crossSingle}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {imageState !== 'uploading' && (
              <View style={styles.chatSeparateLine} />
            )}

            {imageState === 'uploading' && (
              <View style={{position: 'absolute', bottom: -8, left: -10}}>
                <Progress.Bar
                  progress={1}
                  width={wp(100)}
                  height={5}
                  borderRadius={5}
                  borderWidth={0}
                  color={'rgba(255, 138, 1, 0.6)'}
                  unfilledColor={colors.grayBackgroundColor}
                  indeterminate={true}
                />
              </View>
            )}
          </View>
        ) : null}
      </>
    );
  };

  const CancelImageUpload = (imageUploads, removeImage) => {
    imageUploads.forEach((item) => {
      removeImage(item.id);
    });
  };

  const CustomReactionComponent = () => {
    const {message} = useMessageContext();
    const {setOverlay} = useOverlayContext();

    const handleMessageReaction = async (type) => {
      const user_id = authContext.entity?.obj?.user_id;
      await channel.sendReaction(
        message.id,
        {type, user_id},
        {enforce_unique: true},
      );
      setOverlay('none');
    };

    return (
      <View
        style={{
          marginTop: 0,
          borderTopWidth: 1,
          paddingVertical: 5,
          borderColor: colors.darkGrey,
        }}>
        <View style={{flexDirection: 'row'}}>
          {newReactionData.map((Item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                handleMessageReaction(Item.type);
              }}>
              <Image
                source={Item.Icon}
                style={{
                  width: 30,
                  height: 30,
                  margin: 5,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const CustomMessageActionList = () => {
    const {message, handleQuotedReplyMessage} = useMessageContext();
    const {setOverlay} = useOverlayContext();

    const messageActions = [
      {
        action() {
          handleQuotedReplyMessage();
          setOverlay('none');
        },
        actionType: 'quotedReply',
        title: 'Reply',
      },
      {
        action() {
          setDeleteMessageObject(message);
          setDeleteMessageModal(true);
          setOverlay('none');
        },
        actionType: 'deleteMessage',
        title: 'Delete',
      },
    ];

    return (
      <View style={{backgroundColor: 'white', marginTop: 10, borderRadius: 10}}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          {messageActions.map(({actionType, ...rest}) => (
            <CustomMessageActionListItem
              actionType={actionType}
              key={actionType}
              {...rest}
            />
          ))}
          <CustomReactionComponent />
        </View>
      </View>
    );
  };

  const CustomMessageActionListItem = ({action, actionType, ...rest}) => {
    const {onTap} = useMessageActionAnimation({action});
    return (
      <>
        {actionType === 'quotedReply' ? (
          <TapGestureHandler onHandlerStateChange={onTap}>
            <Animated.View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 13,
                borderBottomWidth: 1,
                borderColor: colors.darkGrey,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  alignSelf: 'flex-start',
                  color: colors.blueColor,
                }}>
                {rest.title}
              </Text>
            </Animated.View>
          </TapGestureHandler>
        ) : (
          <>
            {actionType === 'deleteMessage' ? (
              <TapGestureHandler onHandlerStateChange={onTap}>
                <Animated.View
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 13,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      alignSelf: 'flex-start',
                      borderBottomWidth: 1,
                      borderColor: colors.lightGrayBackground,
                      color: colors.themeColor2,
                    }}>
                    {rest.title}
                  </Text>
                </Animated.View>
              </TapGestureHandler>
            ) : (
              <MessageActionListItem
                action={action}
                actionType={actionType}
                {...rest}
              />
            )}
          </>
        )}
      </>
    );
  };

  const getReactionFromType = (type) => {
    const reactionArr = [];
    allReaction.forEach((item) => {
      if (type === 'all') {
        reactionArr.push(item);
      } else if (item.type === type) {
        reactionArr.push(item);
      }
    });
    return reactionArr;
  };

  const getAllEmptyReactionCount = () => {
    const emojiTypes = [];
    const allEmojis = ['happy', 'wow', 'sad', 'correct', 'like', 'love'];
    allReaction.forEach((item) => {
      emojiTypes.push(item.type);
    });
    const uniqueArr = allEmojis.filter((obj) => emojiTypes.indexOf(obj) === -1);
    return uniqueArr.length;
  };

  const getEmojiImageUrl = (type) => {
    const result = TAB_ITEMS.find((item) => item.type === type);
    return result.url;
  };

  const RenderTabContain = () => {
    const currentItem = TAB_ITEMS[currentTab];
    const currentTabItems = [];
    allReaction.forEach((item) => {
      if (currentItem.type === 'all') {
        currentTabItems.push(item);
      } else if (currentItem.type === item.type) {
        currentTabItems.push(item);
      }
    });

    return (
      <View style={{padding: 20}}>
        {currentTabItems.map((item) => (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginRight: 15}}>
                  <Image
                    source={images.profilePlaceHolder}
                    style={{width: 25, height: 25}}
                  />
                </View>
                <View>
                  <Text style={{fontSize: 16}}>{item.user.name}</Text>
                </View>
              </View>
              <View>
                <Image
                  source={getEmojiImageUrl(item.type)}
                  style={{width: 20, height: 20}}
                />
              </View>
            </View>
          </>
        ))}
      </View>
    );
  };

  const renderTabs = useMemo(
    () => (
      <View style={{flex: 1}}>
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            height: 50,
          }}>
          {TAB_ITEMS.map(
            (item, index) =>
              getReactionFromType(item.type).length > 0 && (
                <>
                  <TouchableOpacity
                    activeOpacity={1}
                    key={index}
                    style={{
                      width: wp(100) / 7,
                      height: 45,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      setCurrentTab(index);
                    }}>
                    <View
                      style={{
                        width: '100%',
                        height: 43,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {item.type === 'all' ? (
                        <Text
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            fontSize: 16,
                            textAlign: 'center',
                          }}>
                          All {getReactionFromType(item.type).length}
                        </Text>
                      ) : (
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                            source={item.url}
                            style={{width: 15, height: 15}}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              marginLeft: 5,
                            }}>
                            {getReactionFromType(item.type).length}
                          </Text>
                        </View>
                      )}
                    </View>
                    <LinearGradient
                      colors={
                        currentTab === index
                          ? [colors.themeColor, colors.themeColor3]
                          : [colors.thinDividerColor, 'transparent']
                      }
                      style={{
                        alignSelf: 'flex-end',
                        width: '100%',
                        height: currentTab === index ? 3 : 1,
                      }}
                    />
                  </TouchableOpacity>
                </>
              ),
          )}
          {[...Array(getAllEmptyReactionCount())].map((_, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={{
                width: wp(100) / 7,
                height: 88,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <LinearGradient
                colors={[colors.thinDividerColor, 'transparent']}
                style={{
                  alignSelf: 'flex-end',
                  width: '100%',
                  height: 1,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{flex: 1, width: wp(100)}}>
          <RenderTabContain />
        </View>
      </View>
    ),
    [TAB_ITEMS, currentTab],
  );

  const CustomReplyInputPreview = () => {
    const {quotedMessage, clearQuotedMessageState} = useMessageInputContext();
    return (
      <View style={{marginBottom: 8}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {quotedMessage.attachments.length > 0 && (
              <Image
                style={{width: 30, height: 30, marginRight: 10}}
                source={{uri: quotedMessage.attachments[0].image_url}}
              />
            )}
            <View>
              <Text style={{fontSize: 14, color: colors.darkYellowColor}}>
                Reply to {renderChatTitle()}
              </Text>
              <Text style={{fontSize: 14, marginTop: 5}}>
                {quotedMessage.attachments.length > 0
                  ? 'Photo'
                  : quotedMessage.text}
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                clearQuotedMessageState();
              }}>
              <Image
                style={{width: 12, height: 12}}
                source={images.crossSingle}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.chatSeparateLine} />
      </View>
    );
  };

  const CustomReplyComponent = () => {
    const {message} = useMessageContext();
    let attachementType;
    if (message.quoted_message.attachments.length > 0) {
      if (message.quoted_message.attachments[0].type === 'image') {
        attachementType = strings.photoText;
      } else {
        attachementType =
          message.quoted_message.attachments[0].type.toUpperCase();
      }
    }
    return (
      <>
        {message.quoted_message && (
          <View
            style={{
              paddingHorizontal: 3,
              paddingVertical: 3,
            }}>
            <View
              style={{
                borderBottomColor: colors.whiteColor,
                borderBottomWidth: 1,
              }}>
              <Text style={{fontSize: 10, color: colors.themeColor2}}>
                {strings.replyTo} {renderChatTitle(channel)}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {message.quoted_message.attachments.length > 0 && (
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginRight: 10,
                      marginVertical: 5,
                    }}
                    source={{
                      uri: message.quoted_message.attachments[0].image_url,
                    }}
                  />
                )}
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.placeHolderColor,
                    marginTop: 5,
                    marginBottom: 5,
                  }}>
                  {message.quoted_message.attachments.length > 0
                    ? attachementType
                    : message.quoted_message.text}
                </Text>
              </View>
            </View>
          </View>
        )}
      </>
    );
  };

  const CustomFileUploadPreview = () => {
    const {fileUploads, setFileUploads, numberOfUploads, removeFile} =
      useMessageInputContext();

    setFileUploads(fileUploads);
    let fileState;
    fileUploads.forEach((item) => {
      fileState = item.state;
    });

    return (
      <>
        {fileUploads.length > 0 ? (
          <View style={{marginBottom: fileState === 'uploading' ? 12 : 8}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 5,
                paddingVertical: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={{width: 28, height: 28, marginRight: 10}}
                  source={{uri: fileUploads[0].url}}
                  onPress={() => {
                    CancelFileUpload(fileUploads, removeFile);
                  }}
                />
                <Text>
                  {fileState === 'uploading' ? 'Uploading' : 'Uploaded'} :{' '}
                  {numberOfUploads}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    CancelFileUpload(fileUploads, removeFile);
                  }}>
                  <Image
                    style={{width: 12, height: 12}}
                    source={images.crossSingle}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {fileState !== 'uploading' && (
              <View style={styles.chatSeparateLine} />
            )}

            {fileState === 'uploading' && (
              <View style={{position: 'absolute', bottom: -8, left: -10}}>
                <Progress.Bar
                  progress={1}
                  width={wp(100)}
                  height={5}
                  borderRadius={5}
                  borderWidth={0}
                  color={'rgba(255, 138, 1, 0.6)'}
                  unfilledColor={colors.grayBackgroundColor}
                  indeterminate={true}
                />
              </View>
            )}
          </View>
        ) : null}
      </>
    );
  };

  const CancelFileUpload = (files, removeFile) => {
    files.forEach((item) => {
      removeFile(item.id);
    });
  };

  const CustomImageGalleryComponent = () => <ImageGallery />;

  const handleChannelLeave = async () => {
    const streamChatUserId = authContext.chatClient.userID;
    const members = Object.keys(channel.state.members);
    const list = members.filter((item) =>
      item.includes(authContext.entity.uid),
    );

    const memberIds = streamChatUserId.includes('@')
      ? [...list]
      : [streamChatUserId];
    await channel.removeMembers(memberIds);

    setShowDetails(false);
    navigation.goBack();
  };

  const deleteForMe = async () => {
    try {
      await authContext.chatClient.partialUpdateMessage(
        deleteMessageObject.id,
        {
          set: {
            deleted_for_me: {
              status: true,
              user_id: [authContext.chatClient.userID],
            },
          },
        },
      );
    } catch (error) {
      Alert.alert(strings.alertmessagetitle, error.message);
    }
    setDeleteMessageModal(false);
  };

  const deleteForEveryone = async () => {
    await authContext.chatClient.deleteMessage(deleteMessageObject.id);
    setDeleteMessageModal(false);
  };

  const handleMessageDeletion = (option) => {
    Alert.alert(
      option === strings.deleteForEveryOneOption
        ? strings.deleteForEveryOne
        : strings.deleteForMe,
      '',
      [
        {
          text: strings.cancel,
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: strings.delete,
          onPress: () =>
            option === strings.deleteForEveryOneOption
              ? deleteForEveryone()
              : deleteForMe(),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={getChannelName(channel, authContext.entity.uid)}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.goBack();
        }}
        rightIcon2={images.vertical3Dot}
        rightIcon2Press={() => {
          setShowDetails(true);
        }}
        loading={false}
      />
      <View style={{flex: 1}}>
        <ChatOverlayProvider
          translucentStatusBar={false}
          topInset={0}
          MessageActionList={CustomMessageActionList}
          MessageActionListItem={CustomMessageActionListItem}
          OverlayReactionList={() => null}
          ImageGalleryFooter={CustomImageGalleryComponent}>
          <Chat style={themeStyle} client={authContext.chatClient}>
            <Channel
              channel={channel}
              MessageText={CustomMessageText}
              MessageAvatar={CustomAvatar}
              myMessageTheme={myMessageTheme}
              MessageHeader={CustomMessageHeader}
              MessageFooter={() => (
                <CustomMessageFooter
                  onPress={async (messageId) => {
                    const response = await channel.getReactions(messageId);
                    setAllReaction(response.reactions);
                    setIsVisible(true);
                  }}
                />
              )}
              ImageUploadPreview={CustomImageUploadPreview}
              ReactionList={() => null}
              InputReplyStateHeader={CustomReplyInputPreview}
              Reply={CustomReplyComponent}
              DateHeader={(props) => (
                <CustomDateSeparator date={props.dateString} />
              )}
              InlineDateSeparator={(props) => (
                <CustomDateSeparator date={props.date} />
              )}
              TypingIndicator={CustomTypingIndicator}>
              <MessageList />
              <MessageInput Input={CustomInput} />
            </Channel>
          </Chat>
        </ChatOverlayProvider>

        <CustomModalWrapper
          modalType={ModalTypes.default}
          isVisible={isVisible}
          closeModal={() => setIsVisible(false)}
          title={''}
          containerStyle={styles.modalContainer}>
          {renderTabs}
        </CustomModalWrapper>

        <BottomSheet
          type="ios"
          optionList={[
            strings.deleteForEveryOneOption,
            strings.deleteForMeOption,
          ]}
          isVisible={deleteMessageModal}
          closeModal={() => setDeleteMessageModal(false)}
          onSelect={handleMessageDeletion}
        />

        {/* Chat group details */}
        <ChatGroupDetails
          isVisible={showDetails}
          closeModal={() => setShowDetails(false)}
          channel={channel}
          currentEntityId={authContext.entity.uid}
          leaveChannel={handleChannelLeave}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: wp(95),
  },
  chatSeparateLine: {
    borderColor: colors.writePostSepratorColor,
    marginTop: 5,
    borderWidth: 0.5,
    width: wp(95),
  },
  modalContainer: {
    height: '98%',
    padding: 0,
  },
});

export default MessageChatScreen;
