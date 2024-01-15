/* eslint-disable no-nested-ternary */
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
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider as ChatOverlayProvider,
  ImageGallery,
} from 'stream-chat-react-native';

import {format} from 'react-string-format';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import ScreenHeader from '../../components/ScreenHeader';
import AuthContext from '../../auth/context';

import {strings} from '../../../Localization/translation';
import BottomSheet from '../../components/modals/BottomSheet';
import ChatGroupDetails from './components/ChatGroupDetails';
import {checkIsMessageDeleted, getChannelName} from '../../utils/streamChat';

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
// import CustomAvatar from './components/CustomAvatar';
import useStreamChatUtils from '../../hooks/useStreamChatUtils';
import fonts from '../../Constants/Fonts';
// import CustomMediaView from './components/CustomMediaView';
import MessageAvatar from './components/MessageAvatar';
import CustomMediaView from './components/CustomMediaView';
import CustomImageUploadPreview from './components/CustomImageUploadPreview';
import Verbs from '../../Constants/Verbs';
import {getUserDetails} from '../../api/Users';
import usePrivacySettings from '../../hooks/usePrivacySettings';
import {
  GroupDefalutPrivacyOptionsEnum,
  GroupDefaultPrivacyOptionsForDoubleTeamEnum,
  PersonalUserPrivacyEnum,
  PrivacyKeyEnum,
} from '../../Constants/PrivacyOptionsConstant';
import {getGroupDetails} from '../../api/Groups';

