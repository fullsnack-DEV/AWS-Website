import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider as ChatOverlayProvider,
  useMessageInputContext,
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
import CustomReplyComponent from './components/CustomReplyComponent';
import CustomReplyInputPreview from './components/CustomReplyInputPreview';
import CustomAvatar from './components/CustomAvatar';
import useStreamChatUtils from '../../hooks/useStreamChatUtils';
import fonts from '../../Constants/Fonts';

const MessageChatScreen = ({navigation, route}) => {
  const {channel} = route.params;
  const authContext = useContext(AuthContext);
  const {addMembersToChannel, isMemberAdding, createChannel} =
    useStreamChatUtils();

  const [isVisible, setIsVisible] = useState(false);
  const [allReaction, setAllReaction] = useState([]);
  const [deleteMessageModal, setDeleteMessageModal] = useState(false);
  const [deleteMessageObject, setDeleteMessageObject] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [messages, setMessages] = useState([]);
  const [deleteOptions, setDeleteOptions] = useState([]);
  const timeoutRef = useRef();

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

  const handleTagPress = (mentions = [], mentionText = '') => {
    const entity_name = mentionText.slice(1);
    const member = mentions.find(
      (item) => item.group_name === entity_name || item.name === entity_name,
    );
    const memberId = member.id.includes('@')
      ? member.id.split('@')[0]
      : member.id;

    if (memberId === authContext.entity.uid) {
      return;
    }

    const obj = {
      id: memberId,
      name: member.group_name ?? member.name,
      image: member.image,
      entityType: member.entityType,
    };

    createChannel([obj])
      .then(async (channelObj) => {
        if (channelObj !== null) {
          await channelObj.watch();
          navigation.replace('MessageChatScreen', {
            channel: channelObj,
          });
        }
      })
      .catch((err) => {
        Alert.alert(strings.alertmessagetitle, err.message);
      });
  };

  const getSearchData = useCallback(
    async (text = '') => {
      const channelFilters = {cid: channel.cid};
      const messageFilters = {text: {$autocomplete: text}};

      const response = await authContext.chatClient.search(
        channelFilters,
        messageFilters,
        {sort: [{relevance: -1}, {updated_at: 1}, {my_custom_field: -1}]},
      );

      setMessages(response.results);
    },
    [channel.cid, authContext.chatClient],
  );

  useEffect(() => {
    if (searchText.length > 0) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        getSearchData(searchText);
      }, 300);
    }
  }, [searchText, getSearchData]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScreenHeader
        title={getChannelName(channel, authContext.chatClient.userID)}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          navigation.replace('MessageMainScreen');
        }}
        rightIcon2={images.vertical3Dot}
        rightIcon2Press={() => {
          setShowDetails(true);
        }}
        loading={false}
        rightIcon1={showSearchInput ? images.searchLocation : images.chatSearch}
        rightIcon1Press={() => {
          setShowSearchInput(!showSearchInput);
        }}
      />
      <View style={{flex: 1}}>
        {showSearchInput ? (
          <View style={styles.floatingInput}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={strings.searchText}
                style={styles.textInputStyle}
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                }}
                placeholder={strings.searchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchText('');
                    setMessages([]);
                    setShowSearchInput(false);
                  }}>
                  <Image
                    source={images.closeRound}
                    style={{height: 15, width: 15}}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : null}

        <ChatOverlayProvider
          translucentStatusBar={false}
          topInset={0}
          MessageActionList={() => (
            <CustomMessageActionList
              channel={channel}
              streamChatUserId={authContext.chatClient.userID}
              deleteMessageAction={(messageObj = {}) => {
                setDeleteMessageObject(messageObj);
                if (messageObj.user.id === authContext.chatClient.userID) {
                  setDeleteOptions([
                    strings.deleteForEveryOneOption,
                    strings.deleteForMeOption,
                  ]);
                } else {
                  setDeleteOptions([strings.deleteForMeOption]);
                }
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
              MessageText={() => (
                <CustomMessageText onTagPress={handleTagPress} />
              )}
              MessageAvatar={() => (
                <CustomAvatar
                  channel={channel}
                  imageStyle={{width: 30, height: 30}}
                />
              )}
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
              DateHeader={() => null}
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
          optionList={deleteOptions}
          isVisible={deleteMessageModal}
          closeModal={() => setDeleteMessageModal(false)}
          onSelect={handleMessageDeletion}
        />

        {/* Chat group details */}
        <ChatGroupDetails
          isVisible={showDetails}
          closeModal={() => setShowDetails(false)}
          channel={channel}
          streamUserId={authContext.chatClient.userID}
          leaveChannel={handleChannelLeave}
          addMembers={(members = []) => {
            addMembersToChannel({channel, newMembers: members}).catch((err) => {
              Alert.alert(strings.alertmessagetitle, err.message);
            });
          }}
          loading={isMemberAdding}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: colors.whiteColor,
    height: 40,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 16,
    color: colors.lightBlackColor,
    fontFamily: fonts.RRegular,
    padding: 0,
  },
  floatingInput: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.inputBgOpacityColor,
    position: 'absolute',
    top: 0,
    zIndex: 1,
    width: '100%',
  },
});

export default MessageChatScreen;
