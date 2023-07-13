import React, {useContext} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import CustomAvatar from './CustomAvatar';
import {getChannelName, getLastMessageTime} from '../../../utils/streamChat';
import AuthContext from '../../../auth/context';

const ChannelView = ({channel, latestMessagePreview}) => {
  const {state} = channel;
  const {navigate} = useNavigation();
  const authContext = useContext(AuthContext);

  const getLastMessage = () => {
    if (latestMessagePreview.messageObject?.text) {
      return latestMessagePreview.messageObject.text;
    }

    if (latestMessagePreview.messageObject?.attachments?.length > 0) {
      return 'Photo';
    }
    return strings.emptyChatMessage;
  };

  return (
    <Pressable
      onPress={async () => {
        await channel.watch();
        navigate('MessageChatScreen', {channel});
      }}
      style={styles.parent}>
      <View style={styles.userDetails}>
        <CustomAvatar channel={channel} />
        <View style={{flex: 1}}>
          <Text style={styles.channelTitle} numberOfLines={1}>
            {getChannelName(channel, authContext.entity.uid)}
          </Text>
          <Text style={styles.channelLowerText}>{getLastMessage()}</Text>
        </View>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <Text style={styles.channelAge}>{getLastMessageTime(channel)}</Text>

        {state.unreadCount > 0 ? (
          <View style={styles.channelUnreadCount}>
            <Text style={styles.channelUnreadText}>{state.unreadCount}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  userDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  channelTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.lightBlackColor,
    fontFamily: fonts.RMedium,
  },
  channelLowerText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.RRegular,
    color: colors.placeHolderColor,
  },
  channelAge: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fonts.RRegular,
    color: colors.placeHolderColor,
  },
  channelUnreadCount: {
    marginTop: 5,
    borderRadius: 50,
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'center',
    backgroundColor: colors.redColorCard,
  },
  channelUnreadText: {
    color: colors.whiteColor,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});

export default ChannelView;
