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
  useMessageInputContext,
  ImageGallery,
} from 'stream-chat-react-native';
import * as Progress from 'react-native-progress';
import {format} from 'react-string-format';
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
// import CustomAvatar from './components/CustomAvatar';
import useStreamChatUtils from '../../hooks/useStreamChatUtils';
import fonts from '../../Constants/Fonts';
import CustomMediaView from './components/CustomMediaView';
import MessageAvatar from './components/MessageAvatar';

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

  const handleBackPress = useCallback(() => {
    navigation.setOptions({});
    if (route.params?.comeFrom === 'MembersProfileScreen') {
      navigation.navigate('NewsFeed', {
        screen: 'MembersProfileScreen',
        params: {...route.params.routeParams, from: 'chatscreen'},
      });
    } else if (route.params?.comeFrom) {
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
                  source={{
                    uri: imageUploads[0].url ?? imageUploads[0].thumb_url,
                  }}
                  onPress={() => {
                    CancelImageUpload(imageUploads, removeImage);
                  }}
                />
                <Text>
                  {imageState === 'uploading'
                    ? `${strings.uploadingText}... ${numberOfUploads}`
                    : strings.uploadedText}
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

    const options = [
      format(strings.chatWith, entity_name),
      format(strings.goToHomeOf, entity_name),
    ];

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
      navigation.navigate('Account', {
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
        rightIcon1={showSearchInput ? images.searchLocation : images.chatSearch}
        rightIcon1Press={() => {
          setShowSearchInput(!showSearchInput);
        }}
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
              MessageAvatar={() => <MessageAvatar channel={channel} />}
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
                  onPress={(data = {}) => {
                    navigation.navigate('MessageMediaFullScreen', {
                      ...data,
                    });
                  }}
                  onLongPress={() => {
                    console.log('long pressed');
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
              AutoCompleteSuggestionList={CustomAutoCompleteSuggestionsList}>
              <MessageList
                noGroupByUser
                additionalFlatListProps={{showsVerticalScrollIndicator: false}}
              />
              {!showSearchInput && <MessageInput Input={CustomInput} />}
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

        <BottomSheet
          type="ios"
          optionList={tagOptions}
          isVisible={showTagOptions}
          closeModal={() => setShowTagOptions(false)}
          onSelect={handleTagOptions}
        />
      </View>
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
