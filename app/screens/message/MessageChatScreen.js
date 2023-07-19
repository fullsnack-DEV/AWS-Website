import React, {useState, useContext} from 'react';
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
  MessageAvatar,
  ImageGallery,
} from 'stream-chat-react-native';
import * as Progress from 'react-native-progress';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import ScreenHeader from '../../components/ScreenHeader';
import {widthPercentageToDP as wp} from '../../utils';
import AuthContext from '../../auth/context';

import {strings} from '../../../Localization/translation';
import BottomSheet from '../../components/modals/BottomSheet';
import ChatGroupDetails from './components/ChatGroupDetails';
import {getChannelName} from '../../utils/streamChat';

import CustomTypingIndicator from './components/CustomTypingIndicator';
import CustomMessageHeader from './components/CustomMessageHeader';
import {myMessageTheme, themeStyle} from './constants';
import CustomMessageText from './components/CustomMessageText';
import CustomMessageFooter from './components/CustomMessageFooter';
import CustomDateSeparator from './components/CustomDateSeparator';
import CustomMessageActionList from './components/CustomMessageActionList';
import CustomMessageActionListItem from './components/CustomMessageActionListItem';
import ReactionsModal from './components/ReactionsModal';
import CustomInput from './components/CustomInput';
import CustomAutoCompleteSuggestionsList from './components/CustomAutoCompleteSuggestionsList';

const MessageChatScreen = ({navigation, route}) => {
  const {channel} = route.params;
  const authContext = useContext(AuthContext);

  const [isVisible, setIsVisible] = useState(false);

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
              <Text style={{fontSize: 14, color: colors.themeColor}}>
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
    console.log({message});
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
                borderBottomColor:
                  message.user.id === authContext.chatClient.userID
                    ? colors.whiteColor
                    : colors.grayBackgroundColor,
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
          MessageActionList={() => (
            <CustomMessageActionList
              channel={channel}
              deleteMessageAction={(messageObj = {}) => {
                setDeleteMessageObject(messageObj);
                setDeleteMessageModal(true);
              }}
            />
          )}
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
              TypingIndicator={CustomTypingIndicator}
              AutoCompleteSuggestionList={CustomAutoCompleteSuggestionsList}>
              <MessageList />
              <MessageInput Input={CustomInput} />
            </Channel>
          </Chat>
        </ChatOverlayProvider>

        <ReactionsModal
          isVisible={isVisible}
          closeModal={() => setIsVisible(false)}
          reactionsList={allReaction}
        />

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
  chatSeparateLine: {
    borderColor: colors.writePostSepratorColor,
    marginTop: 5,
    borderWidth: 0.5,
    width: wp(95),
  },
});

export default MessageChatScreen;
