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
import {useIsFocused} from '@react-navigation/native';
import images from '../../Constants/ImagePath';
import colors from '../../Constants/Colors';
import fonts from '../../Constants/Fonts';
import AuthContext from '../../auth/context';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import {strings} from '../../../Localization/translation';
import {getStreamChatIdBasedOnRole} from '../../utils/streamChat';
import ChannelView from './components/ChannelView';
import Verbs from '../../Constants/Verbs';
import ChatShimmer from '../../components/shimmer/Chat/ChatShimmer';

const MessageMainScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [streamChatId, setStreamChatId] = useState('');

  const getUserChannel = useCallback(() => {
    getStreamChatIdBasedOnRole(authContext).then((chatId) => {
      setStreamChatId(chatId);
    });
  }, [authContext]);

  useEffect(() => {
    if (isFocused) {
      getUserChannel();
    }
  }, [isFocused, getUserChannel]);

  const ListEmptyComponent = () => (
    <View style={styles.centerMsgContainer}>
      <Text style={styles.noMsgText}>{strings.noChat}</Text>
      <Text style={styles.msgAppearText}>{strings.newChatsAppear}</Text>
    </View>
  );

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
              navigation.navigate('MessageStack', {
                screen: 'MessageInviteScreen',
              });
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
      {streamChatId && authContext.chatClient ? (
        <View style={{flex: 1}}>
          <ChatOverlayProvider>
            <Chat client={authContext.chatClient}>
              <ChannelList
                filters={{members: {$in: [streamChatId]}}}
                channelRenderFilterFn={customChannelFilterFunction}
                sort={[{last_message_at: -1}]}
                Preview={ChannelView}
                LoadingIndicator={() => <ChatShimmer />}
                EmptyStateIndicator={() => ListEmptyComponent()}
              />
            </Chat>
          </ChatOverlayProvider>
        </View>
      ) : null}
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
    resizeMode: 'cover',
  },
  centerMsgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMsgText: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    fontFamily: fonts.RBold,
    color: colors.veryLightBlack,
  },
  msgAppearText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RRegular,
    color: colors.veryLightBlack,
  },
});

export default MessageMainScreen;