const MessageChatScreen = ({navigation, route}) => {
  const {channel} = route.params;
  const authContext = useContext(AuthContext);
  const {createChannel} = useStreamChatUtils();

  const [isVisible, setIsVisible] = useState(false);
  const [allReaction, setAllReaction] = useState([]);
  const [deleteMessageModal, setDeleteMessageModal] = useState(false);
  const [deleteMessageObject, setDeleteMessageObject] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [showDetails, setShowDetails] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [messages, setMessages] = useState([]);
  const [deleteOptions, setDeleteOptions] = useState([]);
  const [channelName, setChannelName] = useState('');
  const [showTagOptions, setShowTagOptions] = useState(false);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTagMember, setSelectedTagMember] = useState({});
  const timeoutRef = useRef();
  const channelInfoModalRef = useRef();
  const {getPrivacyStatus} = usePrivacySettings();

  const handleBackPress = useCallback(() => {
    navigation.setOptions({});
    if (route.params?.comeFrom === 'MembersProfileScreen') {
      navigation.navigate('MebmersStack', {
        screen: 'MembersProfileScreen',
        params: {...route.params.routeParams, from: 'chatscreen'},
      });
    } else if (route.params?.comeFrom) {
      console.log('route.params.routeParams ==>', route.params.routeParams);
      navigation.navigate(route.params.comeFrom, {
        ...route.params.routeParams,
      });
    } else {
      navigation.replace('App', {
        screen: 'Message',
      });
    }
  }, [navigation, route.params?.comeFrom, route.params.routeParams]);

  useEffect(() => {
    const backAction = () => {
      if (showSearchInput) {
        setShowSearchInput(false);
      } else if (route.params?.comeFrom) {
        handleBackPress();
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [showSearchInput, navigation, route.params, handleBackPress]);

  useEffect(() => {
    if (channel) {
      const name = getChannelName(channel, authContext.chatClient.userID);

      setChannelName(name);
    }
  }, [channel, authContext.chatClient.userID]);

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

  const handleTagPress = async (mentions = [], mentionText = '') => {
    const entity_name = mentionText.slice(1);
    const member = mentions.find(
      (item) => item.group_name ?? item.name === entity_name,
    );
    if (!member) {
      return;
    }
    const memberId = member.id.includes('@')
      ? selectedTagMember.id?.split('@')[0]
      : selectedTagMember.id;

    if (memberId === authContext.entity.uid) {
      return;
    }
    let chatPrivacyStatus = true;
    if (
      [Verbs.entityTypeTeam, Verbs.entityTypeClub].includes(member.entityType)
    ) {
      const groupId = member.id.split('@')[0];
      const response = await getGroupDetails(groupId, authContext);
      const isDoubleSportTeam =
        response.payload.sport_type === Verbs.doubleSport;
      const privacyVal = isDoubleSportTeam
        ? GroupDefaultPrivacyOptionsForDoubleTeamEnum[
            response.payload[PrivacyKeyEnum.Chats]
          ]
        : GroupDefalutPrivacyOptionsEnum[
            response.payload[PrivacyKeyEnum.Chats]
          ];
      chatPrivacyStatus = getPrivacyStatus(privacyVal, response.payload);
    } else {
      const response = await getUserDetails(member.id, authContext);
      chatPrivacyStatus = getPrivacyStatus(
        PersonalUserPrivacyEnum[response.payload[PrivacyKeyEnum.Chats]],
      );
    }

    const options = chatPrivacyStatus
      ? [
          format(strings.chatWith, entity_name),
          format(strings.goToHomeOf, entity_name),
        ]
      : [format(strings.goToHomeOf, entity_name)];

    setSelectedTagMember(member);
    setTagOptions(options);
    setShowTagOptions(true);
  };

  const handleTagOptions = (option) => {
    setShowTagOptions(false);
    const memberId = selectedTagMember.id.includes('@')
      ? selectedTagMember.id.split('@')[0]
      : selectedTagMember.id;
    if (option === tagOptions[0]) {
      const obj = {
        id: memberId,
        name: selectedTagMember.group_name ?? selectedTagMember.name,
        image: selectedTagMember.image,
        entityType: selectedTagMember.entityType,
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
    } else if (option === tagOptions[1]) {
      navigation.navigate('HomeStack', {
        screen: 'HomeScreen',
        params: {
          uid: memberId,
          role: selectedTagMember.entityType,
          comeFrom: 'MessageChatScreen',
          routeParams: channel,
        },
      });
    }
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
        title={channelName}
        leftIcon={images.backArrow}
        leftIconPress={() => {
          handleBackPress();
        }}
        rightIcon2={images.vertical3Dot}
        rightIcon2Press={() => {
          // setShowDetails(true);
          channelInfoModalRef.current?.present();
        }}
        loading={false}
        // rightIcon1={showSearchInput ? images.searchLocation : images.chatSearch}
        // rightIcon1Press={() => {
        //   setShowSearchInput(!showSearchInput);
        // }}
        iconContainerStyle={{marginRight: 10}}
      />
      <View style={{flex: 1}}>
        {showSearchInput ? (
          <View style={styles.floatingInput}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={colors.userPostTimeColor}
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
          bottomInset={0}
          MessageActionList={() => (
            <CustomMessageActionList
              channel={channel}
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
          ImageGalleryFooter={CustomImageGalleryComponent}
          value={{style: themeStyle}}>
          <Chat client={authContext.chatClient}>
            <Channel
              channel={channel}
              MessageText={() => (
                <CustomMessageText
                  onTagPress={handleTagPress}
                  onViewAll={(messageText) => {
                    navigation.navigate('LongTextMessageScreen', {
                      messageText,
                    });
                  }}
                />
              )}
              MessageAvatar={() => (
                <MessageAvatar
                  channel={channel}
                  chatUserId={authContext.chatClient.userID}
                />
              )}
              myMessageTheme={myMessageTheme}
              MessageHeader={({message}) => (
                <CustomMessageHeader message={message} channel={channel} />
              )}
              MessageFooter={() => (
                <CustomMessageFooter
                  onPress={async (messageId) => {
                    const response = await channel.getReactions(messageId);
                    setAllReaction(response.reactions);
                    setIsVisible(true);
                  }}
                />
              )}
              Gallery={() => (
                <CustomMediaView
                  chatUserId={authContext.chatClient.userID}
                  onPress={(data = {}) => {
                    navigation.navigate('MessageMediaFullScreen', {
                      ...data,
                    });
                  }}
                />
              )}
              Reply={CustomReplyComponent}
              ImageUploadPreview={CustomImageUploadPreview}
              ReactionList={() => null}
              InputReplyStateHeader={CustomReplyInputPreview}
              DateHeader={() => null}
              InlineDateSeparator={(props) => (
                <CustomDateSeparator date={props.date} />
              )}
              TypingIndicator={CustomTypingIndicator}
              AutoCompleteSuggestionList={CustomAutoCompleteSuggestionsList}
              MessageSystem={({message}) => (
                <View style={styles.systemMessageContainer}>
                  <Text style={styles.systemMessageText}>{message.text}</Text>
                </View>
              )}
              onPressMessage={({emitter, message}) => {
                if (emitter === 'gallery') {
                  const data = {
                    attachments: message.attachments,
                    entityName: message.user.name,
                    msgId: message.id,
                  };
                  navigation.navigate('MessageMediaFullScreen', {
                    ...data,
                  });
                }
              }}
              onLongPressMessage={({actionHandlers, message}) => {
                const isDeletedMessage = checkIsMessageDeleted(
                  authContext.chatClient.userID,
                  message,
                );
                if (!isDeletedMessage) {
                  actionHandlers.showMessageOverlay();
                }
              }}>
              <MessageList
                noGroupByUser
                additionalFlatListProps={{showsVerticalScrollIndicator: false}}
              />
              {!showSearchInput && <MessageInput Input={CustomInput} />}
            </Channel>
          </Chat>
        </ChatOverlayProvider>
      </View>
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

      <BottomSheet
        type="ios"
        optionList={tagOptions}
        isVisible={showTagOptions}
        closeModal={() => setShowTagOptions(false)}
        onSelect={handleTagOptions}
      />
      {/* Chat group details */}
      <ChatGroupDetails
        // isVisible={showDetails}
        closeModal={() => setShowDetails(false)}
        channel={channel}
        streamUserId={authContext.chatClient.userID}
        leaveChannel={handleChannelLeave}
        newChannelCreated={async (channelObj) => {
          await channelObj.watch();
          navigation.replace('MessageChatScreen', {
            channel: channelObj,
          });
        }}
        modalRef={channelInfoModalRef}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  systemMessageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  systemMessageText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.userPostTimeColor,
    fontFamily: fonts.RMedium,
    textAlign: 'center',
  },
});

export default MessageChatScreen;
