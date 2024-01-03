import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Chat,
  OverlayProvider as ChatOverlayProvider,
  ChannelList,
} from 'stream-chat-react-native';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import {strings} from '../../../Localization/translation';
import ChannelView from './components/ChannelView';
import Verbs from '../../Constants/Verbs';
import ChatShimmer from '../../components/shimmer/Chat/ChatShimmer';
import {connectUserToStreamChat} from '../../utils/streamChat';
import {useTabBar} from '../../context/TabbarContext';
import ListEmptyComponent from '../../components/NoDataComponents/ListEmptyComponent';
import MessageInviteScreen from './MessageInviteScreen';
import MessageNewGroupScreen from './MessageNewGroupScreen';

const MessageMainScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [selectedInviteesList, setSelectedInviteesList] = useState([]);

  const {toggleTabBar} = useTabBar();

  useEffect(() => {
    // Set TabBar visibility to true when this screen mounts
    toggleTabBar(true);

    return () => {
      // Set TabBar visibility to false when this screen unmounts
      toggleTabBar(false);
    };
  }, [toggleTabBar]);

  const handleUserConnection = useCallback(async () => {
    setLoading(true);
    await connectUserToStreamChat(authContext);
    setLoading(false);
  }, [authContext]);

  useEffect(() => {
    if (authContext.chatClient && !authContext.chatClient?.userID) {
      handleUserConnection();
    }
  }, [authContext.chatClient, handleUserConnection]);

  const customChannelFilterFunction = (channels = []) => {
    const channelsList = [...channels];
    if (
      authContext.entity.role === Verbs.entityTypeClub ||
      authContext.entity.role === Verbs.entityTypeTeam
    ) {
      const index = channelsList.findIndex(
        (channel) => channel.data.id === authContext.entity.uid,
      );
      const objectToMove = channelsList[index];

      if (index !== -1) {
        channelsList.splice(index, 1);
        channelsList.unshift(objectToMove);
      }
    }
    return channelsList;
  };

  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.headerRow}>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>{strings.chatsTitle}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.iconContainer, {marginRight: 15}]}
            onPress={() => {
              setShowInviteModal(true);
            }}>
            <Image source={images.chatCreate} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.navigate('MessageStack', {
                screen: 'MessageSearchScreen',
              });
            }}>
            <Image source={images.chatSearch} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {authContext.isAccountDeactivated && <TCAccountDeactivate />}
      {loading && <ChatShimmer />}
      {authContext.chatClient?.userID && !loading ? (
        <View style={{flex: 1}}>
          <ChatOverlayProvider>
            <Chat client={authContext.chatClient}>
              <ChannelList
                filters={{members: {$in: [authContext.chatClient.userID]}}}
                channelRenderFilterFn={customChannelFilterFunction}
                sort={[{last_message_at: -1}]}
                Preview={ChannelView}
                LoadingIndicator={() => <ChatShimmer />}
                EmptyStateIndicator={() => (
                  <ListEmptyComponent
                    title={strings.noChat}
                    subTitle={strings.newChatsAppear}
                    imageUrl={images.chatNoData}
                  />
                )}
              />
            </Chat>
          </ChatOverlayProvider>
        </View>
      ) : null}

      <MessageInviteScreen
        isVisible={showInviteModal}
        closeModal={() => setShowInviteModal(false)}
        onCreateChannel={(channel) => {
          setShowInviteModal(false);
          navigation.navigate('MessageStack', {
            screen: 'MessageChatScreen',
            params: {
              channel,
            },
          });
        }}
        onCreateNewGroup={(selectedInvitees) => {
          setSelectedInviteesList(selectedInvitees);
          setShowNewGroupModal(true);
        }}
        selectedInviteesData={selectedInviteesList}
      />

      <MessageNewGroupScreen
        isVisible={showNewGroupModal}
        closeModal={(updatedInviteeList = []) => {
          setSelectedInviteesList(updatedInviteeList);
          setShowNewGroupModal(false);
        }}
        selectedInviteesData={selectedInviteesList}
        onCreateChannel={(channel) => {
          setShowInviteModal(false);
          setShowNewGroupModal(false);
          navigation.navigate('MessageStack', {
            screen: 'MessageChatScreen',
            params: {
              channel,
            },
          });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackgroundColor,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.offwhite,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: fonts.RBold,
    color: colors.lightBlackColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain ',
  },
});

export default MessageMainScreen;
