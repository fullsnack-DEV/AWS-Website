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
import UserListShimmer from '../../components/shimmer/commonComponents/UserListShimmer';
import TCAccountDeactivate from '../../components/TCAccountDeactivate';
import {strings} from '../../../Localization/translation';
import {getStreamChatIdBasedOnRole} from '../../utils/streamChat';
import ChannelView from './components/ChannelView';

const MessageMainScreen = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [streamChatId, setStreamChatId] = useState('');

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: isFocused ? 'flex' : 'none',
      },
    });
  }, [navigation, isFocused]);

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

  const LiseEmptyComponent = () => (
    <View style={styles.centerMsgContainer}>
      <Text style={styles.noMsgText}>{strings.noChat}</Text>
      <Text style={styles.msgAppearText}>{strings.newChatsAppear}</Text>
    </View>
  );

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
              navigation.navigate('MessageInviteScreen');
            }}>
            <Image source={images.chatCreate} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.navigate('MessageSearchScreen');
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
                sort={[{last_message_at: -1}]}
                Preview={ChannelView}
                LoadingIndicator={() => <UserListShimmer />}
                EmptyStateIndicator={() => LiseEmptyComponent()}
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
