import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {format} from 'react-string-format';
import colors from '../../../Constants/Colors';
import {strings} from '../../../../Localization/translation';
import fonts from '../../../Constants/Fonts';
import CustomAvatar from './CustomAvatar';
import {
  getChannelMembers,
  getChannelName,
  getLastMessageTime,
} from '../../../utils/streamChat';
import images from '../../../Constants/ImagePath';
import Verbs from '../../../Constants/Verbs';
import AuthContext from '../../../auth/context';

const ChannelView = ({channel, latestMessagePreview}) => {
  const {state, data} = channel;
  const {navigate} = useNavigation();
  const authContext = useContext(AuthContext);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const members = getChannelMembers(channel);
    setMemberCount(members.length);
  }, [channel]);

  const getLastMessage = () => {
    if (latestMessagePreview.messageObject?.text) {
      return latestMessagePreview.messageObject.text;
    }

    if (latestMessagePreview.messageObject?.attachments?.length > 0) {
      return 'Photo';
    }

    return format(
      strings.createdChatRoom,
      data.created_by.group_name ?? data.created_by.name,
    );
  };

  return (
    <TouchableHighlight
      onPress={async () => {
        await channel.watch();
        navigate('MessageChatScreen', {channel});
      }}
      underlayColor={colors.grayBackgroundColor}
      style={styles.parent}>
      <>
        <View style={styles.userDetails}>
          <CustomAvatar channel={channel} />
          <View style={{flex: 1}}>
            <View style={styles.channelNameContainer}>
              <View style={{maxWidth: '80%'}}>
                <Text style={styles.channelTitle} numberOfLines={1}>
                  {getChannelName(channel, authContext.chatClient.userID)}
                </Text>
              </View>

              {data.channel_type === Verbs.channelTypeAuto ? (
                <View style={styles.channelBadgeContainer}>
                  <Image
                    source={images.autoChannelBadge}
                    style={styles.image}
                  />
                </View>
              ) : null}

              <Text
                style={[
                  styles.memberCount,
                  data.channel_type === Verbs.channelTypeAuto
                    ? {}
                    : {marginLeft: 10},
                ]}>
                {memberCount}
              </Text>
            </View>
            <Text style={styles.channelLowerText} numberOfLines={1}>
              {getLastMessage()}
            </Text>
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
      </>
    </TouchableHighlight>
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
  channelNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  channelBadgeContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  memberCount: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.RMedium,
    color: colors.userPostTimeColor,
  },
});

export default ChannelView;
